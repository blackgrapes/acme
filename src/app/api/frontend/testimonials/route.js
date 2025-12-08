//C:\ForD\BlackGrapes\acme-security\src\app\api\frontend\testimonials\route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Testimonial } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return NextResponse.json(testimonials);
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

    const testimonial = await Testimonial.create(data);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

