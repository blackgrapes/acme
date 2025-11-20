// src/app/api/auth/guard/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Guard } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET(request) {
  try {
    const denied = requirePermission(request, "guards-read");
    if (denied) return denied;
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const type = searchParams.get("type") || "";

    // Build filter object
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { guardId: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    if (type && type !== "all") {
      filter.type = type;
    }

    const guards = await Guard.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v");

    console.log("✅ Fetched guards:", guards.length);

    return NextResponse.json({
      guards,
    });
  } catch (error) {
    console.error("💥 Get guards error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
