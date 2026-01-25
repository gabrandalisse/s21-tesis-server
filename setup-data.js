const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up initial data...');

  // Create pet types
  const dogType = await prisma.petType.upsert({
    where: { name: 'Dog' },
    update: {},
    create: { name: 'Dog' }
  });

  const catType = await prisma.petType.upsert({
    where: { name: 'Cat' },
    update: {},
    create: { name: 'Cat' }
  });

  const birdType = await prisma.petType.upsert({
    where: { name: 'Bird' },
    update: {},
    create: { name: 'Bird' }
  });

  const otherType = await prisma.petType.upsert({
    where: { name: 'Other' },
    update: {},
    create: { name: 'Other' }
  });

  // Create pet breeds (check if exists first since there's no unique constraint)
  const breeds = [
    { name: 'Golden Retriever', typeId: dogType.id },
    { name: 'Labrador', typeId: dogType.id },
    { name: 'German Shepherd', typeId: dogType.id },
    { name: 'Bulldog', typeId: dogType.id },
    { name: 'Poodle', typeId: dogType.id },
    { name: 'Siamese', typeId: catType.id },
    { name: 'Persian', typeId: catType.id },
    { name: 'Maine Coon', typeId: catType.id },
    { name: 'British Shorthair', typeId: catType.id },
    { name: 'Mixed Breed', typeId: dogType.id },
    { name: 'Mixed Breed', typeId: catType.id },
    { name: 'Unknown', typeId: dogType.id },
    { name: 'Unknown', typeId: catType.id },
    { name: 'Unknown', typeId: birdType.id },
    { name: 'Unknown', typeId: otherType.id }
  ];

  for (const breed of breeds) {
    // Check if breed already exists for this type
    const existingBreed = await prisma.petBreed.findFirst({
      where: {
        name: breed.name,
        typeId: breed.typeId
      }
    });

    if (!existingBreed) {
      await prisma.petBreed.create({
        data: breed
      });
    }
  }

  // Create pet colors
  const colors = [
    'Black', 'White', 'Brown', 'Golden', 'Gray', 'Cream', 
    'Orange', 'Tabby', 'Calico', 'Tricolor', 'Spotted', 'Mixed'
  ];

  for (const color of colors) {
    await prisma.petColor.upsert({
      where: { name: color },
      update: {},
      create: { name: color }
    });
  }

  // Create pet sizes
  const sizes = ['Small', 'Medium', 'Large', 'Extra Large'];

  for (const size of sizes) {
    await prisma.petSize.upsert({
      where: { name: size },
      update: {},
      create: { name: size }
    });
  }

  // Create pet sexes
  const sexes = ['Male', 'Female', 'Unknown'];

  for (const sex of sexes) {
    await prisma.petSex.upsert({
      where: { name: sex },
      update: {},
      create: { name: sex }
    });
  }

  // Create report types
  await prisma.reportType.upsert({
    where: { name: 'Lost' },
    update: {},
    create: { name: 'Lost' }
  });

  await prisma.reportType.upsert({
    where: { name: 'Found' },
    update: {},
    create: { name: 'Found' }
  });

  console.log('Initial data setup completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });