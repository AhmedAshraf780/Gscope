import { CompanyDao } from './DAOs/companyDao';
import { SqlDataStore } from './sql';

export interface Datastore extends CompanyDao { }

export let db: Datastore;

export async function initDB(dbPath: string) {
  db = await new SqlDataStore().openDb(dbPath);
}
