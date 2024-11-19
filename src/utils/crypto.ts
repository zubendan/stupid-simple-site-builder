import * as crypto from 'node:crypto';
import * as bcrypt from 'bcrypt';

/**
 * In order to allow passwords longer than 72 characters, we need to
 * hash the password first.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(sha256(password), salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(sha256(password), hashedPassword);
}

export function md5(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

export function sha256(input: string): string {
  return crypto.createHmac('sha256', input).digest('hex');
}

export function random6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
