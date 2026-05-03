export interface ReportDao {
    getTodayMembers: (gym_id: number, date: string) => Promise<number | null>;
    getMonthlyMembers: (gym_id: number, month: string) => Promise<number | null>;
    getMonthlyRevenue: (gym_id: number, month: string) => Promise<number | null>;
    getActiveMembers: (gym_id: number) => Promise<number | null>;
    getTodaySessions: (gym_id: number, date: string) => Promise<number | null>;
    getMonthlySessions: (gym_id: number, month: string) => Promise<number | null>;
    getMonthlySessionsByType: (gym_id: number, type: string, month: string) => Promise<number | null>;
}