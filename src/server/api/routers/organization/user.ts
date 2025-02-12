import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import {
  createTRPCRouter,
  organizationProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { SystemRoleType, allSystemRoles } from '~/types/role';

export const organizationUserRouter = createTRPCRouter({
  list: organizationProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string(),
        userSystemRoles: z
          .array(z.nativeEnum(SystemRoleType))
          .optional()
          .default(allSystemRoles),
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

  infiniteList: organizationProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        search: z.string(),
        userSystemRoles: z
          .array(z.nativeEnum(SystemRoleType))
          .optional()
          .default(allSystemRoles),
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

      const items = await ctx.db.organizationUser.findMany({
        take: input.limit + 1,
        where: whereClause,
        cursor: input.cursor
          ? {
              organizationId_userId: {
                organizationId,
                userId: ctx.hashidService.decode(input.cursor),
              },
            }
          : undefined,
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
        orderBy: {
          userId: 'asc',
        },
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem
          ? ctx.hashidService.encode(nextItem.userId)
          : undefined;
      }
      return {
        organizationUsers: items.map(({ user, organizationUserRoles }) => {
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
        }),
        nextCursor,
      };
    }),

  find: organizationProcedure
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

  hasRoles: publicProcedure
    .input(
      z.object({
        organizationHashid: z.string(),
        userHashid: z.string(),
        roles: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const organizationId = ctx.hashidService.decode(input.organizationHashid);
      const userId = ctx.hashidService.decode(input.userHashid);
      const orgUser = await ctx.db.organizationUser.findUniqueOrThrow({
        where: {
          organizationId_userId: {
            organizationId,
            userId,
          },
        },
        select: {
          organizationUserRoles: {
            select: {
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return input.roles.every((role) =>
        orgUser.organizationUserRoles
          .flatMap((r) => r.role.name)
          .includes(role),
      );
    }),
});
