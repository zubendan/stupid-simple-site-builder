import { faker } from '@faker-js/faker';

import { db } from '~/server/db';
import { seedOrganizations } from './organization.seeder';
import { seedPermissions } from './permission.seeder';
import { seedSystemRoles } from './systemRoles.seeder';
import { seedUsers } from './user.seeder';
import { seedTemplates } from './template.seeder';
import { seedDomains } from './domain.seeder';

faker.seed(2098);

async function seed() {
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log(`Seeding DB...`);
  const start = performance.now();

  // const { NODE_ENV } = env;

  await seedPermissions(db);
  await seedSystemRoles(db);
  await seedOrganizations(db);
  await seedUsers(db);
  await seedTemplates(db);
  // await seedDomains(db);

  // switch(NODE_ENV) {
  //     case "test":
  //     case "development": {
  //     }
  //     case "production": {

  //     }
  // }

  const end = performance.now();
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log(`Seeding completed successfully in ${end - start}ms`);
}

seed()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding error:', e);
    await db.$disconnect();
    process.exit(1);
  });
