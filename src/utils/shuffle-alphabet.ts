import { defaultOptions } from 'sqids';

const defaultAlphabet = defaultOptions.alphabet;

export const shuffleAlphabet = (alphabet: string = defaultAlphabet): string => {
  const arr = alphabet.split('');
  const shuffled = arr.sort(() => Math.random() - 0.5);
  return shuffled.join('');
};
