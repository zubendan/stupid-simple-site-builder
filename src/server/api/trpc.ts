/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { TRPCError, initTRPC } from '@trpc/server';
import { Resend } from 'resend';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { env } from '~/env';
import { auth } from '~/server/auth';
import { db } from '~/server/db';
import { OrgPermission } from '~/types/permissions';
import { DomainService } from './service/domain';
import { HashidService } from './service/hashid';
import { OrganizationService } from './service/organization';
import { OrganizationRoleService } from './service/organizationRole';
import { OrganizationUserService } from './service/organizationUser';
import { TemplateService } from './service/template';
import { UserService } from './service/user';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();
  const resend = new Resend(env.RESEND_API_KEY);
  const hashidService = new HashidService();
  const userService = new UserService(db);
  const organizationService = new OrganizationService(db);
  const organizationRoleService = new OrganizationRoleService(db);
  const organizationUserService = new OrganizationUserService(db);
  const templateService = new TemplateService(db);
  const domainService = new DomainService(db);

  return {
    db,
    session,
    resend,
    hashidService,
    userService,
    organizationService,
    templateService,
    domainService,
    organizationRoleService,
    organizationUserService,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  function highlightMessage(message: string, color = '32') {
    const msColored = `\x1b[${color}m${message}\x1b[0m`; // ANSI code for green color
    return msColored;
  }
  const executionTime = end - start;
  const executionColor =
    executionTime > 999 ? '31' : executionTime > 499 ? '33' : '32'; // red, yellow, green
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log(
    `${highlightMessage('[TRPC]', '36')} ${highlightMessage(path, '34')} took ${highlightMessage(`${executionTime}ms`, executionColor)} to execute`,
  );

  return result;
});

/**
 * Middleware for checking if an organization user has the required permissions to access a procedure.
 *
 */
const organizationPermissionMiddleware = t.middleware(
  async ({ ctx, next, meta }) => {
    const requiredPermissions =
      meta && 'permissions' in meta
        ? (meta.permissions as OrgPermission[])
        : undefined;

    const { session, db } = ctx;
    if (!session || !session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    if (requiredPermissions) {
      const referer = new URL(ctx.headers.get('referer') || '');
      const organizationHashid =
        referer.pathname.split('/')[1] === 'org'
          ? referer.pathname.split('/')[2]
          : undefined;
      if (!organizationHashid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Organization Hashid is required',
        });
      }

      const userWithPermissions = await db.organizationUser.findUniqueOrThrow({
        where: {
          organizationId_userId: {
            organizationId: ctx.hashidService.decode(organizationHashid),
            userId: session.user.id,
          },
        },
        include: {
          organizationUserRoles: {
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
          },
        },
      });

      const usersPermissions =
        userWithPermissions.organizationUserRoles.flatMap((our) =>
          our.role.rolePermissions.map((rp) => rp.permission.name),
        );
      const hasRequiredPermissions = requiredPermissions
        ? requiredPermissions.every((permission) =>
            usersPermissions.includes(permission),
          )
        : true;

      if (!hasRequiredPermissions) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Missing Required Permissions',
        });
      }
    }
    return next({
      ctx: {
        session: { ...session, user: session.user },
      },
    });
  },
);

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to users in the organization with the required permission, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 * Uses `referer` header to get the organization hashid
 * Uses `meta` to get the required permissions
 *
 * @see https://trpc.io/docs/procedures
 */
export const organizationProcedure = t.procedure
  .use(timingMiddleware)
  .use(organizationPermissionMiddleware);
