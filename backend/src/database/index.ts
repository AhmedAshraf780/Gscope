import { CompanyDao } from "./DAOs/companyDao";
import { SqlDataStore } from "./sql";
import { MemberDao } from "./DAOs/memberDao";
import { LogsDao } from "./DAOs/logsDao";
import { BankDao } from "./DAOs/bankDao";
import { OfferDao } from "./DAOs/offerDao";
export interface Datastore
  extends CompanyDao, MemberDao, LogsDao, BankDao, OfferDao {}

export let db: Datastore;

export async function initDB(dbPath: string) {
  db = await new SqlDataStore().openDb(dbPath);
}
