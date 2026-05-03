import { Member, Session } from "./memberDao";

export interface ReportDao {
    getMembersbyday: (gym_id: number, date: string) => Promise<{ total: number, members: Member[] } | null>;
    getMembersbymonth: (gym_id: number, month: string) => Promise<{ total: number, members: Member[] } | null>;
    getRevenuebymonth: (gym_id: number, month: string) => Promise<{
        totalRevenue: number;
        membersRevenue: number;
        sessionsRevenue: number;
        membersCount: number;
        sessionsCount: number;
        members: Member[];
        sessions: Session[];
    } | null>;
    getRevenuebyday: (gym_id: number, date: string) => Promise<{
        totalRevenue: number;
        membersRevenue: number;
        sessionsRevenue: number;
        membersCount: number;
        sessionsCount: number;
        members: Member[];
        sessions: Session[];
    } | null>;
    getSessionsbyday: (gym_id: number, date: string) => Promise<{ total: number, sessions: Session[] } | null>;
    getSessionsdayByType: (gym_id: number, type: string, date: string) => Promise<{ total: number, sessions: Session[] } | null>;
    getSessionsbymonth: (gym_id: number, month: string) => Promise<{ total: number, sessions: Session[] } | null>;
    getSessionsMonthByType: (gym_id: number, type: string, month: string) => Promise<{ total: number, sessions: Session[] } | null>;


    getTodaySessions: (gym_id: number) => Promise<number | null>;
    getTodayRevenue: (gym_id: number) => Promise<number | null>;
    getmonthRevenue: (gym_id: number) => Promise<number | null>;
    getTodaymembers: (gym_id: number) => Promise<number | null>;

    getActiveMembers: (gym_id: number) => Promise<number | null>;
}
