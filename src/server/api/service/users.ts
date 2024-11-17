import { Prisma, PrismaClient, User } from '@prisma/client';
import { RoleType } from '~/types/role';

const userService = {
  listSearchWhere(
    searchTerms: string[],
    roles: RoleType[],
    deleted: boolean,
    adAccountId: string | null,
  ): Prisma.UserWhereInput {
    const containsSearchTerms: Prisma.UserWhereInput[] = [];

    for (const searchTerm of searchTerms) {
      containsSearchTerms.push({ email: { contains: searchTerm } });
      containsSearchTerms.push({ firstName: { contains: searchTerm } });
      containsSearchTerms.push({ lastName: { contains: searchTerm } });
    }

    return {
      AND: [
        {
          userRoles: {
            some: {
              role: {
                name: {
                  in: roles,
                },
              },
            },
          },
        },
        ...(deleted ? [{ NOT: { deletedAt: null } }] : [{ deletedAt: null }]),
        ...(searchTerms.length ? [{ OR: containsSearchTerms }] : []),
      ],
    };
  },
  async listSearchTotal(
    db: PrismaClient,
    searchTerms: string[],
    roles: RoleType[],
    deleted: boolean,
    adAccountId: string | null,
  ): Promise<number> {
    const where = userService.listSearchWhere(
      searchTerms,
      roles,
      deleted,
      adAccountId,
    );

    return await db.user.count({ where });
  },
};
