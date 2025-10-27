// Updated File: src/app/api/auth/client/[id]/documents/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User, Role } from "@/lib/db";

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const documentData = await request.json();

    console.log("📥 Received document data for client:", id);

    const client = await User.findById(id).populate("role");
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // ✅ Check if user is actually a Client
    if (client.role.name !== "Client") {
      return NextResponse.json(
        { error: "User is not a client" },
        { status: 400 }
      );
    }

    // Initialize documents array if it doesn't exist
    if (!client.documents) {
      client.documents = [];
    }

    // Add new document
    const newDocument = {
      name: documentData.name,
      type: documentData.type,
      category: documentData.category || "General",
      description: documentData.description || "",
      fileUrl: documentData.fileUrl,
      uploaded: new Date(),
      size: documentData.size || "0 MB",
      uploadedBy: documentData.uploadedBy || "Admin",
    };

    client.documents.push(newDocument);
    await client.save();

    console.log("✅ Document saved successfully for client:", client.name);

    return NextResponse.json({
      success: true,
      document: newDocument,
      message: "Document uploaded successfully",
    });
  } catch (error) {
    console.error("❌ Error adding document:", error);
    return NextResponse.json(
      { error: "Failed to add document: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const client = await User.findById(id).populate("role");
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // ✅ Return empty array if user is not a client
    if (client.role.name !== "Client") {
      return NextResponse.json({
        documents: [],
      });
    }

    // Return documents (will be empty array if field doesn't exist)
    return NextResponse.json({
      documents: client.documents || [],
    });
  } catch (error) {
    console.error("❌ Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents: " + error.message },
      { status: 500 }
    );
  }
}

// New: DELETE handler for specific doc
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { docId } = await request.json(); // docId from user's documents array

    const client = await User.findById(id);
    if (!client || client.role.name !== "Client") {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    client.documents = client.documents.filter(
      (doc) => doc._id.toString() !== docId
    );
    await client.save();

    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
