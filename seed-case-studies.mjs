import fs from 'fs'
import { MongoClient } from 'mongodb'
import { CASE_STUDIES } from './api/lib/case-studies.js'

const env = {}
fs.readFileSync('.env', 'utf8').split(/\r?\n/).forEach((l) => {
  const m = l.match(/^([^#=]+)=(.*)$/)
  if (m) env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '')
})

const client = await MongoClient.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
const projects = client.db(env.MONGODB_DB || 'portfolio').collection('projects')

for (const c of CASE_STUDIES) {
  const { slug } = c

  const exists = await projects.findOne({ slug })
  if (exists) {
    console.log('skip (slug exists):', slug)
    continue
  }

  if (slug === 'ai-feedback') {
    // Already in the DB from the earlier restore — just attach the slug and
    // clear the plain-text description so the homepage rich default renders.
    const r = await projects.updateOne(
      { title: 'AI Customer Feedback Analyzer' },
      { $set: { slug: 'ai-feedback', description: '' } },
    )
    console.log('ai-feedback slug attached:', r.modifiedCount)
    continue
  }

  const { insertedId } = await projects.insertOne({
    ...c,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  console.log('seeded:', slug, insertedId.toString())
}

const all = await projects.find({}).toArray()
console.log('--- final state:', all.length, 'projects ---')
for (const p of all.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))) {
  console.log(`  ${String(p.order ?? 0).padStart(2)}  ${p.slug || '(no slug)'}  ${p.title}`)
}

await client.close()
