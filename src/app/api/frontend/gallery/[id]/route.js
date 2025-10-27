//src\app\api\frontend\gallery\[id]\route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Gallery } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const galleryItem = await Gallery.findById(params.id);

    if (!galleryItem) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(galleryItem);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const data = await request.json();

    const galleryItem = await Gallery.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!galleryItem) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(galleryItem);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const galleryItem = await Gallery.findByIdAndDelete(params.id);

    if (!galleryItem) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
