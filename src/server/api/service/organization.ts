import { Prisma, PrismaClient } from '@prisma/client';
import { OrganizationUserRoleType } from '~/types/role';
import { containsSearchTerms } from '~/utils/prisma';

export class OrganizationService {
  constructor(private db: PrismaClient) {}
  public listSearchWhere({
    searchTerms,
    userId,
    deleted,
  }: {
    searchTerms: string[];
    userId: number | null;
    deleted: boolean;
  }): Prisma.OrganizationWhereInput {
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

  public async listSearchTotal({
    searchTerms,
    userId,
    deleted,
  }: {
    searchTerms: string[];
    userId: number | null;
    deleted: boolean;
  }): Promise<number> {
    const where = this.listSearchWhere({ searchTerms, userId, deleted });

    return await this.db.organization.count({ where });
  }

  public async addInvitedUser(id: number, userId: number): Promise<void> {
    await this.db.organization.update({
      where: { id },
      data: {
        organizationUsers: {
          create: {
            userId,
            roles: {
              create: {
                role: {
                  connectOrCreate: {
                    where: {
                      name: OrganizationUserRoleType.ORGANIZATION_USER,
                    },
                    create: {
                      name: OrganizationUserRoleType.ORGANIZATION_USER,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
