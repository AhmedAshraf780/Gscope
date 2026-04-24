import path from 'path';
import { Database, open as sqliteOpen } from 'sqlite';
import sqlite3 from 'sqlite3';

import { Datastore } from '..';
import { Company } from '../DAOs/companyDao';

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

}
