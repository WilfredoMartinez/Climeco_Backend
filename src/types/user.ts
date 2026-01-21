export interface User {
  id: string;
  createdAt: Date;
  fullname: string;
  isActive: boolean;
  permissionGroups: string[];
  phone?: string;
  role: string;
  specialty: string;
  area: string; // MEDICINA_GENERAL | ODONTOLOGIA
  username: string;
}
