import { CompanyDao } from "./DAOs/companyDao";
import { SqlDataStore } from "./sql";
import { MemberDao } from "./DAOs/memberDao";
import { LogsDao } from "./DAOs/logsDao";
import { BankDao } from "./DAOs/bankDao";
import { OfferDao } from "./DAOs/offerDao";
import { ReportDao } from './DAOs/reportDao';
export interface Datastore
  extends CompanyDao, MemberDao, LogsDao, ReportDao, BankDao, OfferDao { }

export let db: Datastore;

export async function initDB(dbPath: string) {
  db = await new SqlDataStore().openDb(dbPath);
}
