// File: src/app/api/documents/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Document from "@/lib/models/Document";
import { requirePermission } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const denied = requirePermission(request, "documents-delete");
    if (denied) return denied;
    await connectDB();
    const { id } = params;

    console.log("🗑️ Deleting document:", id);

    const deletedDocument = await Document.findByIdAndDelete(id);

    if (!deletedDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    console.log("✅ Document deleted successfully:", id);

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document: " + error.message },
      { status: 500 }
    );
  }
}
