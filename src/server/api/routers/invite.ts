import { Prisma } from '@prisma/client';
import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const inviteRouter = createTRPCRouter({
  find: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.invite.findUniqueOrThrow({
        where: { token: input.token },
      });
    }),

  list: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        organizationId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const whereClause: Prisma.InviteWhereInput = {
        organizationId: input.organizationId,
      };
      const totalCount = await ctx.db.invite.count({
        where: whereClause,
      });
      const invites = await ctx.db.invite.findMany({
        where: whereClause,
        take: input.perPage,
        skip: (input.page - 1) * input.perPage,
      });

      return {
        invites,
        pageCount: Math.ceil(totalCount / input.perPage),
      };
    }),

  delete: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.invite.delete({
        where: { token: input.token },
      });
    }),
});
