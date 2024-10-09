import { Db, MongoClient } from 'mongodb'
import { MONGO_CA, MONGO_DB, MONGO_URL, NODE_ENV } from '../config/config'

let cachedDb: Db | null = null

export async function getDb() {
  if (cachedDb) return cachedDb

  try {
    const client = await MongoClient.connect(MONGO_URL, NODE_ENV !== 'production' ?
      {} :
      {
        tlsInsecure: true,
        tls: true,
        tlsCAFile: MONGO_CA,
      })

    const db = client.db(MONGO_DB)
    cachedDb = db

    return db

  } catch (err: any) {
    console.error(`[ERROR] ${err}\n${err.stack}`)
    console.trace()

    process.exit()
  }
}