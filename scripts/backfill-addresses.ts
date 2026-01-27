import { PrismaClient } from '../generated/prisma';
import { GeocodingUtils } from '../src/utils/geocoding.utils';

const prisma = new PrismaClient();

async function backfillAddresses() {
  console.log('Starting address backfill...');

  // Get all reports without addresses
  const reportsWithoutAddress = await prisma.report.findMany({
    where: {
      OR: [
        { address: null },
        { address: '' },
      ],
    },
    select: {
      id: true,
      lat: true,
      long: true,
    },
  });

  console.log(`Found ${reportsWithoutAddress.length} reports without addresses`);

  let successCount = 0;
  let errorCount = 0;

  for (const report of reportsWithoutAddress) {
    try {
      console.log(`Geocoding report ${report.id}...`);
      const address = await GeocodingUtils.reverseGeocode(report.lat, report.long);

      await prisma.report.update({
        where: { id: report.id },
        data: { address },
      });

      console.log(`✓ Updated report ${report.id}: ${address}`);
      successCount++;

      // Add delay to respect Nominatim usage policy (max 1 request per second)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`✗ Failed to geocode report ${report.id}:`, error.message);
      errorCount++;
    }
  }

  console.log('\nBackfill complete!');
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);

  await prisma.$disconnect();
}

backfillAddresses()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
