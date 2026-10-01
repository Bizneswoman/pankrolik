// Standalone seed script: copies site data (content, menu, gallery, reviews)
// from the LOCAL database into a TARGET database (e.g. MongoDB Atlas).
//
// Usage:
//   LOCAL_URL="mongodb://localhost:27017" LOCAL_DB="pankrolik_db" \
//   TARGET_URL="mongodb+srv://user:pass@cluster.mongodb.net/" TARGET_DBS="pankrolik,test" \
//   node scripts/seed-atlas.mjs
//
// Idempotent: clears target collections first, then inserts fresh copies.

import { MongoClient } from 'mongodb'

const LOCAL_URL = process.env.LOCAL_URL
const LOCAL_DB = process.env.LOCAL_DB
const TARGET_URL = process.env.TARGET_URL
const TARGET_DBS = (process.env.TARGET_DBS || 'pankrolik').split(',').map((s) => s.trim()).filter(Boolean)
const COLLECTIONS = ['content', 'menu', 'gallery', 'reviews']

if (!LOCAL_URL || !LOCAL_DB || !TARGET_URL) {
  console.error('Missing env vars: LOCAL_URL, LOCAL_DB, TARGET_URL are required')
  process.exit(1)
}

const strip = ({ _id, ...rest }) => rest

async function main() {
  console.log('Connecting to LOCAL...')
  const local = new MongoClient(LOCAL_URL)
  await local.connect()
  const ldb = local.db(LOCAL_DB)

  const data = {}
  for (const c of COLLECTIONS) {
    data[c] = (await ldb.collection(c).find({}).toArray()).map(strip)
    console.log(`  local ${c}: ${data[c].length} docs`)
  }
  await local.close()

  if (!data.content.length) {
    console.error('Local DB has no content doc - aborting (run the app once to auto-seed locally).')
    process.exit(1)
  }

  console.log('Connecting to TARGET (Atlas)...')
  const target = new MongoClient(TARGET_URL, { serverSelectionTimeoutMS: 20000 })
  await target.connect()

  for (const dbName of TARGET_DBS) {
    const tdb = target.db(dbName)
    for (const c of COLLECTIONS) {
      await tdb.collection(c).deleteMany({})
      if (data[c].length) await tdb.collection(c).insertMany(data[c])
      const count = await tdb.collection(c).countDocuments()
      console.log(`  [${dbName}] ${c}: ${count} docs`)
    }
  }
  await target.close()
  console.log('DONE - target database(s) seeded successfully.')
}

main().catch((e) => {
  console.error('SEED FAILED:', e.message)
  process.exit(1)
})
