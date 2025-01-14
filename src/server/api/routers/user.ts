import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { UserRoleType, allUserRoles } from '~/types/role';

export const userRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string(),
        userSystemRoles: z
          .array(z.nativeEnum(UserRoleType))
          .optional()
          .default(allUserRoles),
        organizationUserRoles: z.array(z.string()).optional(),
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
          userSystemRoles: input.userSystemRoles,
          organizationUserRoles: input.organizationUserRoles,
          organizationId,
          deleted: input.deleted,
        });
      const totalCount = await ctx.userService.listSearchTotal({
        searchTerms,
        userSystemRoles: input.userSystemRoles,
        organizationUserRoles: input.organizationUserRoles,
        organizationId,
        deleted: input.deleted,
      });
      const users = await ctx.db.user.findMany({
        where: whereClause,
        include: {
          userSystemRoles: {
            include: {
              role: true,
            },
          },
          organizationUsers: {
            include: {
              organizationUserRoles: {
                include: {
                  role: true,
                },
              },
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
    .input(z.object({ hashid: z.string() }))
    .query(async ({ ctx, input }) => {
      const id = ctx.hashidService.decode(input.hashid);
      return ctx.db.user.findUniqueOrThrow({
        where: { id },
        include: {
          userSystemRoles: {
            include: {
              role: true,
            },
          },
        },
      });
    }),

  findByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUniqueOrThrow({
        where: { email: input.email },
        include: {
          userSystemRoles: {
            include: {
              role: true,
            },
          },
        },
      });
    }),
});
