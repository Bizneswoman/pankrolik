import { MongoClient } from 'mongodb'
import { ensureSeed, DEFAULT_CONTENT, mkMenu, mkGallery, mkReviews } from './seed'

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
    await ensureSeed(db)
    const [content, menu, gallery, reviews] = await Promise.all([
      db.collection('content').findOne({ id: 'site' }),
      db.collection('menu').find({}).sort({ order: 1 }).toArray(),
      db.collection('gallery').find({}).sort({ order: 1 }).toArray(),
      db.collection('reviews').find({}).toArray(),
    ])
    return {
      content: clean(content) || DEFAULT_CONTENT,
      menu: menu && menu.length ? menu.map(clean) : mkMenu(),
      gallery: gallery && gallery.length ? gallery.map(clean) : mkGallery(),
      reviews: reviews && reviews.length ? reviews.map(clean) : mkReviews(),
    }
  } catch (e) {
    console.error('getSiteData error', e)
    // Fallback: never crash the page - render default content even if DB is unreachable
    return { content: DEFAULT_CONTENT, menu: mkMenu(), gallery: mkGallery(), reviews: mkReviews() }
  }
}
