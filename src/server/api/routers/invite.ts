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

  infiniteList: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        organizationHashid: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const organizationId = ctx.hashidService.decode(input.organizationHashid);
      const whereClause: Prisma.InviteWhereInput = {
        organizationId,
      };
      const invites = await ctx.db.invite.findMany({
        take: input.limit + 1,
        where: whereClause,
        cursor: input.cursor ? { token: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (invites.length > input.limit) {
        const nextItem = invites.pop();
        nextCursor = nextItem?.token;
      }

      return {
        invites: invites.map(({ organizationId, ...invite }) => ({
          ...invite,
          organizationHashid: ctx.hashidService.encode(organizationId),
        })),
        nextCursor,
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
