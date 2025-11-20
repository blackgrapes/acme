//C:\ForD\BlackGrapes\acme-security\src\app\api\frontend\clients\[id]\route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Client } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const client = await Client.findById(params.id);

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const denied = requirePermission(request, "clients-update");
    if (denied) return denied;

    await connectDB();
    const data = await request.json();

    const client = await Client.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const denied = requirePermission(request, "clients-delete");
    if (denied) return denied;

    await connectDB();
    const client = await Client.findByIdAndDelete(params.id);

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
