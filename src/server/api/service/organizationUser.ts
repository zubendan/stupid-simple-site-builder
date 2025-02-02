import { Prisma, PrismaClient } from '@prisma/client';
import { SystemRoleType } from '~/types/role';
import { containsSearchTerms } from '~/utils/prisma';

export class OrganizationUserService {
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
    organizationId: number;
    deleted: boolean;
  }): Prisma.OrganizationUserWhereInput {
    const containedSearchTerms = containsSearchTerms<Prisma.UserWhereInput>(
      searchTerms,
      ['email', 'firstName', 'lastName'],
    );

    return {
      AND: [
        {
          organizationId,
          ...(organizationUserRoles && organizationUserRoles.length > 0
            ? {
                organizationUserRoles: {
                  some: {
                    role: {
                      name: {
                        in: organizationUserRoles,
                      },
                    },
                  },
                },
              }
            : {}),
          user: {
            userSystemRoles: {
              some: {
                role: {
                  name: {
                    in: userSystemRoles,
                  },
                },
              },
            },
            ...(deleted ? { NOT: { deletedAt: null } } : { deletedAt: null }),
            ...(searchTerms.length > 0 ? [{ OR: containedSearchTerms }] : []),
          },
        },
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
    organizationId: number;
    deleted: boolean;
  }): Promise<number> {
    const where = this.listSearchWhere({
      searchTerms,
      userSystemRoles,
      organizationUserRoles,
      organizationId,
      deleted,
    });

    return await this.db.organizationUser.count({ where });
  }
}
