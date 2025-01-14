import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const permissionRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string(),
        organizationHashid: z.string(),
        deleted: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const organizationId = ctx.hashidService.decode(input.organizationHashid);

      const searchTerms = input.search.trim().length
        ? input.search.trim().split(/\s+/)
        : [];

      const whereClause: Prisma.OrganizationUserRoleWhereInput =
        ctx.organizationRoleService.organizationUserRoleListSearchWhere({
          searchTerms,
          organizationId,
          deleted: input.deleted,
        });

      const totalCount =
        await ctx.organizationRoleService.organizationUserRoleListSearchTotal({
          searchTerms,
          organizationId,
          deleted: input.deleted,
        });

      const organizationUserRoles = await ctx.db.organizationUserRole.findMany({
        where: whereClause,
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
        take: input.perPage,
        skip: (input.page - 1) * input.perPage,
      });

      return {
        organizationUserRoles: organizationUserRoles.map(({ role }) => {
          const { rolePermissions, ...restRole } = role;
          const returnUser = ctx.hashidService.serialize({
            ...restRole,
            permissions: rolePermissions.map((r) =>
              ctx.hashidService.serialize(r.permission),
            ),
          });
          return returnUser;
        }),
        pageCount: Math.ceil(totalCount / input.perPage),
      };
    }),
});
