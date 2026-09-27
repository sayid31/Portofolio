import { connectDB } from '../lib/mongodb.js'
import { verifyToken, getAuthHeader } from '../lib/auth.js'
import { ObjectId } from 'mongodb'

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

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { id } = req.query
  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid project ID' })
  }

  let col
  const _id = new ObjectId(id)
  try {
    const db = await connectDB()
    col = db.collection('projects')
  } catch (err) {
    console.error('DB connection error:', err)
    return res.status(503).json({ error: 'Database unavailable' })
  }

  // ── GET /api/projects/:id — public ────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const item = await col.findOne({ _id })
      if (!item) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(item)
    } catch (err) {
      console.error('GET /api/projects/:id error:', err)
      return res.status(500).json({ error: 'Failed to fetch project' })
    }
  }

  // ── PUT /api/projects/:id — auth required ─────────────────────────────────
  if (req.method === 'PUT') {
    const token = getAuthHeader(req)
    const payload = token && verifyToken(token)
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const body = await parseBody(req)
      const update = {
        $set: {
          ...(body.title       != null && { title: body.title }),
          ...(body.subtitle    != null && { subtitle: body.subtitle }),
          ...(body.description != null && { description: body.description }),
          ...(body.category    != null && { category: body.category }),
          ...(body.tags        != null && { tags: body.tags }),
          ...(body.image       != null && { image: body.image }),
          ...(body.github      != null && { github: body.github }),
          ...(body.live        != null && { live: body.live }),
          ...(body.featured    != null && { featured: body.featured }),
          ...(body.order       != null && { order: body.order }),
          updatedAt: new Date(),
        },
      }

      const result = await col.findOneAndUpdate(
        { _id },
        update,
        { returnDocument: 'after' }
      )

      if (!result) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(result)
    } catch (err) {
      console.error('PUT /api/projects/:id error:', err)
      return res.status(500).json({ error: 'Failed to update project' })
    }
  }

  // ── DELETE /api/projects/:id — auth required ──────────────────────────────
  if (req.method === 'DELETE') {
    const token = getAuthHeader(req)
    const payload = token && verifyToken(token)
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const result = await col.deleteOne({ _id })
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Not found' })
      }
      return res.status(200).json({ deleted: true })
    } catch (err) {
      console.error('DELETE /api/projects/:id error:', err)
      return res.status(500).json({ error: 'Failed to delete project' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
