import { faker } from "@faker-js/faker";
import { env } from "~/env";

import { db } from "~/server/db";
import { seedPermissions } from "./permission.seeder";
import { seedOrganizations } from "./organization.seeder";
import { seedSystemRoles } from "./systemRoles.seeder";

faker.seed(2098);

async function seed() {
  // eslint-disable-next-line no-console
  console.log(`Seeding DB...`);
  const start = performance.now();

    // const { NODE_ENV } = env;

    await seedPermissions(db);
    await seedSystemRoles(db);
    await seedOrganizations(db);

    // switch(NODE_ENV) {
    //     case "test":
    //     case "development": {
    //     }
    //     case "production": {

    //     }
    // }

const end = performance.now();
  // eslint-disable-next-line no-console
  console.log(`Seeding completed successfully in ${ end - start }ms`);
}

seed()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding error:", e);
    await db.$disconnect();
    process.exit(1);
  });
