// src/app/api/auth/guard/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Guard } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    console.log("🔧 Fetching guard details for ID:", id);

    let guard;

    // Check if ID is MongoDB ObjectId or guardId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      guard = await Guard.findById(id);
    } else {
      guard = await Guard.findOne({ guardId: id });
    }

    if (!guard) {
      console.log("❌ Guard not found:", id);
      return NextResponse.json({ error: "Guard not found" }, { status: 404 });
    }

    console.log("✅ Guard found:", guard.name);
    return NextResponse.json({ guard });
  } catch (error) {
    console.error("💥 Get guard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const updateData = await request.json();

    console.log("🔧 Updating guard:", id);

    let guard;

    // Check if ID is MongoDB ObjectId or guardId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      guard = await Guard.findByIdAndUpdate(
        id,
        { ...updateData, lastActive: new Date() },
        { new: true, runValidators: true }
      );
    } else {
      guard = await Guard.findOneAndUpdate(
        { guardId: id },
        { ...updateData, lastActive: new Date() },
        { new: true, runValidators: true }
      );
    }

    if (!guard) {
      console.log("❌ Guard not found for update:", id);
      return NextResponse.json({ error: "Guard not found" }, { status: 404 });
    }

    console.log("✅ Guard updated successfully:", guard.name);
    return NextResponse.json({
      guard,
      message: "Guard updated successfully!",
    });
  } catch (error) {
    console.error("💥 Update guard error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          error: `Validation error: ${Object.values(error.errors)
            .map((e) => e.message)
            .join(", ")}`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    console.log("🔧 Deleting guard:", id);

    let guard;

    // Check if ID is MongoDB ObjectId or guardId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      guard = await Guard.findByIdAndDelete(id);
    } else {
      guard = await Guard.findOneAndDelete({ guardId: id });
    }

    if (!guard) {
      console.log("❌ Guard not found for deletion:", id);
      return NextResponse.json({ error: "Guard not found" }, { status: 404 });
    }

    console.log("✅ Guard deleted successfully:", guard.name);
    return NextResponse.json({
      message: "Guard deleted successfully!",
    });
  } catch (error) {
    console.error("💥 Delete guard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
