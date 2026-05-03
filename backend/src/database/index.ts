import { CompanyDao } from "./DAOs/companyDao";
import { SqlDataStore } from "./sql";
import { MemberDao } from "./DAOs/memberDao";
import { LogsDao } from "./DAOs/logsDao";
import { BankDao } from "./DAOs/bankDao";
import { OfferDao } from "./DAOs/offerDao";
import { ReportDao } from './DAOs/reportDao';
import { ExpensesDao } from "./DAOs/expensesDao";
export interface Datastore
  extends CompanyDao, MemberDao, LogsDao, ReportDao, BankDao, OfferDao, ExpensesDao { }

export let db: Datastore;

export async function initDB(dbPath: string) {
  db = await new SqlDataStore().openDb(dbPath);
}
