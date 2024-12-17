import { Prisma, PrismaClient } from '@prisma/client';
import { OrganizationUserRoleType, UserRoleType } from '~/types/role';
import { containsSearchTerms } from '~/utils/prisma';

export class UserService {
  constructor(private db: PrismaClient) {}

  public listSearchWhere({
    searchTerms,
    userRoles,
    organizationUserRoles,
    organizationId,
    deleted,
  }: {
    searchTerms: string[];
    userRoles: UserRoleType[];
    organizationUserRoles: OrganizationUserRoleType[];
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
                  in: userRoles,
                },
              },
            },
          },
          organizationUsers: {
            some: {
              roles: {
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
    userRoles,
    organizationUserRoles,
    organizationId,
    deleted,
  }: {
    searchTerms: string[];
    userRoles: UserRoleType[];
    organizationUserRoles: OrganizationUserRoleType[];
    organizationId: number | null;
    deleted: boolean;
  }): Promise<number> {
    const where = this.listSearchWhere({
      searchTerms,
      userRoles,
      organizationUserRoles,
      organizationId,
      deleted,
    });

    return await this.db.user.count({ where });
  }
}
