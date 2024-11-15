import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string().optional(),
        roleIds: z.array(z.number()).optional(),
        permissionIds: z.array(z.number()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const whereClause: Prisma.UserWhereInput = {
        ...(input.search && {
          OR: [
            {
              firstName: { contains: input.search, mode: 'insensitive' },
            },
            {
              lastName: { contains: input.search, mode: 'insensitive' },
            },
            {
              email: { contains: input.search, mode: 'insensitive' },
            },
          ],
        }),

        ...(input.roleIds && {
          roles: {
            some: {
              id: {
                in: input.roleIds,
              },
            },
          },
        }),
        ...(input.permissionIds && {
          permissions: {
            some: {
              id: {
                in: input.permissionIds,
              },
            },
          },
        }),
      };
      const users = await ctx.db.user.findMany({
        where: whereClause,
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
          accounts: true,
        },
        take: input.perPage,
        skip: (input.page - 1) * input.perPage,
      });
      const totalCount = await ctx.db.user.count({
        where: whereClause,
      });
      return {
        users,
        pageCount: Math.ceil(totalCount / input.perPage),
      };
    }),

  find: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        password: z.string(),
        roles: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { roles, ...rest } = input;
      return ctx.db.user.create({
        data: {
          ...rest,
          userRoles: {
            create: roles.map((id) => ({ roleId: id })),
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        password: z.string(),
        roles: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, roles, ...rest } = input;

      return ctx.db.user.update({
        where: { id: input.id },
        data: {
          ...rest,
          userRoles: {
            create: roles.map((id) => ({ roleId: id })),
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.delete({
        where: { id: input.id },
      });
    }),
});
