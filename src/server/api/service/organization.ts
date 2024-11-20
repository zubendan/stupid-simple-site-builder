import { Prisma, PrismaClient } from '@prisma/client';
import { containsSearchTerms } from '~/utils/prisma';

export class OrganizationService {
  constructor(private db: PrismaClient) {}
  public listSearchWhere(
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
  }

  public async listSearchTotal(
    db: PrismaClient,
    searchTerms: string[],
    userId: number | null,
    deleted: boolean,
  ): Promise<number> {
    const where = this.listSearchWhere(searchTerms, userId, deleted);

    return await this.db.organization.count({ where });
  }
}
