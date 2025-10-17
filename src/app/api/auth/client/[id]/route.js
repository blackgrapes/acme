// Updated File: src/app/api/auth/client/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB, User } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const client = await User.findById(id).populate("role").select("-password");

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}
