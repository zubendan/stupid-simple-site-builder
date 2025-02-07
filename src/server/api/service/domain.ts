import { Prisma, PrismaClient } from '@prisma/client';
import { containsSearchTerms } from '~/utils/prisma';

export class DomainService {
  constructor(private db: PrismaClient) {}

  public listSearchWhere({
    searchTerms,
    organizationId,
    deleted,
  }: {
    searchTerms: string[];
    organizationId: number | null;
    deleted: boolean;
  }): Prisma.DomainWhereInput {
    const containedSearchTerms = containsSearchTerms<Prisma.DomainWhereInput>(
      searchTerms,
      ['displayName', 'domain'],
    );

    return {
      AND: [
        ...(organizationId ? [{ organizationId }] : []),
        ...(deleted ? [{ NOT: { deletedAt: null } }] : [{ deletedAt: null }]),
        ...(searchTerms.length ? [{ OR: containedSearchTerms }] : []),
      ],
    };
  }

  public async listSearchTotal({
    searchTerms,
    organizationId,
    deleted,
  }: {
    searchTerms: string[];
    organizationId: number | null;
    deleted: boolean;
  }): Promise<number> {
    const where = this.listSearchWhere({
      searchTerms,
      organizationId,
      deleted,
    });

    return await this.db.domain.count({ where });
  }
}
