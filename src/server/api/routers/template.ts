import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const templateRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string(),
        organizationHashid: z.string().optional(),
        isPublic: z.boolean().optional(),
        type: z.string().optional(),
        tags: z.array(z.string()).optional(),
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

      const isPublic = input.isPublic !== undefined ? input.isPublic : null;
      const type = input.type !== undefined ? input.type : null;
      const tags = input.tags !== undefined ? input.tags : null;

      const whereClause: Prisma.TemplateWhereInput =
        ctx.templateService.listSearchWhere({
          searchTerms,
          organizationId,
          isPublic,
          type,
          tags,
          deleted: input.deleted,
        });

      const totalCount = await ctx.templateService.listSearchTotal({
        searchTerms,
        organizationId,
        isPublic,
        type,
        tags,
        deleted: input.deleted,
      });

      const templates = await ctx.db.template.findMany({
        where: whereClause,
        include: {
          organizationTemplates: {
            include: {
              organization: true,
              domains: true,
            },
          },
          createdByOrganization: true,
        },
        take: input.perPage,
        skip: (input.page - 1) * input.perPage,
      });

      return {
        templates,
        pageCount: Math.ceil(totalCount / input.perPage),
      };
    }),

  //   find: protectedProcedure
  //     .input(z.object({ id: z.number() }))
  //     .query(async ({ ctx, input }) => {
  //       return ctx.db.template.findUnique({
  //         where: { id: input.id },
  //         include: {
  //           templateRoles: {
  //             include: {
  //               role: true,
  //             },
  //           },
  //         },
  //       });
  //     }),
});
