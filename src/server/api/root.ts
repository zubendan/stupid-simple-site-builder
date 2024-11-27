import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { userRouter } from './routers/user';
import { organizationRouter } from './routers/organization';
import { templateRouter } from './routers/template';
import { domainRouter } from './routers/domain';
import { inviteRouter } from './routers/invites';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  organization: organizationRouter,
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
