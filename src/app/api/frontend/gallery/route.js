//src\app\api\frontend\gallery\route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Gallery } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    return NextResponse.json(galleryItems);
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

    const galleryItem = await Gallery.create(data);
    return NextResponse.json(galleryItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
