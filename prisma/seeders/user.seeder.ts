import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { SystemRoleType } from '~/types/role';

export const seedUsers = async (db: PrismaClient) => {
  if (await db.user.count()) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(`User table not empty; skipping seeding. (user.seeder.ts)`);
    return;
  }

  const users: Prisma.UserCreateManyInput[] = [];

  const defaultRole = await db.systemRole.findFirstOrThrow({
    where: { name: SystemRoleType.USER },
  });

  const organizations = await db.organization.findMany({
    include: {
      organizationRoles: true,
    },
  });

  for (let i = 0; i < 100; i++) {
    users.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
    });
  }

  await db.user.createMany({ data: users });

  const seededUsers = await db.user.findMany({
    select: { id: true },
  });

  for (const user of seededUsers) {
    const orgIdx = faker.number.int({ min: 0, max: organizations.length - 1 });
    const org = organizations[orgIdx];
    const orgRole = org?.organizationRoles[1];
    await db.user.update({
      where: { id: user.id },
      data: {
        userSystemRoles: {
          create: {
            roleId: defaultRole.id,
          },
        },
        ...(org
          ? {
              organizationUsers: {
                create: {
                  organizationId: org.id,
                  ...(orgRole
                    ? {
                        organizationUserRoles: {
                          create: {
                            roleId: orgRole.id,
                          },
                        },
                      }
                    : {}),
                },
              },
            }
          : {}),
      },
    });
  }
};
