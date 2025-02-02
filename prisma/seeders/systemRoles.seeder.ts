import { PrismaClient } from "@prisma/client";
import { allSystemRoles } from "~/types/role";

export const seedSystemRoles = async (db: PrismaClient) => {
    if (await db.systemRole.count()) {
        // eslint-disable-next-line no-console
        console.log(
          `SystemRole table not empty; skipping seeding. (systemRole.seeder.ts)`,
        );
        return;
    }

    await db.systemRole.createMany({ data: allSystemRoles.map((r) => ({name: r})) });
}