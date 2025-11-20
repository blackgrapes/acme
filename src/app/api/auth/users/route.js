// File: src/app/api/auth/users/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET(request) {
  try {
    // require permission to list users
    const denied = requirePermission(request, "roles-read");
    if (denied) return denied;
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
