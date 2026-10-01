import { MongoClient } from 'mongodb'

let client
let clientPromise

async function getDb() {
  if (!clientPromise) {
    client = new MongoClient(process.env.MONGO_URL)
    clientPromise = client.connect().then((c) => c)
  }
  const connected = await clientPromise
  return connected.db(process.env.DB_NAME)
}

const clean = (x) => {
  if (!x) return x
  const { _id, ...rest } = x
  return rest
}

export async function getSiteData() {
  try {
    const db = await getDb()
    const [content, menu, gallery, reviews] = await Promise.all([
      db.collection('content').findOne({ id: 'site' }),
      db.collection('menu').find({}).sort({ order: 1 }).toArray(),
      db.collection('gallery').find({}).sort({ order: 1 }).toArray(),
      db.collection('reviews').find({}).toArray(),
    ])
    return {
      content: clean(content),
      menu: (menu || []).map(clean),
      gallery: (gallery || []).map(clean),
      reviews: (reviews || []).map(clean),
    }
  } catch (e) {
    console.error('getSiteData error', e)
    return { content: null, menu: [], gallery: [], reviews: [] }
  }
}
