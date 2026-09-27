import { connectDB } from './lib/mongodb.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const db = await connectDB()
    await db.command({ ping: 1 })
    return res.status(200).json({ status: 'ok', db: 'connected' })
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message })
  }
}
