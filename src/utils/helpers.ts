// biome-ignore lint/suspicious/noExplicitAny: <explanation>
interface IObjectWithId extends Record<string, any> {
  id: number;
}

export const serialize = <T extends IObjectWithId>(
  obj: T,
  encoder: (id: number) => string,
): Omit<T, 'id'> & { hashid: string } => {
  if (obj.hasOwnProperty('id') && typeof obj.id === 'number') {
    const hashid = encoder(obj.id);
    const { id, ...rest } = obj;
    return { ...rest, hashid };
  }
  return obj as unknown as Omit<T, 'id'> & { hashid: never };
};
