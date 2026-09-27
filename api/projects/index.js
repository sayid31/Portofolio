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

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  let db, projects
  try {
    db = await connectDB()
    projects = db.collection('projects')
  } catch (err) {
    console.error('DB connection error:', err)
    return res.status(503).json({ error: 'Database unavailable' })
  }

  // ── GET /api/projects — public, list all ──────────────────────────────────
  if (req.method === 'GET') {
    try {
      const { category, limit = '50' } = req.query
      const filter = category ? { category } : {}
      const items = await projects
        .find(filter)
        .sort({ order: 1, createdAt: -1 })
        .limit(parseInt(limit))
        .toArray()

      return res.status(200).json(items)
    } catch (err) {
      console.error('GET /api/projects error:', err)
      return res.status(500).json({ error: 'Failed to fetch projects' })
    }
  }

  // ── POST /api/projects — auth required ────────────────────────────────────
  if (req.method === 'POST') {
    const token = getAuthHeader(req)
    const payload = token && verifyToken(token)
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const body = await parseBody(req)
      if (!body.title) {
        return res.status(400).json({ error: 'Title is required' })
      }

      const doc = {
        title:       body.title || '',
        subtitle:    body.subtitle || '',
        description: body.description || '',
        category:    body.category || 'general',
        tags:        body.tags || [],
        image:       body.image || '',
        github:      body.github || '',
        live:        body.live || '',
        featured:    body.featured || false,
        order:       body.order || 0,
        createdAt:   new Date(),
        updatedAt:   new Date(),
      }

      const result = await projects.insertOne(doc)
      return res.status(201).json({ ...doc, _id: result.insertedId })
    } catch (err) {
      console.error('POST /api/projects error:', err)
      return res.status(500).json({ error: 'Failed to create project' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
