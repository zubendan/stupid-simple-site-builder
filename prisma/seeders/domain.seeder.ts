import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';

export const seedDomains = async (db: PrismaClient) => {
  if (await db.domain.count()) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(`Domain table not empty; skipping seeding. (domain.seeder.ts)`);
    return;
  }

  const domains: Prisma.DomainUncheckedCreateInput[] = [];

  for (let i = 0; i < 100; i++) {
    domains.push({
      displayName: faker.internet.domainName(),
      domain: faker.internet.domainName(),
      organizationId: faker.number.int({ min: 1, max: 99 }),
      templateId: faker.number.int({ min: 1, max: 99 }),
    });
  }

  await db.domain.createMany({ data: domains });
};
