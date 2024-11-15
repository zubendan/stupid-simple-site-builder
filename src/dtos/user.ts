import { z } from 'zod';

export const UserCreateDto = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  emailVerified: z.date(),
  image: z.string().optional(),
  roles: z.array(z.number()),
});

export const UserUpdateDto = UserCreateDto.extend({
  id: z.number(),
});
