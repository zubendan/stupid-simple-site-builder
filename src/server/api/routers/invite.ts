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
        organizationHashid: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const organizationId = ctx.hashidService.decode(input.organizationHashid);
      const whereClause: Prisma.InviteWhereInput = {
        organizationId,
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
        invites: invites.map(({ organizationId, ...invite }) => ({
          ...invite,
          organizationHashid: ctx.hashidService.encode(organizationId),
        })),
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
