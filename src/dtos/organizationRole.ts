import { z } from 'zod';

export const OrganizationRoleCreateDto = z.object({
  name: z.string(),
  color: z.string(),
  description: z.string().optional(),
  organizationHashid: z.string(),
  permissions: z.array(z.string()),
});

export const OrganizationRoleUpdateDto = OrganizationRoleCreateDto.extend({
  hashid: z.string(),
});
