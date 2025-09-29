import { PrismaClient } from '../src/generated/prisma';
import sampleData from '../sample-data';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: sampleData.products,
  });

  console.log('✅ DB seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
