import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { hashidService } from '../service/hashid';
import { organizationService } from '../service/organization';

export const organizationRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string(),
        userHashid: z.string().optional(),
        deleted: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const searchTerms = input.search.trim().length
        ? input.search.trim().split(/\s+/)
        : [];
      const userId = input.userHashid
        ? hashidService.decode(input.userHashid)
        : null;
      const whereClause: Prisma.OrganizationWhereInput =
        organizationService.listSearchWhere(searchTerms, userId, input.deleted);
      const totalCount = await organizationService.listSearchTotal(
        ctx.db,
        searchTerms,
        userId,
        input.deleted,
      );
      const organizations = await ctx.db.organization.findMany({
        where: whereClause,
        take: input.perPage,
        skip: (input.page - 1) * input.perPage,
      });

      return {
        organizations,
        pageCount: Math.ceil(totalCount / input.perPage),
      };
    }),

  find: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.organization.findUnique({
        where: { id: input.id },
        include: {
          organizationUsers: {
            include: {
              user: true,
            },
          },
        },
      });
    }),
});
