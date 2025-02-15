import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, organizationProcedure } from '~/server/api/trpc';
import { OrgPermission } from '~/types/permissions';

export const domainRouter = createTRPCRouter({
  infiniteList: organizationProcedure
    .meta({
      permissions: [OrgPermission.VIEW_DOMAINS],
    })
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
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

      const whereClause: Prisma.DomainWhereInput =
        ctx.domainService.listSearchWhere({
          searchTerms,
          organizationId,
          deleted: input.deleted,
        });

      const items = await ctx.db.domain.findMany({
        take: input.limit + 1,
        where: whereClause,
        cursor: input.cursor
          ? {
              id: ctx.hashidService.decode(input.cursor),
            }
          : undefined,
        orderBy: {
          id: 'asc',
        },
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem
          ? ctx.hashidService.encode(nextItem.id)
          : undefined;
      }
      return {
        domains: items.map((domain) => ctx.hashidService.serialize(domain)),
        nextCursor,
      };
    }),

  find: organizationProcedure
    .meta({
      permissions: [OrgPermission.VIEW_DOMAINS],
    })
    .input(z.object({ hashid: z.string() }))
    .query(async ({ ctx, input }) => {
      const id = ctx.hashidService.decode(input.hashid);
      return ctx.db.domain.findUnique({
        where: { id },
      });
    }),

  add: organizationProcedure
    .meta({
      permissions: [OrgPermission.ADD_DOMAINS],
    })
    .input(
      z.object({
        domain: z.string(),
        organizationHashid: z.string(),
        templateHashid: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const templateId = input.templateHashid
        ? ctx.hashidService.decode(input.templateHashid)
        : null;
      const organizationId = ctx.hashidService.decode(input.organizationHashid);
      return ctx.db.domain.create({
        data: {
          domain: input.domain,
          templateId,
          organizationId,
        },
      });
    }),

  update: organizationProcedure
    .meta({
      permissions: [OrgPermission.EDIT_DOMAINS],
    })
    .input(
      z.object({
        hashid: z.string(),
        name: z.string(),
        domain: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = ctx.hashidService.decode(input.hashid);
      return ctx.db.domain.update({
        where: { id },
        data: { displayName: input.name, domain: input.domain },
      });
    }),

  delete: organizationProcedure
    .meta({
      permissions: [OrgPermission.DELETE_DOMAINS],
    })
    .input(z.object({ hashid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = ctx.hashidService.decode(input.hashid);
      return ctx.db.domain.delete({ where: { id } });
    }),
});
