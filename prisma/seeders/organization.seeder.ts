import { faker } from "@faker-js/faker";
import { PrismaClient, Prisma } from "@prisma/client";

export const seedOrganizations = async (db: PrismaClient) => {
    if (await db.organization.count()) {
        // eslint-disable-next-line no-console
        console.log(
          `Organization table not empty; skipping seeding. (organization.seeder.ts)`,
        );
        return;
    }

    const organizations: Prisma.OrganizationUncheckedCreateInput[] = [];

    for (let i = 0; i < 100; i++) {
        organizations.push({
            name: `${faker.company.name()}`
        })
    }

    await db.organization.createMany({ data: organizations });
}