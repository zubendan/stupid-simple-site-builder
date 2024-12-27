import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const inviteRouter = createTRPCRouter({
  find: protectedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.invite.findUniqueOrThrow({
        where: { token: input.token },
      });
    }),
});
