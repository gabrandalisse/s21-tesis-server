const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function checkReferenceData() {
  console.log('Checking reference data...');

  try {
    // Check report types
    const reportTypes = await prisma.reportType.findMany();
    console.log('Report Types:', reportTypes.map(rt => `${rt.id}: ${rt.name}`));

    // Check pet types
    const petTypes = await prisma.petType.findMany();
    console.log('Pet Types:', petTypes.map(pt => `${pt.id}: ${pt.name}`));

    // Check pet breeds (first 10)
    const petBreeds = await prisma.petBreed.findMany({ take: 10 });
    console.log('Pet Breeds (first 10):', petBreeds.map(pb => `${pb.id}: ${pb.name} (type: ${pb.typeId})`));

    // Check pet colors
    const petColors = await prisma.petColor.findMany();
    console.log('Pet Colors:', petColors.map(pc => `${pc.id}: ${pc.name}`));

    // Check pet sizes
    const petSizes = await prisma.petSize.findMany();
    console.log('Pet Sizes:', petSizes.map(ps => `${ps.id}: ${ps.name}`));

    // Check pet sexes
    const petSexes = await prisma.petSex.findMany();
    console.log('Pet Sexes:', petSexes.map(ps => `${ps.id}: ${ps.name}`));

    console.log('\nReference data check completed!');
  } catch (error) {
    console.error('Error checking reference data:', error);
  }
}

checkReferenceData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });