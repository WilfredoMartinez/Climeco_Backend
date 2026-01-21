export interface CreateActivityLogDTO {
  userId: string;
  action: string;
  oldValue?: string;
  newValue?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  timestamp: Date;
  createdAt: Date;
}
