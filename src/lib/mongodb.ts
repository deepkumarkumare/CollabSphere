import mongoose from 'mongoose';

// Define a type for the cached connection
interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// Extend the global type to include our mongoose property
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Initialize the cache with type checking
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Ensure the global object has our typed property
if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;