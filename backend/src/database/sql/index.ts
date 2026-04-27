import path from 'path';
import { Database, open as sqliteOpen } from 'sqlite';
import sqlite3 from 'sqlite3';

import { Datastore } from '..';
import { Company } from '../DAOs/companyDao';
import { Member, Session } from '../DAOs/memberDao';

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
      console.log('Database opened');
    } catch (e) {
      console.log(e);
      process.exit(1);
    }

    this.db.run('PRAGMA foreign_keys = ON;');
    await this.db.migrate({
      migrationsPath: path.join(__dirname, 'migrations'),
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
        `INSERT INTO companies (name, email, phone, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)`,
        [company.name, company.email, company.phone, company.created_at, company.updated_at]
      );
      return result.lastID;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async getCompanyById(id: number): Promise<Company | null> {
    try {
      const row = await this.db.get(
        `SELECT * FROM companies WHERE id = ?`,
        [id]
      );
      return row || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getCompanyByEmail(email: string): Promise<Company | null> {
    try {

      const row = await this.db.get(
        `SELECT * FROM companies WHERE email = ?`,
        [email]
      );
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
        [company.name, company.email, company.phone, company.updated_at, id]
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

  async updateCompanyPassword(email: string, password: string): Promise<boolean> {
    try {
      await this.db.run(
        `UPDATE companies 
            SET password = ?
            WHERE email = ?`,
        [password, email]
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
      const result = await this.db.run(
        `INSERT INTO members (gym_id,name, phone, months, price, start_date, end_date, notes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [gym_id, member.name, member.phone, member.months, member.price, member.start_date, member.end_date, member.notes]
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
        `SELECT * FROM members WHERE name = ?`,// TODO: filter names 
        [name]
      );
      return row || null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async getMemberById(id: number): Promise<Member | null> {
    try {
      const row = await this.db.get(
        `SELECT * FROM members WHERE id = ?`,
        [id]
      );
      return row || null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updateMember(id: number, months: number, price: number): Promise<boolean> {
    try {
      const now = new Date();

      // format: YYYY-M-D
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
        [months, price, start_date, end_date, id]
      );

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async listMembersOfGym(gym_id: number): Promise<Member[]> {
    try {
      return await this.db.all(`SELECT * FROM members WHERE gym_id = ?`, [gym_id]);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async addSession(session: Session, gym_id: number): Promise<boolean> {
    try {
      await this.db.run(
        `INSERT INTO sessions (gym_id,session_date, session_type, price, member_name) VALUES (?, ?, ?, ?, ?)`,
        [gym_id, session.session_date, session.session_type, session.price, session.member_name]
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async listSessions(type: string, gym_id: number): Promise<Session[]> {
    try {
      return await this.db.all(`SELECT * FROM sessions WHERE session_type = ? AND gym_id = ?`, [type, gym_id]);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  /*==========================================================================
   *
   *
   *             MEMBER DAO IMPLEMENTATION  ( END )
   *
   *=======================================================================
   */
}






