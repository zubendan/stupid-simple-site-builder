import { z } from 'zod';

export const OrganizationCrudDto = z.object({
  name: z.string(),
  image: z.string().optional(),
});

export const OrganizationCreateDto = OrganizationCrudDto.extend({
  userHashid: z.string(),
});
export const OrganizationUpdateDto = OrganizationCrudDto.extend({
  hashid: z.string(),
});
