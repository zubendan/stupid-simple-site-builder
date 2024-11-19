import { Organization, Prisma, PrismaClient } from '@prisma/client';
import { RoleType } from '~/types/role';
import { containsSearchTerms } from '~/utils/prisma';

export const organizationService = {
  listSearchWhere(
    searchTerms: string[],
    userId: number | null,
    deleted: boolean,
  ): Prisma.OrganizationWhereInput {
    const containedSearchTerms =
      containsSearchTerms<Prisma.OrganizationWhereInput>(searchTerms, ['name']);

    return {
      AND: [
        ...(userId
          ? [
              {
                organizationUsers: {
                  some: {
                    userId,
                  },
                },
              },
            ]
          : []),
        ...(deleted ? [{ NOT: { deletedAt: null } }] : [{ deletedAt: null }]),
        ...(searchTerms.length ? [{ OR: containedSearchTerms }] : []),
      ],
    };
  },
  async listSearchTotal(
    db: PrismaClient,
    searchTerms: string[],
    userId: number | null,
    deleted: boolean,
  ): Promise<number> {
    const where = organizationService.listSearchWhere(
      searchTerms,
      userId,
      deleted,
    );

    return await db.organization.count({ where });
  },
};
