import { Prisma, PrismaClient } from '@prisma/client';
import { UserRoleType } from '~/types/role';
import { containsSearchTerms } from '~/utils/prisma';

export class UserService {
  constructor(private db: PrismaClient) {}

  public listSearchWhere({
    searchTerms,
    roles,
    organizationId,
    deleted,
  }: {
    searchTerms: string[];
    roles: UserRoleType[];
    organizationId: number | null;
    deleted: boolean;
  }): Prisma.UserWhereInput {
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
        ...(organizationId
          ? [
              {
                organizationUsers: {
                  some: {
                    organizationId,
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

  public async listSearchTotal({
    searchTerms,
    roles,
    organizationId,
    deleted,
  }: {
    searchTerms: string[];
    roles: UserRoleType[];
    organizationId: number | null;
    deleted: boolean;
  }): Promise<number> {
    const where = this.listSearchWhere({
      searchTerms,
      roles,
      organizationId,
      deleted,
    });

    return await this.db.user.count({ where });
  }
}
