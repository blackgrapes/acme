// C:\ForD\BlackGrapes\acme-security\src\app\api\frontend\testimonials\[id]\route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Testimonial } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const testimonial = await Testimonial.findById(params.id);

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const denied = await requirePermission(request, "frontend-update");
    if (denied) return denied;

    await connectDB();
    const data = await request.json();

    const testimonial = await Testimonial.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const denied = await requirePermission(request, "frontend-delete");
    if (denied) return denied;

    await connectDB();
    const testimonial = await Testimonial.findByIdAndDelete(params.id);

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}