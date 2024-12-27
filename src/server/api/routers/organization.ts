import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { add } from 'date-fns';
import { CreateEmailResponse } from 'resend';
import {
  OrganizationCreateDto,
  OrganizationUpdateDto,
} from '~/dtos/organization';
import { InviteEmail } from '~/emails/invite';
import { env } from '~/env';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { OrganizationUserRoleType } from '~/types/role';
import { TRPCError } from '@trpc/server';

const { BASE_URL } = env;

export const organizationRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        search: z.string(),
        userId: z.number().optional(),
        deleted: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const searchTerms = input.search.trim().length
        ? input.search.trim().split(/\s+/)
        : [];
      const userId = input.userId ? input.userId : null;
      const whereClause: Prisma.OrganizationWhereInput =
        ctx.organizationService.listSearchWhere({
          searchTerms,
          userId,
          deleted: input.deleted,
        });
      const totalCount = await ctx.organizationService.listSearchTotal({
        searchTerms,
        userId,
        deleted: input.deleted,
      });
      const organizations = await ctx.db.organization.findMany({
        where: whereClause,
        take: input.perPage,
        skip: (input.page - 1) * input.perPage,
      });

      return {
        organizations: organizations.map(({ id, ...org }) => ({
          ...org,
          hashid: ctx.hashidService.encode(id),
        })),
        pageCount: Math.ceil(totalCount / input.perPage),
      };
    }),

  find: protectedProcedure
    .input(z.object({ hashid: z.string() }))
    .query(async ({ ctx, input }) => {
      const id = ctx.hashidService.decode(input.hashid);
      return ctx.db.organization.findUnique({
        where: { id },
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
      const userId = ctx.session.user.id;

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

  inviteUsers: protectedProcedure
    .input(
      z.object({ emails: z.array(z.string()), organizationHashid: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const organizationId = ctx.hashidService.decode(input.organizationHashid);
      const org = await ctx.db.organization.findUniqueOrThrow({
        where: {
          id: organizationId,
        },
      });

      for (const email of input.emails) {
        const user = await ctx.db.user.findUnique({ where: { email } });
        const invite = await ctx.db.invite.create({
          data: {
            organizationId,
            email,
            expiresAt: add(new Date(), { days: 5 }),
          },
        });
        let response: CreateEmailResponse;

        if (!user) {
          response = await ctx.resend.emails.send({
            from: 'VERSA@versabuilt.co',
            to: email,
            subject: `${org.name} has invited you to join their organization`,
            react: InviteEmail({
              baseUrl: BASE_URL,
              organizationName: org.name,
              organizationHashid: input.organizationHashid,
              token: invite.token,
            }),
          });
        } else {
          // TODO: send invite to user inbox instead
          response = await ctx.resend.emails.send({
            from: 'VERSA@versabuilt.co',
            to: email,
            subject: `${org.name} has invited you to join their organization`,
            react: InviteEmail({
              baseUrl: BASE_URL,
              organizationName: org.name,
              organizationHashid: input.organizationHashid,
              token: invite.token,
            }),
          });
        }

        if (response.data) {
          return response.data;
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: response.error?.name,
            cause: response.error?.name,
          });
        }
      }
    }),

  addInvitedUser: protectedProcedure
    .input(
      z.object({
        organizationHashid: z.string(),
        userId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const organizationId = ctx.hashidService.decode(input.organizationHashid);
      return ctx.organizationService.addInvitedUser(
        organizationId,
        input.userId,
      );
    }),
});
