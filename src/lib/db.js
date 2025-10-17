// src/lib/db.js - FIXED VERSION
import dotenv from "dotenv";
import path from "path";

// ✅ Load from .env.local in project root
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

console.log("🔧 db.js - MONGODB_URI:", MONGODB_URI ? "✅ Found" : "❌ Missing");

if (!MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "acme-security",
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        throw error;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Export models for use in APIs
export { default as User } from "./models/User.js";
export { default as Role } from "./models/Role.js";
