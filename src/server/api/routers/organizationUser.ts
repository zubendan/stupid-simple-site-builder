import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { UserRoleType, allUserRoles } from '~/types/role';

export const organizationUserRouter = createTRPCRouter({
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
        organizationHashid: z.string(),
        deleted: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const organizationId = ctx.hashidService.decode(input.organizationHashid);

      const searchTerms = input.search.trim().length
        ? input.search.trim().split(/\s+/)
        : [];

      const whereClause: Prisma.OrganizationUserWhereInput =
        ctx.organizationUserService.listSearchWhere({
          searchTerms,
          userSystemRoles: input.userSystemRoles,
          organizationUserRoles: input.organizationUserRoles,
          organizationId,
          deleted: input.deleted,
        });

      const totalCount = await ctx.organizationUserService.listSearchTotal({
        searchTerms,
        userSystemRoles: input.userSystemRoles,
        organizationUserRoles: input.organizationUserRoles,
        organizationId,
        deleted: input.deleted,
      });

      const organizationUsers = await ctx.db.organizationUser.findMany({
        where: whereClause,
        include: {
          organizationUserRoles: {
            include: {
              role: true,
            },
          },

          user: {
            include: {
              userSystemRoles: {
                include: {
                  role: true,
                },
              },
              accounts: true,
            },
          },
        },
        take: input.perPage,
        skip: (input.page - 1) * input.perPage,
      });

      return {
        organizationUsers: organizationUsers.map(
          ({ user, organizationUserRoles }) => {
            const { userSystemRoles, ...restUser } = user;
            const returnUser = ctx.hashidService.serialize({
              ...restUser,
              organizationRoles: organizationUserRoles.map((r) =>
                ctx.hashidService.serialize(r.role),
              ),
              userSystemRoles: userSystemRoles.map((r) =>
                ctx.hashidService.serialize(r.role),
              ),
            });
            return returnUser;
          },
        ),
        pageCount: Math.ceil(totalCount / input.perPage),
      };
    }),

  find: protectedProcedure
    .input(z.object({ userHashid: z.string(), organizationHashid: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.hashidService.decode(input.userHashid);
      const organizationId = ctx.hashidService.decode(input.organizationHashid);
      const orgUser = await ctx.db.organizationUser.findUniqueOrThrow({
        where: {
          organizationId_userId: {
            organizationId,
            userId,
          },
        },
        include: {
          organizationUserRoles: {
            include: {
              role: true,
            },
          },
          user: {
            include: {
              userSystemRoles: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
      });

      const { user, organizationUserRoles } = orgUser;
      const { userSystemRoles, ...restUser } = user;

      return {
        ...restUser,
        organizationRoles: organizationUserRoles.map((r) =>
          ctx.hashidService.serialize(r.role),
        ),
        userSystemRoles: userSystemRoles.map((r) =>
          ctx.hashidService.serialize(r.role),
        ),
      };
    }),
});
