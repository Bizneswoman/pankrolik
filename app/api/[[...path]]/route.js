import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { ensureSeed } from '@/lib/seed'

// MongoDB connection
let client
let clientPromise
let db

async function connectToMongo() {
  if (!clientPromise) {
    client = new MongoClient(process.env.MONGO_URL)
    clientPromise = client.connect().then((c) => c)
  }
  const connected = await clientPromise
  db = connected.db(process.env.DB_NAME)
  return db
}

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pankrolik2025'


function checkAuth(request) {
  return request.headers.get('x-admin-token') === ADMIN_PASSWORD
}

function unauthorized() {
  return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
}

async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()
    await ensureSeed(db)

    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'Pan Kr\u00f3lik API' }))
    }

    // ---- Admin login ----
    if (route === '/admin/login' && method === 'POST') {
      const body = await request.json()
      if (body.password === ADMIN_PASSWORD) {
        return handleCORS(NextResponse.json({ success: true, token: ADMIN_PASSWORD }))
      }
      return handleCORS(NextResponse.json({ success: false, error: 'Nieprawid\u0142owe has\u0142o' }, { status: 401 }))
    }

    // ---- Content ----
    if (route === '/content' && method === 'GET') {
      const doc = await db.collection('content').findOne({ id: 'site' })
      const { _id, ...rest } = doc || {}
      return handleCORS(NextResponse.json(rest))
    }
    if (route === '/content' && method === 'PUT') {
      if (!checkAuth(request)) return unauthorized()
      const body = await request.json()
      delete body._id
      body.id = 'site'
      await db.collection('content').updateOne({ id: 'site' }, { $set: body }, { upsert: true })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // ---- Menu ----
    if (route === '/menu' && method === 'GET') {
      const items = await db.collection('menu').find({}).sort({ order: 1 }).toArray()
      return handleCORS(NextResponse.json(items.map(({ _id, ...r }) => r)))
    }
    if (route === '/menu' && method === 'POST') {
      if (!checkAuth(request)) return unauthorized()
      const body = await request.json()
      const count = await db.collection('menu').countDocuments()
      const item = { id: uuidv4(), order: count, category: body.category || 'Dania g\u0142\u00f3wne', name: body.name || '', description: body.description || '', price: body.price || '', image: body.image || '' }
      await db.collection('menu').insertOne(item)
      const { _id, ...rest } = item
      return handleCORS(NextResponse.json(rest))
    }
    if (path[0] === 'menu' && path[1] && method === 'PUT') {
      if (!checkAuth(request)) return unauthorized()
      const body = await request.json()
      delete body._id
      await db.collection('menu').updateOne({ id: path[1] }, { $set: body })
      return handleCORS(NextResponse.json({ success: true }))
    }
    if (path[0] === 'menu' && path[1] && method === 'DELETE') {
      if (!checkAuth(request)) return unauthorized()
      await db.collection('menu').deleteOne({ id: path[1] })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // ---- Gallery ----
    if (route === '/gallery' && method === 'GET') {
      const items = await db.collection('gallery').find({}).sort({ order: 1 }).toArray()
      return handleCORS(NextResponse.json(items.map(({ _id, ...r }) => r)))
    }
    if (route === '/gallery' && method === 'POST') {
      if (!checkAuth(request)) return unauthorized()
      const body = await request.json()
      const count = await db.collection('gallery').countDocuments()
      const item = { id: uuidv4(), url: body.url || '', order: count }
      await db.collection('gallery').insertOne(item)
      const { _id, ...rest } = item
      return handleCORS(NextResponse.json(rest))
    }
    if (path[0] === 'gallery' && path[1] && method === 'DELETE') {
      if (!checkAuth(request)) return unauthorized()
      await db.collection('gallery').deleteOne({ id: path[1] })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // ---- Reviews ----
    if (route === '/reviews' && method === 'GET') {
      const items = await db.collection('reviews').find({}).toArray()
      return handleCORS(NextResponse.json(items.map(({ _id, ...r }) => r)))
    }
    if (route === '/reviews' && method === 'POST') {
      if (!checkAuth(request)) return unauthorized()
      const body = await request.json()
      const item = { id: uuidv4(), name: body.name || '', rating: body.rating || 5, text: body.text || '' }
      await db.collection('reviews').insertOne(item)
      const { _id, ...rest } = item
      return handleCORS(NextResponse.json(rest))
    }
    if (path[0] === 'reviews' && path[1] && method === 'PUT') {
      if (!checkAuth(request)) return unauthorized()
      const body = await request.json()
      delete body._id
      await db.collection('reviews').updateOne({ id: path[1] }, { $set: body })
      return handleCORS(NextResponse.json({ success: true }))
    }
    if (path[0] === 'reviews' && path[1] && method === 'DELETE') {
      if (!checkAuth(request)) return unauthorized()
      await db.collection('reviews').deleteOne({ id: path[1] })
      return handleCORS(NextResponse.json({ success: true }))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
