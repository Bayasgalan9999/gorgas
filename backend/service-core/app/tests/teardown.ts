import { getDb } from "../src/services/mongodb"

export default async (globalConfig: unknown, projectConfig: unknown) => {
  const db = await getDb()

  if (db.databaseName.includes('-test')) {
    await db.dropDatabase()
    console.log(`[TEST TEARDOWN] Database dropped...`);
    
  }
}