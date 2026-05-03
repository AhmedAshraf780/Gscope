import path from "path";
import { Database, open as sqliteOpen } from "sqlite";
import sqlite3 from "sqlite3";

import { Datastore } from "..";
import { Company } from "../DAOs/companyDao";
import { Member, Session } from "../DAOs/memberDao";
import { attendance_logs } from "../DAOs/logsDao";
import { LastAttendance } from "../DAOs/logsDao";
import { Offer } from "../DAOs/offerDao";
import { Expense } from "../DAOs/expensesDao";
export class SqlDataStore implements Datastore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;

  public async openDb(dbPath: string) {
    try {
      dbPath = path.join(__dirname, "gscope.db");
      this.db = await sqliteOpen({
        filename: dbPath,
        driver: sqlite3.Database,
        mode: sqlite3.OPEN_READWRITE,
      });
      console.log("Database opened");
    } catch (e) {
      console.log(e);
      process.exit(1);
    }

    this.db.run("PRAGMA foreign_keys = ON;");
    await this.db.migrate({
      migrationsPath: path.join(__dirname, "migrations"),
    });
    return this;
  }

  /*==========================================================================
   *
   *
   *             GYM DAO IMPLEMENTATION ( START )
   *
   *=======================================================================
   */

  async createCompany(company: Company): Promise<number | undefined> {
    try {
      const result = await this.db.run(
        `INSERT INTO companies (name, email, phone,password ,created_at, updated_at)
            VALUES (?, ?, ?,?, ?, ?)`,
        [
          company.name,
          company.email,
          company.phone,
          company.password,
          company.created_at,
          company.updated_at,
        ],
      );
      return result.lastID;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async getCompanyById(id: number): Promise<Company | null> {
    try {
      const row = await this.db.get(`SELECT * FROM companies WHERE id = ?`, [
        id,
      ]);
      return row || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getCompanyByEmail(email: string): Promise<Company | null> {
    try {
      const row = await this.db.get(`SELECT * FROM companies WHERE email = ?`, [
        email,
      ]);
      return row || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getAllCompanies(): Promise<Company[]> {
    try {
      return await this.db.all(`SELECT * FROM companies`);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async updateCompany(id: number, company: Company): Promise<void> {
    try {
      await this.db.run(
        `UPDATE companies
            SET name = ?, email = ?, phone = ?, updated_at = ?
            WHERE id = ?`,
        [company.name, company.email, company.phone, company.updated_at, id],
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCompanyById(id: number): Promise<void> {
    try {
      await this.db.run(`DELETE FROM companies WHERE id = ?`, [id]);
    } catch (error) {
      console.log(error);
    }
  }

  async updateCompanyPassword(
    email: string,
    password: string,
  ): Promise<boolean> {
    try {
      await this.db.run(
        `UPDATE companies
            SET password = ?
            WHERE email = ?`,
        [password, email],
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /*==========================================================================
   *
   *
   *             GYM DAO IMPLEMENTATION  (END)
   *
   *=======================================================================
   */

  /*==========================================================================
   *
   *
   *             MEMBER DAO IMPLEMENTATION  ( START )
   *
   *=======================================================================
   */
  async deleteMember(id: number): Promise<boolean> {
    try {
      await this.db.run(`DELETE FROM members WHERE id = ?`, [id]);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async addMember(member: Member, gym_id: number): Promise<number | undefined> {
    try {
      const now = new Date();

      const formatDate = (date: Date) => date.toISOString().slice(0, 10);

      member.start_date = formatDate(now);

      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + member.months);
      member.end_date = formatDate(endDate);

      const result = await this.db.run(
        `INSERT INTO members (gym_id,name, phone, months, price, start_date, end_date, notes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          gym_id,
          member.name,
          member.phone,
          member.months,
          member.price,
          member.start_date,
          member.end_date,
          member.notes,
        ],
      );
      return result.lastID;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  async getMemberByName(name: string): Promise<Member | null> {
    try {
      const row = await this.db.get(
        `SELECT * FROM members WHERE LOWER(name) = LOWER(?)`, // TODO: filter names
        [name.trim()],
      );
      return row || null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async getMemberById(id: number): Promise<Member | null> {
    try {
      const row = await this.db.get(`SELECT * FROM members WHERE id = ?`, [id]);
      return row || null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updateMember(
    id: number,
    months: number,
    price: number,
  ): Promise<boolean> {
    try {
      const now = new Date();

      const formatDate = (date: Date) =>
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

      const start_date = formatDate(now);

      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + months);
      const end_date = formatDate(endDate);

      await this.db.run(
        `UPDATE members
       SET months = ?, price = ?, start_date = ?, end_date = ?
       WHERE id = ?`,
        [months, price, start_date, end_date, id],
      );

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async listMembersOfGym(gym_id: number): Promise<Member[]> {
    try {
      return await this.db.all(`SELECT * FROM members WHERE gym_id = ?`, [
        gym_id,
      ]);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async addSession(session: Session, gym_id: number): Promise<boolean> {
    try {
      await this.db.run(
        `INSERT INTO sessions (gym_id,session_date, session_type, price, member_name) VALUES (?, ?, ?, ?, ?)`,
        [
          gym_id,
          session.session_date,
          session.session_type,
          session.price,
          session.member_name,
        ],
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async listSessions(gym_id: number): Promise<Session[]> {
    try {
      return await this.db.all(`SELECT * FROM sessions WHERE gym_id = ?`, [
        gym_id,
      ]);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  // LOGS
  /////////////////////////////////////////////////////////////////////////////

  async createLog(
    member_id: number,
    gym_id: number,
  ): Promise<number | undefined> {
    try {
      const result = await this.db.run(
        `INSERT INTO attendance_logs (member_id, check_in_time, gym_id)
            VALUES (?, ?, ?)`,
        [member_id, new Date().toISOString(), gym_id],
      );
      return result.lastID;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async getLogsByMemberId(member_id: number): Promise<attendance_logs[]> {
    try {
      return await this.db.all(
        `SELECT * FROM attendance_logs WHERE member_id = ?`,
        [member_id],
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getLastCheckIn(member_id: number): Promise<attendance_logs | null> {
    try {
      const row = await this.db.get(
        `SELECT * FROM attendance_logs WHERE member_id = ? ORDER BY check_in_time DESC LIMIT 1`,
        [member_id],
      );
      return row || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getLastAttendanceWithDuration(
    memberId: number,
  ): Promise<LastAttendance> {
    const row = await this.db.get(
      `SELECT MAX(check_in_time) as last_attendance
     FROM attendance_logs
     WHERE member_id = ?`,
      [memberId],
    );

    if (!row || !row.last_attendance) {
      return {
        last_attendance: null,
        duration_in_days: null,
      };
    }

    const lastDate = new Date(row.last_attendance);
    const now = new Date();

    const diffMs = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return {
      last_attendance: row.last_attendance,
      duration_in_days: diffDays,
    };
  }

  async getAllLogsByGym(gym_id: number): Promise<attendance_logs[]> {
    try {
      return await this.db.all(
        `SELECT * FROM attendance_logs WHERE gym_id = ?`,
        [gym_id],
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  // REPORTS
  ////////////////////////////////////////////////////////////////////////////////////////////
  async getMembersbyday(
    gym_id: number,
    date: string,
  ): Promise<{ total: number; members: Member[] } | null> {
    try {
      const row = await this.db.get(
        `SELECT * FROM members WHERE gym_id = ? AND start_date = ?`,
        [gym_id, date],
      );
      return {
        total: row.length,
        members: row,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getMembersbymonth(
    gym_id: number,
    month: string,
  ): Promise<{ total: number; members: Member[] } | null> {
    try {
      const row = await this.db.get(
        `SELECT * FROM members WHERE gym_id = ? AND strftime('%Y-%m', start_date) = ?`,
        [gym_id, month],
      );
      return {
        total: row.length,
        members: row,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getRevenuebymonth(
    gym_id: number,
    month: string,
  ): Promise<{
    totalRevenue: number;
    membersRevenue: number;
    sessionsRevenue: number;
    membersCount: number;
    sessionsCount: number;
    members: Member[];
    sessions: Session[];
  } | null> {
    try {
      const memberrow = await this.db.get(
        `SELECT * FROM members WHERE gym_id =? AND strftime('%Y-%m', start_date) = ?`,
        [gym_id, month],
      );
      const sessionrow = await this.db.get(
        `SELECT * FROM sessions WHERE gym_id =? AND strftime('%Y-%m', session_date) = ?`,
        [gym_id, month],
      );

      const memberTotal = memberrow.reduce(
        (sum: number, m: any) => sum + (m.price || 0),
        0,
      );
      const sessionTotal = sessionrow.reduce(
        (sum: number, s: any) => sum + (s.price || 0),
        0,
      );

      return {
        totalRevenue: memberTotal + sessionTotal,
        membersRevenue: memberTotal,
        sessionsRevenue: sessionTotal,
        membersCount: memberrow.length,
        sessionsCount: sessionrow.length,
        members: memberrow,
        sessions: sessionrow,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getRevenuebyday(
    gym_id: number,
    date: string,
  ): Promise<{
    totalRevenue: number;
    membersRevenue: number;
    sessionsRevenue: number;
    membersCount: number;
    sessionsCount: number;
    members: Member[];
    sessions: Session[];
  } | null> {
    try {
      const memberrow = await this.db.get(
        `SELECT * FROM members WHERE gym_id =? AND start_date = ?`,
        [gym_id, date],
      );
      const sessionrow = await this.db.get(
        `SELECT * FROM sessions WHERE gym_id =? AND session_date = ?`,
        [gym_id, date],
      );

      const memberTotal = memberrow.reduce(
        (sum: number, m: any) => sum + (m.price || 0),
        0,
      );
      const sessionTotal = sessionrow.reduce(
        (sum: number, s: any) => sum + (s.price || 0),
        0,
      );

      return {
        totalRevenue: memberTotal + sessionTotal,
        membersRevenue: memberTotal,
        sessionsRevenue: sessionTotal,
        membersCount: memberrow.length,
        sessionsCount: sessionrow.length,
        members: memberrow,
        sessions: sessionrow,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getSessionsbyday(
    gym_id: number,
    date: string,
  ): Promise<{ total: number; sessions: Session[] } | null> {
    try {
      const row = await this.db.get(
        `SELECT * FROM sessions WHERE gym_id = ? AND session_date = ?`,
        [gym_id, date],
      );
      return {
        total: row.length,
        sessions: row,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getSessionsdayByType(
    gym_id: number,
    type: string,
    date: string,
  ): Promise<{ total: number; sessions: Session[] } | null> {
    try {
      const row = await this.db.get(
        `SELECT * FROM sessions WHERE gym_id = ? AND session_type = ? AND session_date = ?`,
        [gym_id, type, date],
      );
      return {
        total: row.length,
        sessions: row,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getSessionsbymonth(
    gym_id: number,
    month: string,
  ): Promise<{ total: number; sessions: Session[] } | null> {
    try {
      const row = await this.db.get(
        `SELECT * FROM sessions WHERE gym_id = ? AND strftime('%Y-%m', session_date) = ?`,
        [gym_id, month],
      );
      return {
        total: row.length,
        sessions: row,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getSessionsMonthByType(
    gym_id: number,
    type: string,
    month: string,
  ): Promise<{ total: number; sessions: Session[] } | null> {
    try {
      const row = await this.db.get(
        `SELECT * FROM sessions WHERE gym_id = ? AND session_type = ? AND strftime('%Y-%m', session_date) = ?`,
        [gym_id, type, month],
      );
      return {
        total: row.length,
        sessions: row,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getTodaySessions(gym_id: number): Promise<number | null> {
    try {
      const row = await this.db.get(
        `SELECT COUNT(*) as total FROM sessions WHERE gym_id = ? AND session_date = DATE('now')`,
        [gym_id],
      );
      return row?.total || 0;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getTodayRevenue(gym_id: number): Promise<number | null> {
    try {
      const memberrow = await this.db.get(
        `SELECT SUM(price) as total FROM members WHERE gym_id =? AND start_date = DATE('now')`,
        [gym_id],
      );
      const sessionrow = await this.db.get(
        `SELECT SUM(price) as total FROM sessions WHERE gym_id =? AND session_date = DATE('now')`,
        [gym_id],
      );
      const memberTotal = memberrow?.total || 0;
      const sessionTotal = sessionrow?.total || 0;
      return memberTotal + sessionTotal;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getmonthRevenue(gym_id: number): Promise<number | null> {
    try {
      const memberrow = await this.db.get(
        `SELECT SUM(price) as total FROM members WHERE gym_id =? AND strftime('%Y-%m', start_date) = strftime('%Y-%m',DATE('now')) `,
        [gym_id],
      );
      const sessionrow = await this.db.get(
        `SELECT SUM(price) as total FROM sessions WHERE gym_id =? AND strftime('%Y-%m', session_date) = strftime('%Y-%m',DATE('now'))`,
        [gym_id],
      );
      const memberTotal = memberrow?.total || 0;
      const sessionTotal = sessionrow?.total || 0;
      return memberTotal + sessionTotal;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getTodaymembers(gym_id: number): Promise<number | null> {
    try {
      const row = await this.db.get(
        `SELECT COUNT(*) as total FROM members WHERE gym_id = ? AND start_date = DATE('now')`,
        [gym_id],
      );
      return row?.total || 0;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getActiveMembers(gym_id: number): Promise<number | null> {
    try {
      const row = await this.db.get(
        `SELECT COUNT(*) as total FROM members WHERE gym_id = ? AND end_date >= DATE('now')`,
        [gym_id],
      );
      return row?.total || 0;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  /////////////BANK
  ///////////////////////////////////////////////////////////////////////////////////////////

  async getBankMoney(gym_id: number): Promise<number> {
    try {
      const row = await this.db.get(`SELECT money FROM bank WHERE gym_id = ?`, [
        gym_id,
      ]);
      return row.money || 0;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  async addBank(gym_id: number, money: number): Promise<number | null> {
    try {
      await this.db.run(
        `INSERT INTO bank (gym_id, money)
              VALUES (?, ?)`,
        [gym_id, money],
      );
      return 1;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateBank(gym_id: number, money: number): Promise<number | null> {
    try {
      // get the money from the bank
      const row = await this.db.get(`SELECT money FROM bank WHERE gym_id = ?`, [
        gym_id,
      ]);

      money = money + row.money;
      await this.db.run(
        `UPDATE bank
              SET money = ?
              WHERE gym_id = ?`,
        [money, gym_id],
      );
      return money;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addOffer(gym_id: number, offer: Offer): Promise<number | null> {
    try {
      const row = await this.db.run(
        `INSERT INTO offers(gym_id,name,offer_end_date,price,months,member_count) VALUES(?,?,?,?,?,?)`,
        [
          gym_id,
          offer.name,
          offer.offer_end_date,
          offer.price,
          offer.months,
          0,
        ],
      );
      return row.lastID || null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getOffers(gym_id: number): Promise<Offer[] | null> {
    try {
      const rows = await this.db.all(`SELECT * FROM offers WHERE gym_id = ?`, [
        gym_id,
      ]);
      return rows || null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getAvailableOffers(gym_id: number): Promise<Offer[] | null> {
    try {
      const rows = await this.db.all(
        `SELECT * FROM offers
          WHERE gym_id = ?
          AND offer_end_date >= date('now')`,
        [gym_id],
      );

      return rows.length ? rows : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updateOfferCount(offer_id: number): Promise<boolean> {
    try {
      const res = await this.db.run(
        `UPDATE offers set member_count = member_count + 1 where id = ?`,
        [offer_id],
      );
      return res.changes! > 0;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  /*==========================================================================
   *
   *
   *             EXPENSES DAO IMPLEMENTATION  ( START )
   *
   *=======================================================================*/

  async createExpense(expense: Expense): Promise<number | null> {
    try {
      const result = await this.db.run(
        `INSERT INTO expenses
                (title, amount, date, category, notes, created_at)
                VALUES (?, ?, ?, ?, ?, datetime('now'))`,
        [
          expense.title,
          expense.amount,
          expense.date,
          expense.category,
          expense.notes,
        ],
      );
      return result.lastID || null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getAllExpenses(): Promise<Expense[]> {
    try {
      return await this.db.all(`SELECT * FROM expenses`);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getExpenseById(id: number): Promise<Expense | null> {
    try {
      const row = await this.db.get(`SELECT * FROM expenses WHERE id = ?`, [
        id,
      ]);
      return row || null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updateExpense(expense: Expense): Promise<boolean> {
    try {
      const result = await this.db.run(
        `UPDATE expenses
                 SET title = ?, amount = ?, date = ?, category = ?, notes = ?
                 WHERE id = ?`,
        [
          expense.title,
          expense.amount,
          expense.date,
          expense.category,
          expense.notes,
          expense.id,
        ],
      );
      return (result?.changes ?? 0) > 0;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async deleteExpense(id: number): Promise<boolean> {
    try {
      const result = await this.db.run(`DELETE FROM expenses WHERE id = ?`, [
        id,
      ]);
      return (result?.changes ?? 0) > 0;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async getTotalExpenses(): Promise<number> {
    try {
      const row = await this.db.get(
        `SELECT SUM(amount) as total FROM expenses`,
      );
      return row?.total || 0;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }

  async getExpensesByDateRange(start: string, end: string): Promise<Expense[]> {
    try {
      return await this.db.all(
        `SELECT * FROM expenses
                 WHERE date BETWEEN ? AND ?`,
        [start, end],
      );
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getTotalByDateRange(start: string, end: string): Promise<number> {
    try {
      const row = await this.db.get(
        `SELECT SUM(amount) as total
                 FROM expenses
                 WHERE date BETWEEN ? AND ?`,
        [start, end],
      );
      return row?.total || 0;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }

  async getTotalByCategory(): Promise<{ category: string; total: number }[]> {
    try {
      return await this.db.all(
        `SELECT category, SUM(amount) as total
                 FROM expenses
                 GROUP BY category`,
      );
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
