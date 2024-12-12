import { z } from 'zod';

export const OrganizationCreateDto = z.object({
  name: z.string(),
  image: z.string().optional(),
});

export const OrganizationUpdateDto = OrganizationCreateDto.extend({
  hashid: z.string(),
});
