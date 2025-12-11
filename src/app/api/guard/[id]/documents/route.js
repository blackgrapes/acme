// File: src/app/api/guard/[id]/documents/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Guard, User, Document } from "@/lib/db";
import { getCurrentUser, requirePermission } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id: guardId } = params;

    // Check permission
    const denied = requirePermission(request, "documents-create");
    if (denied) return denied;

    const data = await request.json();

    // Validate guard exists
    const guard = await Guard.findById(guardId);
    if (!guard) {
      return NextResponse.json({ error: "Guard not found" }, { status: 404 });
    }

    // Create document data
    const documentData = {
      name: data.name,
      description: data.description || `Employee document for ${guard.name}`,
      type: "employee-details",
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      originalName: data.originalName,
      size: data.size,
      mimeType: data.mimeType,
      uploaded: new Date(),
      category: "guard",
    };

    // Add to guard's documents
    guard.documents = guard.documents || [];
    guard.documents.push(documentData);
    await guard.save();

    // If guard is assigned to a client, create document in Document collection
    if (guard.currentAssignment && guard.currentAssignment.clientId) {
      const clientDocData = {
        ...documentData,
        name: `${guard.name} - ${data.name}`,
        description: `Employee document for ${guard.name} (Guard: ${guard.guardId})`,
        targetClient: guard.currentAssignment.clientId,
        isCompanyDocument: false,
        category: "client",
        type: "employee-details",
        uploadedBy: data.uploadedBy || null,
      };

      const clientDocument = new Document(clientDocData);
      await clientDocument.save();

      // Add document to client's documents array
      await User.findByIdAndUpdate(guard.currentAssignment.clientId, {
        $addToSet: { documents: clientDocument._id },
      });
    }

    return NextResponse.json({
      success: true,
      guard: guard,
      message: "Document uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading guard document:", error);
    return NextResponse.json(
      { error: "Failed to upload document", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id: guardId } = params;

    // Check permission
    const denied = requirePermission(request, "documents-delete");
    if (denied) return denied;

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    const guard = await Guard.findById(guardId);
    if (!guard) {
      return NextResponse.json({ error: "Guard not found" }, { status: 404 });
    }

    // Remove document from guard
    guard.documents = guard.documents.filter(
      (doc) => doc.fileId !== documentId && doc._id?.toString() !== documentId
    );
    await guard.save();

    // Also delete from Document collection if exists
    await Document.deleteOne({
      $or: [{ fileId: documentId }, { _id: documentId }],
    });

    return NextResponse.json({
      success: true,
      guard: guard,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting guard document:", error);
    return NextResponse.json(
      { error: "Failed to delete document", details: error.message },
      { status: 500 }
    );
  }
}
