import { z } from 'zod';

export const UserCreateDto = z.object({
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  email: z.string().email().nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
  roles: z.array(z.number()).nullish(),
});
