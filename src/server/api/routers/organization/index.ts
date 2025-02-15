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
import {
  createTRPCRouter,
  organizationProcedure,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { OrgPermission, allOrgPermissions } from '~/types/permissions';
import { DefaultOrganizationUserRoleType } from '~/types/role';
import { organizationUserRouter } from './user';
import { organizationRoleRouter } from './role';
import { inviteRouter } from './invite';

const { BASE_URL } = env;

export const organizationRouter = createTRPCRouter({
  user: organizationUserRouter,
  role: organizationRoleRouter,
  invite: inviteRouter,

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

      const org = await ctx.db.$transaction(async (tx) => {
        const o = await tx.organization.create({
          data: {
            name: input.name,
            image: input.image,
            organizationUsers: {
              create: {
                userId,
              },
            },
          },
        });
        await tx.organizationRole.create({
          data: {
            organizationId: o.id,
            name: DefaultOrganizationUserRoleType.ADMIN,
            description: 'Role with all permissions',
            organizationUsersRoles: {
              create: {
                organizationId: o.id,
                userId,
              },
            },
            rolePermissions: {
              create: allOrgPermissions.map((p) => ({
                organizationId: o.id,
                permission: {
                  connectOrCreate: {
                    where: {
                      name: p,
                    },
                    create: {
                      name: p,
                    },
                  },
                },
              })),
            },
          },
        });
        return o;
      });

      const organization = ctx.hashidService.serialize(org);

      return organization;
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

  inviteUsers: organizationProcedure
    .meta({
      permissions: [OrgPermission.INVITE_USERS],
    })
    .input(
      z.object({ emails: z.array(z.string()), organizationHashid: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const sender = ctx.session.user;
      const organizationId = ctx.hashidService.decode(input.organizationHashid);
      const org = await ctx.db.organization.findUniqueOrThrow({
        where: {
          id: organizationId,
        },
      });

      const responses: CreateEmailResponse[] = [];

      for (const email of input.emails) {
        const user = await ctx.db.user.findUnique({ where: { email } });
        const invite = await ctx.db.invite.create({
          data: {
            organizationId,
            email,
            expiresAt: add(new Date(), { days: 5 }),
          },
        });

        if (!user) {
          const res = await ctx.resend.emails.send({
            from: 'VERSA@versabuilt.co',
            to: email,
            subject: `${org.name} has invited you to join their organization`,
            react: InviteEmail({
              baseUrl: BASE_URL,
              userName: `${sender.firstName} ${sender.lastName}`,
              organizationName: org.name,
              organizationHashid: input.organizationHashid,
              token: invite.token,
            }),
          });
          responses.push(res);
        } else {
          // TODO: send invite to user inbox instead
          const res = await ctx.resend.emails.send({
            from: 'VERSA@versabuilt.co',
            to: email,
            subject: `${org.name} has invited you to join their organization`,
            react: InviteEmail({
              baseUrl: BASE_URL,
              userName: `${sender.firstName} ${sender.lastName}`,
              organizationName: org.name,
              organizationHashid: input.organizationHashid,
              token: invite.token,
            }),
          });
          responses.push(res);
        }
      }
      return responses;
    }),

  addInvitedUser: publicProcedure
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
