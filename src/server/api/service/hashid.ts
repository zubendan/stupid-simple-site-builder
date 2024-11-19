import Sqids from 'sqids';
import { z } from 'zod';
import { env } from '~/env';

const sqids = new Sqids({
  alphabet: env.SQIDS_ALPHABET,
  minLength: 6,
});

export const hashidService = {
  decodeOrNull: (hashid: string): number | null => {
    try {
      return sqids.decode(hashid)[0] ?? null;
    } catch {
      return null;
    }
  },

  decode: (hashid: string): number => {
    const id = sqids.decode(hashid)[0];
    if (!id) {
      throw new Error('Invalid hashid');
    }
    return id;
  },

  encode: (id: number): string => {
    return sqids.encode([id]);
  },
};
