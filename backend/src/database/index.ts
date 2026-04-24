import { CompanyDao } from './DAOs/companyDao';
import { SqlDataStore } from './sql';
import { MemberDao } from './DAOs/memberDao';

export interface Datastore extends CompanyDao, MemberDao { }

export let db: Datastore;

export async function initDB(dbPath: string) {
  db = await new SqlDataStore().openDb(dbPath);
}

