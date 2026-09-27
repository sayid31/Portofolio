import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB  = process.env.MONGODB_DB || 'portfolio'

let cachedClient = null
let cachedDb     = null

export async function connectDB() {
  if (cachedDb) return cachedDb

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI env variable is not set')
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    // Vercel serverless best practices
    maxPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
  })

  cachedClient = client
  cachedDb = client.db(MONGODB_DB)

  return cachedDb
}
