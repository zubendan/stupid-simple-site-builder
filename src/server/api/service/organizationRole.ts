import { Prisma, PrismaClient } from '@prisma/client';
import { containsSearchTerms } from '~/utils/prisma';

export class OrganizationRoleService {
  constructor(private db: PrismaClient) {}

  public organizationUserRoleListSearchWhere({
    searchTerms,
    organizationId,
    deleted,
  }: {
    searchTerms: string[];
    organizationId: number;
    deleted: boolean;
  }): Prisma.OrganizationUserRoleWhereInput {
    const containedSearchTerms =
      containsSearchTerms<Prisma.OrganizationRoleWhereInput>(searchTerms, [
        'name',
        'description',
      ]);

    return {
      AND: [
        {
          organizationId,
          role: {
            ...(deleted ? { NOT: { deletedAt: null } } : { deletedAt: null }),
            ...(searchTerms.length > 0 ? [{ OR: containedSearchTerms }] : []),
          },
        },
      ],
    };
  }

  public async organizationUserRoleListSearchTotal({
    searchTerms,
    organizationId,
    deleted,
  }: {
    searchTerms: string[];
    organizationId: number;
    deleted: boolean;
  }): Promise<number> {
    const where = this.organizationUserRoleListSearchWhere({
      searchTerms,
      organizationId,
      deleted,
    });

    return await this.db.organizationUserRole.count({ where });
  }
}
