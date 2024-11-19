import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { userService } from '../service/users';
import { allRoles, RoleType } from '~/types/role';

export const userRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string(),
        roles: z.array(z.nativeEnum(RoleType)).optional().default(allRoles),
        deleted: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const searchTerms = input.search.trim().length
        ? input.search.trim().split(/\s+/)
        : [];
      const whereClause: Prisma.UserWhereInput = userService.listSearchWhere(
        searchTerms,
        input.roles,
        input.deleted,
      );
      const totalCount = await userService.listSearchTotal(
        ctx.db,
        searchTerms,
        input.roles,
        input.deleted,
      );
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
});
