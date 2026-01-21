import bcrypt from 'bcryptjs';
import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import { env } from '@/config/env';
import logger from '@/lib/logger';
import type { TokenPayload } from '@/types/api';

export async function hashPassword({
  password,
  saltRounds = 10
}: {
  password: string;
  saltRounds?: number;
}): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken({
  id,
  role,
  username,
  area,
  permissionGroups
}: TokenPayload): string {
  return jwt.sign(
    {
      id,
      role,
      username,
      area,
      permissionGroups
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN
    } as SignOptions
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

    return decoded;
  } catch (error) {
    logger.error('Error verifying token:', error);

    return null;
  }
}
