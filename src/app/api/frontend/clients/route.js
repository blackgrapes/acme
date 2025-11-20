//C:\ForD\BlackGrapes\acme-security\src\app\api\frontend\clients\route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Client } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const clients = await Client.find().sort({ createdAt: -1 });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const denied = requirePermission(request, "clients-create");
    if (denied) return denied;

    await connectDB();
    const data = await request.json();

    const client = await Client.create(data);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
