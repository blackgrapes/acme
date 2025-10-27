// Updated File: src/app/api/auth/client/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    const clients = await User.find({})
      .populate("role")
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
