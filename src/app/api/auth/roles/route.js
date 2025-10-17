// File: src/app/api/auth/roles/route.js
import { NextResponse } from "next/server";
import { connectDB, Role } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    const roles = await Role.find({}).populate("users");

    return NextResponse.json(roles);
  } catch (error) {
    console.error("Roles fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}
