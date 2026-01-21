export interface Permission {
  id: string;
  name: string;
  description?: string | undefined;
  isActive: boolean;
}
