/* import { Client } from '../src/generated/';
import sampleData from '../sample-data';

const  = new Client();

async function main() {
  await .product.deleteMany();
  await .account.deleteMany();
  await .session.deleteMany();
  await .verificationToken.deleteMany();
  await .user.deleteMany();

  await .product.createMany({
    data: sampleData.products,
  });
  await .user.createMany({
    data: sampleData.users,
  });

  console.log('✅ DB seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await .$disconnect();
  });
 */ 
