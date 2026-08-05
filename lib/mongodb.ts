import mongoose from 'mongoose'

if (!process.env.DATABASE_URL) {
  throw new Error('Please add your MongoDB URI to .env file')
}

const MONGODB_URI: string = process.env.DATABASE_URL

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts) as any
  }

  try {
    cached.conn = await cached.promise
    console.log('✅ MongoDB connected successfully')
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
