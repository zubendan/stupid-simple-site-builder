import { Prisma, PrismaClient, User } from '@prisma/client';
import { RoleType } from '~/types/role';
import { containsSearchTerms } from '~/utils/prisma';

export const userService = {
  listSearchWhere(
    searchTerms: string[],
    roles: RoleType[],
    deleted: boolean,
  ): Prisma.UserWhereInput {
    const containedSearchTerms = containsSearchTerms<Prisma.UserWhereInput>(
      searchTerms,
      ['email', 'firstName', 'lastName'],
    );

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
        ...(searchTerms.length ? [{ OR: containedSearchTerms }] : []),
      ],
    };
  },
  async listSearchTotal(
    db: PrismaClient,
    searchTerms: string[],
    roles: RoleType[],
    deleted: boolean,
  ): Promise<number> {
    const where = userService.listSearchWhere(searchTerms, roles, deleted);

    return await db.user.count({ where });
  },
};
