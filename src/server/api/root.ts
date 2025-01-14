import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { domainRouter } from './routers/domain';
import { inviteRouter } from './routers/invites';
import { organizationRouter } from './routers/organization';
import { templateRouter } from './routers/template';
import { userRouter } from './routers/user';
import { organizationUserRoleRouter } from './routers/organizationRole';
import { organizationUserRouter } from './routers/organizationUser';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  organization: organizationRouter,
  organizationUserRole: organizationUserRoleRouter,
  organizationUser: organizationUserRouter,
  template: templateRouter,
  domain: domainRouter,
  invite: inviteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
