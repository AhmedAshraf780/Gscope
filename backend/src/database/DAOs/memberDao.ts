export interface Member {
    id?: number;
    name: string;
    phone: string;
    months: number;
    price: number;
    start_date: string;
    end_date: string;
    notes: string;

}

export interface Session {
    id?: number;
    session_date: string;
    session_type: "gym" | "football" | "else";
    price: number;
    member_name: string;
}

export interface MemberDao {

    getMemberById: (id: number) => Promise<Member | null>;
    getMemberByName: (name: string) => Promise<Member | null>;
    deleteMember: (id: number) => Promise<boolean>;
    addMember: (member: Member, gym_id: number) => Promise<number | undefined>;
    updateMember: (id: number, months: number, price: number) => Promise<boolean>;
    listMembersOfGym: (id: number) => Promise<Member[]>;
    addSession: (session: Session, gym_id: number) => Promise<boolean>;
    listSessions: (type: string, gym_id: number) => Promise<Session[]>;
}
