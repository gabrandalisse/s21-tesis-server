# Geocoding Migration - Backend Implementation

## Overview
This document describes the migration of geocoding logic from the frontend to the backend. Previously, the frontend was responsible for converting latitude/longitude coordinates to human-readable addresses using reverse geocoding. Now, this logic has been moved to the backend for better performance and consistency.

## Changes Made

### 1. Database Schema
- **Added `address` field** to the `Report` model in `prisma/schema.prisma`
- Field type: `String?` (optional/nullable)
- Migration: `20260127215313_add_address_to_report`

### 2. Backend Changes

#### New Files
- **`src/utils/geocoding.utils.ts`**: Utility class for geocoding operations
  - `reverseGeocode(lat, lng)`: Converts coordinates to address
  - `batchReverseGeocode()`: Batch processing with rate limiting
  - Uses OpenStreetMap's Nominatim API (free, no API key required)

#### Modified Files
- **`src/report/entities/report.entity.ts`**
  - Added `address` field to the Report entity
  - Added `getAddress()` getter method

- **`src/report/mappers/report.mapper.ts`**
  - Updated mapper to include address field when converting from Prisma to domain entity

- **`src/report/services/report.service.ts`**
  - **On report creation**: Automatically geocodes coordinates and stores address
  - **On report retrieval**: Backfills missing addresses in the background
  - Added `geocodeReportsInBackground()` method for async address updates
  - Respects Nominatim usage policy (1 request per second)

### 3. Frontend Changes

#### Modified Files
- **`src/services/api.ts`**
  - Added `address?: string` field to the `Report` interface

- **`src/store/petStore.ts`**
  - Removed import of `reverseGeocode` from `@/utils/geocoding`
  - Updated `convertApiReportToStoreReport()` to use address from API
  - Falls back to coordinates if address is not available

#### Unchanged Files
- **`src/utils/geocoding.ts`**: Still used for address autocomplete during report creation
- **`src/components/AddressAutocomplete.tsx`**: Still uses forward geocoding for address search
- **`src/components/ReportMap.tsx`**: May still use reverse geocoding as fallback for display

## Benefits

1. **Performance**: Addresses are computed once on the backend and cached in the database
2. **Consistency**: All reports use the same geocoding service and format
3. **Reduced API calls**: Frontend no longer makes geocoding requests for each report
4. **Better UX**: Addresses load instantly from the database instead of waiting for API calls
5. **Scalability**: Backend can batch process and rate-limit geocoding requests

## Usage

### For New Reports
When creating a report, the backend automatically geocodes the coordinates:
```typescript
POST /api/report
{
  "lat": 40.7128,
  "long": -74.0060,
  // ... other fields
}

// Response includes address
{
  "id": 1,
  "lat": 40.7128,
  "long": -74.0060,
  "address": "Broadway, Manhattan, New York",
  // ... other fields
}
```

### For Existing Reports
Run the backfill script to add addresses to existing reports:
```bash
cd tesis-server
npm run backfill:addresses
```

This script:
- Finds all reports without addresses
- Geocodes their coordinates
- Updates the database
- Respects rate limits (1 request per second)

### Automatic Backfilling
The backend also automatically backfills addresses when fetching reports:
- If a report doesn't have an address, it's geocoded in the background
- This happens asynchronously and doesn't block the API response
- Subsequent requests will return the cached address

## API Changes

### Report Response Format
```typescript
{
  "id": number,
  "lat": number,
  "long": number,
  "address": string | null,  // NEW FIELD
  // ... other fields
}
```

## Rate Limiting

The implementation respects OpenStreetMap's Nominatim usage policy:
- Maximum 1 request per second
- User-Agent header included: "PetFinder-App/1.0"
- Graceful fallback to coordinates if geocoding fails

## Error Handling

If geocoding fails:
1. The address field will contain coordinates as fallback: "40.7128, -74.0060"
2. The error is logged but doesn't prevent report creation/retrieval
3. The system will retry on next fetch if address is still missing

## Testing

To test the implementation:
1. Create a new report and verify it has an address
2. Check existing reports load with addresses
3. Run the backfill script on test data
4. Verify rate limiting works correctly

## Future Improvements

1. Add caching layer for frequently geocoded coordinates
2. Support multiple geocoding providers (fallback)
3. Add address validation and normalization
4. Implement batch geocoding for bulk imports
5. Add monitoring for geocoding success rates
