import { Prisma, PrismaClient } from '@prisma/client';
import { containsSearchTerms } from '~/utils/prisma';

export class OrganizationRoleService {
  constructor(private db: PrismaClient) {}

  public organizationRoleListSearchWhere({
    searchTerms,
    organizationId,
    deleted,
  }: {
    searchTerms: string[];
    organizationId: number;
    deleted: boolean;
  }): Prisma.OrganizationRoleWhereInput {
    const containedSearchTerms =
      containsSearchTerms<Prisma.OrganizationRoleWhereInput>(searchTerms, [
        'name',
        'description',
      ]);

    return {
      AND: [
        {
          organizationId,
          ...(searchTerms.length > 0 ? [{ OR: containedSearchTerms }] : []),
          ...(deleted ? { NOT: { deletedAt: null } } : { deletedAt: null }),
        },
      ],
    };
  }

  public async organizationRoleListSearchTotal({
    searchTerms,
    organizationId,
    deleted,
  }: {
    searchTerms: string[];
    organizationId: number;
    deleted: boolean;
  }): Promise<number> {
    const where = this.organizationRoleListSearchWhere({
      searchTerms,
      organizationId,
      deleted,
    });

    return await this.db.organizationRole.count({ where });
  }
}
