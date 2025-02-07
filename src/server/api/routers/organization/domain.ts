import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import {
  createTRPCRouter,
  organizationProcedure,
  protectedProcedure,
} from '~/server/api/trpc';

export const domainRouter = createTRPCRouter({
  infiniteList: organizationProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        search: z.string(),
        organizationHashid: z.string(),
        deleted: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const organizationId = ctx.hashidService.decode(input.organizationHashid);
      const searchTerms = input.search.trim().length
        ? input.search.trim().split(/\s+/)
        : [];

      const whereClause: Prisma.DomainWhereInput =
        ctx.domainService.listSearchWhere({
          searchTerms,
          organizationId,
          deleted: input.deleted,
        });

      const items = await ctx.db.domain.findMany({
        take: input.limit + 1,
        where: whereClause,
        cursor: input.cursor
          ? {
              id: ctx.hashidService.decode(input.cursor),
            }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem
          ? ctx.hashidService.encode(nextItem.id)
          : undefined;
      }
      return {
        domains: items.map((domain) => ctx.hashidService.serialize(domain)),
        nextCursor,
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
