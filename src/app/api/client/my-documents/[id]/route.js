// acme/src/app/api/client/documents/categories/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Document from "@/lib/models/Document";
import { getCurrentUser, hasRole } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id: documentId } = params;
    
    // Get current user from request
    const user = await getCurrentUser(request);
    if (!user || !hasRole(user, "Client")) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }
    
    const clientId = user._id;
    
    // Find document that belongs to this client
    const document = await Document.findOne({
      _id: documentId,
      $or: [
        { isCompanyDocument: true },
        { targetClient: clientId },
        { specificClients: clientId }
      ]
    })
    .populate("uploadedBy", "name email")
    .populate("targetClient", "name email companyName")
    .populate("specificClients", "name email companyName");
    
    if (!document) {
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 }
      );
    }
    
    // Transform document for client view
    const transformedDoc = {
      _id: document._id,
      name: document.name,
      description: document.description || "",
      type: document.type,
      fileUrl: document.fileUrl,
      fileName: document.fileName,
      originalName: document.originalName,
      size: document.size,
      mimeType: document.mimeType,
      uploaded: document.uploadDate,
      uploadedBy: document.uploadedBy ? {
        name: document.uploadedBy.name,
        email: document.uploadedBy.email
      } : null,
      accessLevel: document.isCompanyDocument ? "general" : 
                  document.targetClient && document.targetClient._id.toString() === clientId.toString() ? "specific" : 
                  document.specificClients && document.specificClients.some(c => c._id.toString() === clientId.toString()) ? "specific" : 
                  "general",
      status: document.status,
      isCompanyDocument: document.isCompanyDocument,
      documentStartDate: document.documentStartDate,
      documentEndDate: document.documentEndDate,
      documentPeriod: document.documentPeriod,
      category: document.category
    };
    
    return NextResponse.json({ 
      success: true,
      document: transformedDoc
    });
    
  } catch (error) {
    console.error("❌ Error fetching client document:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch document",
        details: error.message 
      },
      { status: 500 }
    );
  }
}