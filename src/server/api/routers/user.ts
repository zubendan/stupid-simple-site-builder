import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { UserRoleType, allUserRoles } from '~/types/role';

export const userRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string(),
        roles: z
          .array(z.nativeEnum(UserRoleType))
          .optional()
          .default(allUserRoles),
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

      const whereClause: Prisma.UserWhereInput =
        ctx.userService.listSearchWhere({
          searchTerms,
          roles: input.roles,
          organizationId,
          deleted: input.deleted,
        });
      const totalCount = await ctx.userService.listSearchTotal({
        searchTerms,
        roles: input.roles,
        organizationId,
        deleted: input.deleted,
      });
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
