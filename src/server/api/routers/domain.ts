import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const domainRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string(),
        organizationHashid: z.string().optional(),
        deleted: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const organizationId = input.organizationHashid
        ? ctx.hashidService.decode(input.organizationHashid)
        : null;

      const searchTerms = input.search.trim().length
        ? input.search.trim().split(/\s+/)
        : [];

      const whereClause: Prisma.DomainWhereInput =
        ctx.domainService.listSearchWhere({
          searchTerms,
          organizationId,
          deleted: input.deleted,
        });
      const totalCount = await ctx.domainService.listSearchTotal({
        searchTerms,
        organizationId,
        deleted: input.deleted,
      });
      const domains = await ctx.db.domain.findMany({
        where: whereClause,
        include: {},
        take: input.perPage,
        skip: (input.page - 1) * input.perPage,
      });

      return {
        domains,
        pageCount: Math.ceil(totalCount / input.perPage),
      };
    }),

  find: protectedProcedure
    .input(z.object({ hashid: z.string() }))
    .query(async ({ ctx, input }) => {
      const id = ctx.hashidService.decode(input.hashid);
      return ctx.db.domain.findUnique({
        where: { id },
      });
    }),
});
