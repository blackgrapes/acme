// File: src/app/api/auth/users/route.js
import { NextResponse } from "next/server";
import { connectDB, User } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({}).populate("role");

    return NextResponse.json(users);
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
