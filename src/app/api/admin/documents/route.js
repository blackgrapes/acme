//api/admin/documents/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Document, User } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

// GET: Fetch all documents for admin with filtering
export async function GET(request) {
  try {
    const denied = requirePermission(request, "documents-read");
    if (denied) return denied;
    
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const clientId = searchParams.get("clientId");
    const isCompany = searchParams.get("isCompany");
    const type = searchParams.get("type");
    
    console.log("📋 Fetching documents with filters:", {
      category,
      clientId,
      isCompany,
      type
    });

    // Build query
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (isCompany === "true") {
      query.isCompanyDocument = true;
    } else if (isCompany === "false") {
      query.isCompanyDocument = false;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (clientId && clientId !== "all") {
      query.$or = [
        { targetClient: clientId },
        { specificClients: clientId }
      ];
    }

    // Fetch documents
    const documents = await Document.find(query)
      .populate("uploadedBy", "name email")
      .populate("targetClient", "name email companyName")
      .populate("specificClients", "name email companyName")
      .sort({ uploadDate: -1 })
      .lean();

    // Format response
    const formattedDocuments = documents.map(doc => ({
      id: doc._id,
      name: doc.name,
      description: doc.description,
      type: doc.type,
      fileUrl: doc.fileUrl,
      originalName: doc.originalName || doc.fileName,
      size: doc.size,
      mimeType: doc.mimeType,
      uploadDate: doc.uploadDate,
      uploadedBy: doc.uploadedBy,
      targetClient: doc.targetClient,
      specificClients: doc.specificClients || [],
      isCompanyDocument: doc.isCompanyDocument,
      category: doc.category,
      status: doc.status,
      tags: doc.tags || []
    }));

    return NextResponse.json({
      success: true,
      documents: formattedDocuments,
      count: formattedDocuments.length
    });

  } catch (error) {
    console.error("❌ Error fetching admin documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Upload document from Document Management
export async function POST(request) {
  try {
    const denied = requirePermission(request, "documents-create");
    if (denied) return denied;
    
    await connectDB();
    const data = await request.json();

    console.log("📤 Uploading document from admin:", data);

    // Validate required fields
    if (!data.fileId || !data.fileName || !data.fileUrl) {
      return NextResponse.json(
        { error: "File details are required" },
        { status: 400 }
      );
    }

    // Create document record based on category
    const documentData = {
      name: data.name,
      description: data.description,
      type: data.type,
      fileId: data.fileId,
      fileName: data.fileName,
      originalName: data.originalName,
      fileUrl: data.fileUrl,
      size: data.size,
      mimeType: data.mimeType,
      uploadedBy: data.uploadedBy,
      status: "approved",
      tags: data.tags || []
    };

    // Set category-specific fields
    if (data.category === "company") {
      documentData.category = "company";
      documentData.isCompanyDocument = true;
      documentData.targetClient = null;
      documentData.specificClients = [];
    } 
    else if (data.category === "general") {
      documentData.category = "general";
      documentData.isCompanyDocument = false;
      documentData.targetClient = null;
      documentData.specificClients = [];
    }
    else if (data.category === "client") {
      documentData.category = "client";
      documentData.isCompanyDocument = false;
      
      if (data.specificClients && data.specificClients.length > 0) {
        // Multiple clients selected
        documentData.specificClients = data.specificClients;
        documentData.targetClient = null;
      } else if (data.targetClient) {
        // Single client
        documentData.targetClient = data.targetClient;
        documentData.specificClients = [];
      }
    }

    const document = new Document(documentData);
    await document.save();

    console.log("✅ Document uploaded from admin:", document._id);

    return NextResponse.json({
      success: true,
      document: document,
      message: "Document uploaded successfully"
    });

  } catch (error) {
    console.error("❌ Error uploading admin document:", error);
    return NextResponse.json(
      { error: "Failed to upload document", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a file
export async function DELETE(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const fileName = url.searchParams.get("fileName");
    
    if (!fileName) {
      return NextResponse.json(
        { error: "File name is required" },
        { status: 400 }
      );
    }

    await ensureUploadDir();
    
    const filePath = path.join(UPLOAD_BASE_PATH, fileName);
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Delete the file
    await fs.unlink(filePath);

    console.log("✅ File deleted:", filePath);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully"
    });

  } catch (error) {
    console.error("❌ File deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete file", details: error.message },
      { status: 500 }
    );
  }
}