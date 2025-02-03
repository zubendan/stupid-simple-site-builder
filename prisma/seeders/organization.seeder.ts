import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { allOrgPermissions } from '~/types/permissions';

export const seedOrganizations = async (db: PrismaClient) => {
  if (await db.organization.count()) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(
      `Organization table not empty; skipping seeding. (organization.seeder.ts)`,
    );
    return;
  }

  const organizations: Prisma.OrganizationCreateManyInput[] = [];

  for (let i = 0; i < 100; i++) {
    organizations.push({
      name: `${faker.company.name()}`,
    });
  }

  await db.organization.createMany({ data: organizations });

  const seededOrganizations = await db.organization.findMany();
  for (const org of seededOrganizations) {
    await db.organizationRole.create({
      data: {
        organizationId: org.id,
        name: 'Admin',
        description: 'Role with all permissions',
        rolePermissions: {
          create: allOrgPermissions.map((p) => ({
            organizationId: org.id,
            permission: {
              connect: {
                name: p,
              },
            },
          })),
        },
      },
    });
  }
};
