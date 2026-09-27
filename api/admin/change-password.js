import { connectDB } from '../lib/mongodb.js'
import { verifyToken, getAuthHeader } from '../lib/auth.js'

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

async function parseBody(req) {
  let body = req.body
  if (!body || typeof body === 'string') {
    const raw = await getRawBody(req)
    body = raw ? JSON.parse(raw) : {}
  }
  return body
}

// POST /api/admin/change-password — requires auth
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = getAuthHeader(req)
  const payload = token && verifyToken(token)
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { currentPassword, newPassword } = await parseBody(req)

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' })
    }

    const db = await connectDB()
    const admins = db.collection('admins')
    const { ObjectId } = await import('mongodb')

    const admin = await admins.findOne({ _id: new ObjectId(payload.userId) })
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    if (admin.password !== currentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    await admins.updateOne(
      { _id: new ObjectId(payload.userId) },
      { $set: { password: newPassword, updatedAt: new Date() } }
    )

    return res.status(200).json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('Change password error:', err)
    return res.status(500).json({ error: 'Failed to change password' })
  }
}
