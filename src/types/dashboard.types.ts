export interface DashboardStatsDTO {
  todayAppointments: number;
  lowStockMedications: Array<{
    id: string;
    name: string;
    stock: number;
    minStock: number;
  }>;
  totalExamsCompleted: number;
  totalExamRevenue: number;
  newPatientsCount: number;
}
