// src/app/api/auth/profile/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/db";
import { verifyToken } from "@/lib/utils";

export async function GET(request) {
  try {
    await connectDB();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId)
      .populate("role")
      .select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
