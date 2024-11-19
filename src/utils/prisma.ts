import { Prisma } from '@prisma/client';
import { env } from '~/env';

/**
 * Same as above, but for usage in Prisma queries
 */
export function containsInsensitive(searchTerm: string): {
  contains: string;
  mode?: 'insensitive';
} {
  return {
    contains: searchTerm,
    ...(env.NODE_ENV === 'production' ? { mode: 'insensitive' } : {}),
  };
}

export const containsSearchTerms = <T>(
  searchTerms: string[],
  terms: (keyof T)[],
) => {
  const containsSearchTerms: T[] = [];

  for (const searchTerm of searchTerms) {
    for (const term of terms) {
      containsSearchTerms.push({
        [term]: containsInsensitive(searchTerm),
      } as T);
    }
  }
  return containsSearchTerms;
};
