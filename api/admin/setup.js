import { connectDB } from '../lib/mongodb.js'

// POST /api/admin/setup — create initial admin (only works if no admin exists)
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const db    = await connectDB()
    const admins = db.collection('admins')

    // Check if admin already exists
    const existing = await admins.findOne({})
    if (existing) {
      return res.status(400).json({ error: 'Admin already exists. Use login instead.' })
    }

    const { username, password } = req.body || {}
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const result = await admins.insertOne({
      username,
      password, // Plain for simplicity — use bcrypt in production
      createdAt: new Date(),
    })

    return res.status(201).json({ message: 'Admin created', id: result.insertedId })
  } catch (err) {
    console.error('Admin setup error:', err)
    return res.status(500).json({ error: 'Failed to create admin' })
  }
}
