export interface attendance_logs {
    id?: number;
    member_id: number;
    check_in_time: string;
}

export interface LastAttendance {
    last_attendance: string | null;
    duration_in_days: number | null;
}
export interface LogsDao {
    createLog(member_id: number, gym_id: number): Promise<number | undefined>;
    getLogsByMemberId(member_id: number): Promise<attendance_logs[]>;
    getLastCheckIn(member_id: number): Promise<attendance_logs | null>;
    getLastAttendanceWithDuration(memberId: number): Promise<LastAttendance>;
    getAllLogsByGym(gym_id: number): Promise<attendance_logs[]>;
}