
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}


type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {

  var mongooseCache: MongooseCache | undefined; 
}

const cache: MongooseCache = global.mongooseCache ??= {
  conn: null,
  promise: null,
};

export async function connectDB(): Promise<Mongoose> {
 
  if (cache.conn) return cache.conn;


  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
