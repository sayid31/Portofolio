import { connectDB } from '../lib/mongodb.js'
import { signToken } from '../lib/auth.js'

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Try req.body first (Vercel dev may auto-parse), then manual parse
    let body = req.body
    if (!body || typeof body === 'string') {
      const raw = await getRawBody(req)
      body = raw ? JSON.parse(raw) : {}
    }

    const { username, password } = body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    const db = await connectDB()
    const admins = db.collection('admins')

    const admin = await admins.findOne({ username })
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (admin.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = signToken({ userId: admin._id.toString(), username: admin.username })

    return res.status(200).json({ token, username: admin.username })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
