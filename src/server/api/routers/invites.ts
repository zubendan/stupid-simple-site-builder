import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const inviteRouter = createTRPCRouter({
  find: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.invite.findUniqueOrThrow({
        where: { token: input.token },
      });
    }),

  delete: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.invite.delete({
        where: { token: input.token },
      });
    }),
});
