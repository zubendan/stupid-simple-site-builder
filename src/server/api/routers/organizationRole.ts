import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { OrgPermission } from '~/types/permissions';

export const organizationRoleRouter = createTRPCRouter({
  list: protectedProcedure
    .meta({
      permissions: [OrgPermission.VIEW_ROLES],
    })
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

      const whereClause: Prisma.OrganizationRoleWhereInput =
        ctx.organizationRoleService.organizationRoleListSearchWhere({
          searchTerms,
          organizationId,
          deleted: input.deleted,
        });

      const totalCount =
        await ctx.organizationRoleService.organizationRoleListSearchTotal({
          searchTerms,
          organizationId,
          deleted: input.deleted,
        });

      const organizationRoles = await ctx.db.organizationRole.findMany({
        where: whereClause,
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
        take: input.perPage,
        skip: (input.page - 1) * input.perPage,
      });

      return {
        organizationUserRoles: organizationRoles.map(
          ({ rolePermissions, ...restRole }) => {
            return ctx.hashidService.serialize({
              ...restRole,
              permissions: rolePermissions.map((r) =>
                ctx.hashidService.serialize(r.permission),
              ),
            });
          },
        ),
        pageCount: Math.ceil(totalCount / input.perPage),
      };
    }),

  find: protectedProcedure
    .meta({
      permissions: [OrgPermission.VIEW_ROLES],
    })
    .input(
      z.object({
        roleHashid: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const roleId = ctx.hashidService.decode(input.roleHashid);

      const { rolePermissions, ...role } =
        await ctx.db.organizationRole.findUniqueOrThrow({
          where: {
            id: roleId,
          },
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        });

      return ctx.hashidService.serialize({
        ...role,
        permissions: rolePermissions.map((r) =>
          ctx.hashidService.serialize(r.permission),
        ),
      });
    }),

  create: protectedProcedure
    .meta({
      permissions: [OrgPermission.CREATE_ROLES],
    })
    .input(
      z.object({
        name: z.string(),
        color: z.string(),
        description: z.string().optional(),
        organizationHashid: z.string(),
        permissions: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const organizationId = ctx.hashidService.decode(input.organizationHashid);

      const { rolePermissions, ...restRole } =
        await ctx.db.organizationRole.create({
          data: {
            name: input.name,
            color: input.color,
            description: input.description,
            organizationId,
            rolePermissions: {
              create: input.permissions.map((permission) => ({
                organizationId,
                permission: {
                  connect: {
                    name: permission,
                  },
                },
              })),
            },
          },
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        });

      return ctx.hashidService.serialize({
        ...restRole,
        permissions: rolePermissions.map((r) =>
          ctx.hashidService.serialize(r.permission),
        ),
      });
    }),
});
