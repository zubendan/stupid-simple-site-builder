import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';

export const seedDomains = async (db: PrismaClient) => {
  if (await db.domain.count()) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(`Domain table not empty; skipping seeding. (domain.seeder.ts)`);
    return;
  }

  const domains: Prisma.DomainUncheckedCreateInput[] = [];

  const templates = await db.organizationTemplate.findMany();

  for (const template of templates) {
    for (let i = 0; i < 50; i++) {
      domains.push({
        displayName: faker.internet.domainName(),
        domain: faker.internet.domainName(),
        organizationId: template.organizationId,
        templateId: template.templateId,
      });
    }
  }

  await db.domain.createMany({ data: domains });
};
