import * as permissionRepository from '@/repositories/permission.repository';
import type { Permission } from '@/types/permission.types';

export async function getAllPermissions(): Promise<Permission[]> {
  return await permissionRepository.findAll();
}
