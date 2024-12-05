import Sqids from 'sqids';
import { env } from '~/env';

export class HashidService {
  constructor(private readonly sqids: Sqids) {}

  public decodeOrNull(hashid: string): number | null {
    try {
      return this.sqids.decode(hashid)[0] ?? null;
    } catch {
      return null;
    }
  }

  public decode(hashid: string): number {
    const id = this.sqids.decode(hashid)[0];
    if (!id) {
      throw new Error('Invalid hashid');
    }
    return id;
  }

  public encode(id: number): string {
    return this.sqids.encode([id]);
  }
}

export const sqids = new Sqids({
  alphabet: env.SQIDS_ALPHABET,
  minLength: 6,
});
