// File: src/app/api/auth/roles/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Role } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET(request) {
  try {
    const denied = requirePermission(request, "roles-read");
    if (denied) return denied;
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
