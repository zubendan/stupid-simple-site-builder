import { PrismaClient } from '@prisma/client';
import { allOrgPermissions, allSystemPermissions } from '~/types/permissions';

export const seedPermissions = async (db: PrismaClient) => {
  if (await db.permission.count()) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(
      `Permission table not empty; skipping seeding. (permission.seeder.ts)`,
    );
    return;
  }

  await db.permission.createMany({
    data: allOrgPermissions.map((op) => ({ name: op })),
  });
  await db.permission.createMany({
    data: allSystemPermissions.map((sp) => ({ name: sp })),
  });
};
