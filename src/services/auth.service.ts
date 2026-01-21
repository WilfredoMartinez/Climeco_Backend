import { comparePassword, generateToken } from '@/lib/auth';
import { createBadRequestError, createUnauthorizedError } from '@/lib/errors';
import {
  findUserById,
  findUserByUsername
} from '@/repositories/user.repository';
import { logActivity } from '@/services/activityLog.service';

interface LoginResponse {
  user: {
    id: string;
    username: string;
    fullname: string;
    role: string;
    specialty: string;
    area: string;
    permissions: string[];
  };
  token: string;
}

export async function loginUser({
  username,
  password
}: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  if (!username || !password)
    throw createBadRequestError('Usuario o contraseña incorrectos');

  const userWithHash = await findUserByUsername(username);

  if (!userWithHash || !userWithHash.isActive)
    throw createUnauthorizedError('Usuario o contraseña incorrectos');

  const isMatch = await comparePassword(password, userWithHash.passwordHash);

  if (!isMatch) throw createBadRequestError('Usuario o contraseña incorrectos');

  const token = generateToken({
    id: userWithHash.id,
    role: userWithHash.role,
    username: userWithHash.username,
    area: userWithHash.area,
    permissionGroups: userWithHash.permissionGroups
  });

  const user = {
    id: userWithHash.id,
    username: userWithHash.username,
    fullname: userWithHash.fullname,
    role: userWithHash.role,
    specialty: userWithHash.specialty,
    area: userWithHash.area,
    permissions: userWithHash.permissionGroups
  };

  await logActivity({
    userId: userWithHash.id,
    action: 'AUTH:LOGIN',
    newValue: { username: userWithHash.username }
  });

  return { user, token };
}

export async function renewToken(userId: string): Promise<{ token: string }> {
  const user = await findUserById(userId);

  if (!user || !user.isActive)
    throw createUnauthorizedError('User not found or inactive');

  const token = generateToken({
    id: user.id,
    area: user.area,
    role: user.role,
    username: user.username,
    permissionGroups: user.permissionGroups
  });

  return { token };
}
