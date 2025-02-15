import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { domainRouter } from './routers/organization/domain';
import { organizationRouter } from './routers/organization';
import { templateRouter } from './routers/template';
import { userRouter } from './routers/user';

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
