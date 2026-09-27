import { createHmac, randomBytes } from 'crypto'

const SECRET = process.env.JWT_SECRET || process.env.ADMIN_SECRET || 'change-me-in-production'

export function signToken(payload, expiresInMs = 24 * 60 * 60 * 1000) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url')
  const body   = Buffer.from(JSON.stringify({
    ...payload,
    iat: Date.now(),
    exp: Date.now() + expiresInMs,
  })).toString('base64url')
  const sig = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${sig}`
}

export function verifyToken(token) {
  try {
    const [header, body, sig] = token.split('.')
    const expected = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url')
    if (sig !== expected) return null

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function getAuthHeader(event) {
  const auth = event.headers?.authorization || event.headers?.Authorization
  if (!auth?.startsWith('Bearer ')) return null
  return auth.slice(7)
}
