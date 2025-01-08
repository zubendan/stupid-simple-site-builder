import Sqids from 'sqids';
import { env } from '~/env';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
interface IObjectWithId extends Record<string, any> {
  id: number;
}

export class HashidService {
  private sqids: Sqids;
  constructor() {
    this.sqids = new Sqids({
      alphabet: env.SQIDS_ALPHABET,
      minLength: 6,
    });
  }

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

  public serialize<T extends IObjectWithId>(
    obj: T,
  ): Omit<T, 'id'> & { hashid: string } {
    if (obj.hasOwnProperty('id') && typeof obj.id === 'number') {
      const hashid = this.encode(obj.id);
      const { id, ...rest } = obj;
      return { ...rest, hashid };
    }
    return obj as unknown as Omit<T, 'id'> & { hashid: never };
  }
}
