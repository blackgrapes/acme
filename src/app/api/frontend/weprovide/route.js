import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { WeProvide } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const services = await WeProvide.find().sort({ order: 1 });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const denied = requirePermission(request, "frontend-create");
    if (denied) return denied;

    await connectDB();
    const data = await request.json();

    const service = await WeProvide.create(data);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
