import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import {
  OrganizationUserRoleType,
  UserRoleType,
  allOrganizationUserRoles,
  allUserRoles,
} from '~/types/role';

export const userRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string(),
        userRoles: z
          .array(z.nativeEnum(UserRoleType))
          .optional()
          .default(allUserRoles),
        organizationUserRoles: z
          .array(z.nativeEnum(OrganizationUserRoleType))
          .optional()
          .default(allOrganizationUserRoles),
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
          userRoles: input.userRoles,
          organizationUserRoles: input.organizationUserRoles,
          organizationId,
          deleted: input.deleted,
        });
      const totalCount = await ctx.userService.listSearchTotal({
        searchTerms,
        userRoles: input.userRoles,
        organizationUserRoles: input.organizationUserRoles,
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
          organizationUsers: {
            include: {
              roles: {
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
          userRoles: {
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
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });
    }),

  listForOrganization: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string(),
        userRoles: z
          .array(z.nativeEnum(UserRoleType))
          .optional()
          .default(allUserRoles),
        organizationUserRoles: z
          .array(z.nativeEnum(OrganizationUserRoleType))
          .optional()
          .default(allOrganizationUserRoles),
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
        ctx.userService.organizationUserListSearchWhere({
          searchTerms,
          userRoles: input.userRoles,
          organizationUserRoles: input.organizationUserRoles,
          organizationId,
          deleted: input.deleted,
        });

      const totalCount = await ctx.userService.organizationUserListSearchTotal({
        searchTerms,
        userRoles: input.userRoles,
        organizationUserRoles: input.organizationUserRoles,
        organizationId,
        deleted: input.deleted,
      });

      const organizationUsers = await ctx.db.organizationUser.findMany({
        where: whereClause,
        include: {
          roles: {
            include: {
              role: true,
            },
          },

          user: {
            include: {
              userRoles: {
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
        organizationUsers: organizationUsers.map(({ user, roles }) => {
          const { userRoles, ...restUser } = user;
          const returnUser = ctx.hashidService.serialize({
            ...restUser,
            organizationRoles: roles.map((r) =>
              ctx.hashidService.serialize(r.role),
            ),
            userRoles: userRoles.map((r) =>
              ctx.hashidService.serialize(r.role),
            ),
          });
          return returnUser;
        }),
        pageCount: Math.ceil(totalCount / input.perPage),
      };
    }),
});
