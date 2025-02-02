import { Prisma, PrismaClient } from '@prisma/client';
import { SystemRoleType } from '~/types/role';
import { containsSearchTerms } from '~/utils/prisma';

export class UserService {
  constructor(private db: PrismaClient) {}

  public listSearchWhere({
    searchTerms,
    userSystemRoles,
    organizationUserRoles,
    organizationId,
    deleted,
  }: {
    searchTerms: string[];
    userSystemRoles: SystemRoleType[];
    organizationUserRoles?: string[];
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
          userSystemRoles: {
            some: {
              role: {
                name: {
                  in: userSystemRoles,
                },
              },
            },
          },
          ...(organizationUserRoles && organizationUserRoles.length > 0
            ? {
                organizationUsers: {
                  some: {
                    organizationUserRoles: {
                      some: {
                        role: {
                          name: {
                            in: organizationUserRoles,
                          },
                        },
                      },
                    },
                  },
                },
              }
            : {}),
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
        ...(searchTerms.length > 0 ? [{ OR: containedSearchTerms }] : []),
      ],
    };
  }

  public async listSearchTotal({
    searchTerms,
    userSystemRoles,
    organizationUserRoles,
    organizationId,
    deleted,
  }: {
    searchTerms: string[];
    userSystemRoles: SystemRoleType[];
    organizationUserRoles?: string[];
    organizationId: number | null;
    deleted: boolean;
  }): Promise<number> {
    const where = this.listSearchWhere({
      searchTerms,
      userSystemRoles,
      organizationUserRoles,
      organizationId,
      deleted,
    });

    return await this.db.user.count({ where });
  }
}
