import { Logger } from '@nestjs/common';

export interface Coordinates {
  lat: number;
  lng: number;
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
}

interface NominatimResponse {
  display_name?: string;
  address?: NominatimAddress;
}

export class GeocodingUtils {
  private static readonly logger = new Logger(GeocodingUtils.name);
  private static readonly USER_AGENT = 'PetFinder-App/1.0';
  private static readonly NOMINATIM_BASE_URL =
    'https://nominatim.openstreetmap.org';

  /**
   * Convert coordinates to a human-readable address using reverse geocoding
   * Uses OpenStreetMap's Nominatim service (free, no API key required)
   */
  static async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      this.logger.log(`Reverse geocoding coordinates: ${lat}, ${lng}`);

      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
        {
          headers: {
            'User-Agent': this.USER_AGENT,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = (await response.json()) as NominatimResponse;

      if (data.display_name) {
        // Extract relevant parts of the address
        const address = data.address || {};
        const parts: string[] = [];

        // Add street info if available
        if (address.house_number && address.road) {
          parts.push(`${address.house_number} ${address.road}`);
        } else if (address.road) {
          parts.push(address.road);
        }

        // Add neighborhood or suburb
        const neighborhood = address.neighbourhood || address.suburb;
        if (neighborhood) {
          parts.push(neighborhood);
        }

        // Add city
        const city = address.city || address.town || address.village;
        if (city) {
          parts.push(city);
        }

        // Add state/province
        if (address.state) {
          parts.push(address.state);
        }

        // Return formatted address or fall back to display_name
        const formattedAddress =
          parts.length > 0 ? parts.join(', ') : data.display_name;
        this.logger.log(`Geocoded address: ${formattedAddress}`);
        return formattedAddress;
      }

      // Fallback to coordinates if no address found
      const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      this.logger.warn(`No address found, using coordinates: ${fallback}`);
      return fallback;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error in reverse geocoding: ${errorMessage}`);
      // Fallback to coordinates
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }

  /**
   * Batch reverse geocode multiple coordinates
   * Includes delay between requests to respect Nominatim usage policy
   */
  static async batchReverseGeocode(
    coordinates: Array<{ lat: number; lng: number }>,
  ): Promise<string[]> {
    const addresses: string[] = [];

    for (const coord of coordinates) {
      const address = await this.reverseGeocode(coord.lat, coord.lng);
      addresses.push(address);

      // Add a small delay between requests to respect Nominatim usage policy (max 1 request per second)
      if (coordinates.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return addresses;
  }
}
