import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import {
  OrganizationCreateDto,
  OrganizationUpdateDto,
} from '~/dtos/organization';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { OrganizationUserRoleType } from '~/types/role';

export const organizationRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string(),
        userHashid: z.string().optional(),
        deleted: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const searchTerms = input.search.trim().length
        ? input.search.trim().split(/\s+/)
        : [];
      const userId = input.userHashid
        ? ctx.hashidService.decode(input.userHashid)
        : null;
      const whereClause: Prisma.OrganizationWhereInput =
        ctx.organizationService.listSearchWhere(
          searchTerms,
          userId,
          input.deleted,
        );
      const totalCount = await ctx.organizationService.listSearchTotal(
        ctx.db,
        searchTerms,
        userId,
        input.deleted,
      );
      const organizations = await ctx.db.organization.findMany({
        where: whereClause,
        take: input.perPage,
        skip: (input.page - 1) * input.perPage,
      });

      return {
        organizations,
        pageCount: Math.ceil(totalCount / input.perPage),
      };
    }),

  find: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.organization.findUnique({
        where: { id: input.id },
        include: {
          organizationUsers: {
            include: {
              user: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(OrganizationCreateDto)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.hashidService.decode(input.userHashid);

      return ctx.db.organization.create({
        data: {
          name: input.name,
          image: input.image,
          organizationUsers: {
            create: {
              userId,
              roles: {
                create: {
                  role: {
                    connectOrCreate: {
                      where: {
                        name: OrganizationUserRoleType.ORGANIZATION_ADMIN,
                      },
                      create: {
                        name: OrganizationUserRoleType.ORGANIZATION_ADMIN,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(OrganizationUpdateDto)
    .mutation(({ ctx, input }) => {
      const id = ctx.hashidService.decode(input.hashid);

      return ctx.db.organization.update({
        where: { id },
        data: {
          name: input.name,
          image: input.image,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ hashid: z.string() }))
    .mutation(({ ctx, input }) => {
      const id = ctx.hashidService.decode(input.hashid);
      return ctx.db.organization.delete({
        where: { id },
      });
    }),
});
