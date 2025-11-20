import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { WeProvide } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const service = await WeProvide.findById(params.id);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const denied = requirePermission(request, "weprovide-update");
    if (denied) return denied;

    await connectDB();
    const data = await request.json();

    const service = await WeProvide.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const denied = requirePermission(request, "weprovide-delete");
    if (denied) return denied;

    await connectDB();
    const service = await WeProvide.findByIdAndDelete(params.id);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
