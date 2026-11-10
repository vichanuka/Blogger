import mongoose from "mongoose";

/**
 * Global cache across hot reloads in development
 * and serverless function invocations in production.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const ConnectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env or .env.local"
    );
  }

  // 1. If an active connection exists, reuse it
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection dropped, clear stale reference
  if (cached.conn && mongoose.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  // 2. If no connection promise is in progress, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("DB connected");
        return mongooseInstance;
      });
  }

  // 3. Await the pending promise and cache the resolved connection
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("DB connection failed:", error.message);
    throw error;
  }

  return cached.conn;
};
export default ConnectDB;