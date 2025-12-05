import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User, Document } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth"; // Use central auth helper
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// GET: Fetch documents for a specific client (ONLY CLIENT-SPECIFIC DOCUMENTS)
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id: clientId } = await params;

    console.log("📄 Fetching CLIENT-SPECIFIC documents for client:", clientId);

    // Validate client exists
    const client = await User.findById(clientId);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Fetch ONLY client-specific documents (NOT company documents)
    const documents = await Document.find({
      $or: [
        { targetClient: clientId },
        { specificClients: clientId }
      ],
      isCompanyDocument: false // ONLY non-company documents
    })
      .populate("uploadedBy", "name email role")
      .sort({ uploadDate: -1 })
      .lean();

    console.log(`✅ Client ${clientId} fetched ${documents.length} CLIENT-SPECIFIC documents`);

    // Format response
    const formattedDocuments = documents.map((doc) => ({
      id: doc._id,
      name: doc.name,
      description: doc.description,
      type: doc.type,
      fileUrl: doc.fileUrl,
      originalName: doc.originalName || doc.fileName,
      size: doc.size,
      mimeType: doc.mimeType,
      uploaded: doc.uploadDate,
      uploadedBy: doc.uploadedBy
        ? {
            id: doc.uploadedBy._id,
            name: doc.uploadedBy.name,
            email: doc.uploadedBy.email,
            role: doc.uploadedBy.role?.name || "User",
          }
        : null,
      status: doc.status,
      isCompanyDocument: doc.isCompanyDocument,
      category: doc.category,
      tags: doc.tags || [],
      documentStartDate: doc.documentStartDate,
      documentEndDate: doc.documentEndDate,
      documentPeriod: doc.documentPeriod || "",
    }));

    return NextResponse.json({
      success: true,
      documents: formattedDocuments,
      count: formattedDocuments.length,
    });
  } catch (error) {
    console.error("❌ Error fetching client documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Upload document for a specific client (FROM CLIENT DETAILS PAGE)
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id: clientId } = await params;
    const data = await request.json();

    console.log("📤 Uploading document for client from client details page:", clientId);

    // Get current user from central auth helper
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    // Validate client
    const client = await User.findById(clientId);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Validate required fields
    if (!data.fileId || !data.fileName || !data.fileUrl) {
      return NextResponse.json(
        { error: "File details are required" },
        { status: 400 }
      );
    }

    // Validate document type is client type (not company type)
    const companyDocumentTypes = ["msme", "gst", "pasara", "pan", "profile", "bank-details"];
    if (companyDocumentTypes.includes(data.type)) {
      return NextResponse.json(
        { error: "Company documents cannot be uploaded from client details page" },
        { status: 400 }
      );
    }

    // Create document record - ALWAYS set as client document
    const document = new Document({
      name: data.name || data.originalName,
      description: data.description,
      type: data.type,
      fileId: data.fileId,
      fileName: data.fileName,
      originalName: data.originalName,
      fileUrl: data.fileUrl,
      size: data.size,
      mimeType: data.mimeType,
      uploadedBy: currentUser._id,
      targetClient: clientId, // ALWAYS set target client
      category: "client",
      isCompanyDocument: false, // ALWAYS false for client uploads
      status: "approved",
      tags: data.tags || [],
      documentStartDate: data.documentStartDate || null,
      documentEndDate: data.documentEndDate || null,
      documentPeriod: data.documentPeriod || "",
    });

    await document.save();

    // ✅ CRITICAL FIX: Add document ID to client's documents array
    try {
      await User.findByIdAndUpdate(clientId, {
        $addToSet: { documents: document._id }
      });
      console.log("✅ Added document to client's documents array");
    } catch (clientUpdateError) {
      console.error("⚠️ Failed to update client documents array:", clientUpdateError);
      // Don't fail the entire upload if this fails
    }

    // Populate uploadedBy for response
    await document.populate("uploadedBy", "name email role");

    console.log(
      "✅ Document uploaded from client details page by:",
      currentUser.name,
      "for client:",
      clientId
    );

    return NextResponse.json({
      success: true,
      document: {
        id: document._id,
        name: document.name,
        description: document.description,
        type: document.type,
        fileUrl: document.fileUrl,
        originalName: document.originalName || document.fileName,
        size: document.size,
        uploaded: document.uploadDate,
        uploadedBy: {
          id: document.uploadedBy._id,
          name: document.uploadedBy.name,
          email: document.uploadedBy.email,
          role: document.uploadedBy.role?.name || "User",
        },
        status: document.status,
        isCompanyDocument: document.isCompanyDocument,
        category: document.category,
        tags: document.tags || [],
      },
      message: "Document uploaded successfully",
    });
  } catch (error) {
    console.error("❌ Error uploading document:", error);
    return NextResponse.json(
      { error: "Failed to upload document", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific document for a client (WITH FILE SYSTEM CLEANUP)
export async function DELETE(request, { params }) {
  try {
    console.log("🗑️ DELETE request received");
    
    await connectDB();
    
    // Get documentId from URL search params
    const url = new URL(request.url);
    const documentId = url.searchParams.get("documentId");
    
    console.log("Document ID from params:", documentId);
    
    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    const { id: clientId } = await params;

    console.log("🗑️ Deleting document:", documentId, "for client:", clientId);

    // Get current user from central auth helper
    const currentUser = await getCurrentUser(request);
    console.log("Current user from getCurrentUser:", currentUser ? currentUser.email : "No user");
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    // Check if user has 'documents-delete' permission
    const userPermissions = currentUser.role?.permissions || [];
    const canDeleteDocuments = userPermissions.includes('documents-delete');
    
    console.log("User permissions:", userPermissions);
    console.log("Can delete documents:", canDeleteDocuments);
    
    if (!canDeleteDocuments) {
      console.log("User lacks 'documents-delete' permission");
      return NextResponse.json(
        { error: "You don't have permission to delete documents" },
        { status: 403 }
      );
    }

    // Find the document
    const document = await Document.findOne({
      _id: documentId,
      $or: [
        { targetClient: clientId },
        { specificClients: clientId }
      ]
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found or does not belong to this client" },
        { status: 404 }
      );
    }

    // ✅ Remove document from client's array BEFORE deleting
    try {
      await User.findByIdAndUpdate(clientId, {
        $pull: { documents: documentId }
      });
      console.log("✅ Removed document from client's documents array");
    } catch (clientUpdateError) {
      console.error("⚠️ Failed to remove document from client array:", clientUpdateError);
      // Continue with deletion anyway
    }

    // Delete the physical file from uploads directory
    const fileDeleted = await deletePhysicalFile(document.fileUrl, document.fileName);
    
    if (!fileDeleted) {
      console.warn("⚠️ Physical file not found, but deleting database record anyway");
    }

    // Delete document from database
    await Document.findByIdAndDelete(documentId);

    console.log(
      "✅ Document deleted by:",
      currentUser.name,
      "for client:",
      clientId
    );

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
      fileDeleted: fileDeleted
    });
  } catch (error) {
    console.error("❌ Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to delete physical file
async function deletePhysicalFile(fileUrl, fileName) {
  try {
    // Development vs Production paths (same as upload route)
    const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
    const UPLOAD_BASE_PATH = IS_DEVELOPMENT 
      ? path.join(process.cwd(), "public", "uploads")
      : "/var/www/acme/uploads";
    
    // Extract filename from fileUrl or use fileName
    let actualFileName;
    
    if (fileUrl) {
      // Extract filename from URL (handles both /uploads/filename and full URL)
      const urlParts = fileUrl.split('/');
      actualFileName = urlParts[urlParts.length - 1];
    } else if (fileName) {
      actualFileName = fileName;
    } else {
      console.warn("No filename available for deletion");
      return false;
    }
    
    const filePath = path.join(UPLOAD_BASE_PATH, actualFileName);
    
    // Check if file exists
    if (!existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return false;
    }
    
    // Delete the file
    await fs.unlink(filePath);
    console.log(`✅ Physical file deleted: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error("❌ Error deleting physical file:", error);
    
    // Don't throw error, just return false
    // We'll still delete the database record
    return false;
  }
}