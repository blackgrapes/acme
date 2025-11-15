// File: src/app/api/admin/requests/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Request from "@/lib/models/Request";

// ✅ Get all requests (for admin)
export async function GET() {
  try {
    await connectDB();
    const requests = await Request.find().sort({ createdAt: -1 });
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ Create new request (for client)
export async function POST(req) {
  try {
    const body = await req.json();
    const { clientName, clientEmail, documentName, documentType, description } =
      body;

    if (!clientName || !clientEmail || !documentName || !documentType) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const newRequest = new Request({
      clientName,
      clientEmail,
      documentName,
      documentType,
      description,
    });

    await newRequest.save();

    return NextResponse.json({
      message: "Request created successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update request status
export async function PUT(req) {
  try {
    const { requestId, status } = await req.json();
    if (!requestId || !status)
      return NextResponse.json(
        { error: "Request ID and status are required" },
        { status: 400 }
      );

    await connectDB();
    const updated = await Request.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    return NextResponse.json({ message: "Updated", request: updated });
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete a request
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await connectDB();
    await Request.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
