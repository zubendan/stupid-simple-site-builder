import { Prisma, PrismaClient } from '@prisma/client';
import { containsSearchTerms } from '~/utils/prisma';

export class TemplateService {
  constructor(private db: PrismaClient) {}

  public listSearchWhere({
    searchTerms,
    organizationId,
    isPublic,
    type,
    tags,
    deleted,
  }: {
    searchTerms: string[];
    organizationId: number | null;
    isPublic: boolean | null;
    type: string | null;
    tags: string[] | null;
    deleted: boolean;
  }): Prisma.TemplateWhereInput {
    const containedSearchTerms = containsSearchTerms<Prisma.TemplateWhereInput>(
      searchTerms,
      ['name', 'description', 'type'],
    );

    return {
      AND: [
        ...(organizationId
          ? [
              {
                organizationTemplates: {
                  some: {
                    organizationId,
                  },
                },
              },
            ]
          : []),
        ...(isPublic !== null
          ? [
              {
                isPublic,
              },
            ]
          : []),
        ...(type !== null
          ? [
              {
                type,
              },
            ]
          : []),
        ...(tags?.length
          ? [
              {
                tags: {
                  some: {
                    tag: {
                      name: {
                        in: tags,
                      },
                    },
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
    organizationId,
    isPublic,
    type,
    tags,
    deleted,
  }: {
    searchTerms: string[];
    organizationId: number | null;
    isPublic: boolean | null;
    type: string | null;
    tags: string[] | null;
    deleted: boolean;
  }): Promise<number> {
    const where = this.listSearchWhere({
      searchTerms,
      organizationId,
      isPublic,
      type,
      tags,
      deleted,
    });

    return await this.db.template.count({ where });
  }
}
