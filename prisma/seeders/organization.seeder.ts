import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';

export const seedOrganizations = async (db: PrismaClient) => {
  if (await db.organization.count()) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(
      `Organization table not empty; skipping seeding. (organization.seeder.ts)`,
    );
    return;
  }

  const organizations: Prisma.OrganizationUncheckedCreateInput[] = [];

  for (let i = 0; i < 100; i++) {
    organizations.push({
      name: `${faker.company.name()}`,
      organizationRoles: {
        create: {
          name: 'Admin',
          description: 'Role with all permissions',
        },
      },
    });
  }

  await db.organization.createMany({ data: organizations });
};
