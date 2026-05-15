export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: "Active" | "Paused" | "Expired";
  sessionsLeft: number;
  joinedAt: string;
  lastCheckIn: string;
};

export type LogEntry = {
  id: number;
  member_id: number;
  name: string;
  phone: string;
  check_in_time: string;
  gym_id: number;
};

export type SessionEntry = {
  id: number;
  member_name: string;
  phone: string;
  session_type: string;
  price: number;
  session_date: string;
};

export type ExpenseEntry = {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  notes: string;
};

export type BasicAnalysis = {
  todayrevenue: number;
  mothrevenue: number;
  todaysessions: number;
  todayMembers: number;
  activeMembers: number;
  memberslogedtoday: number;
  membersOfTheGym: number;
  membersExpiringSoon: number;
};

export type OfferOption = {
  id: string;
  name: string;
};

export type Offer = {
  id: number;
  name: string;
  months: number;
  price: number;
  offer_end_date: string;
  created_at: string;
  member_count?: number;
};

export type ProfileMember = {
  id: string;
  name: string;
  phone: string;
  months: string;
  amount: string;
  startDate: string;
  endDate: string;
  notes: string;
};
