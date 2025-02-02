import { createLoader, parseAsInteger, parseAsString } from 'nuqs/server';
// Note: import from 'nuqs/server' to avoid the "use client" directive

export const searchParams = {
  // List your search param keys and associated parsers here:
  tab: parseAsString,
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  callbackUrl: parseAsString,
};

export const loadSearchParams = createLoader(searchParams);
