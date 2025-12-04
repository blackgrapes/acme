import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Document from "@/lib/models/Document";
import { User } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";
    const clientId = searchParams.get("clientId");
    const category = searchParams.get("category");
    const isCompanyDocument = searchParams.get("isCompanyDocument") === "true";

    console.log(
      "📥 Fetching documents. Admin:",
      admin,
      "ClientId:",
      clientId,
      "isCompanyDocument:",
      isCompanyDocument,
      "Category:",
      category
    );

    // If requesting company documents
    if (isCompanyDocument) {
      const query = { isCompanyDocument: true };
      if (category && category !== "all") {
        query.type = category;
      }
      
      const documents = await Document.find(query)
        .populate("uploadedBy", "name email")
        .sort({ uploadDate: -1 });

      console.log(`✅ Fetched ${documents.length} company documents`);
      return NextResponse.json({ documents, success: true });
    }

    // If admin requesting all documents
    if (admin) {
      const denied = requirePermission(request, "documents-read");
      if (denied) return denied;
      
      let query = { isCompanyDocument: false }; // Only client docs for admin
      
      if (category && category !== "all") {
        query.type = category;
      }

      const documents = await Document.find(query)
        .populate("uploadedBy", "name email")
        .populate("targetClient", "name email companyName")
        .populate("specificClients", "name email companyName")
        .sort({ uploadDate: -1 });

      console.log(`✅ Admin fetched ${documents.length} client documents`);
      return NextResponse.json({ documents, success: true });
    }

    // Client: Validate clientId
    if (
      !clientId ||
      clientId === "undefined" ||
      clientId === "null" ||
      !/^[0-9a-fA-F]{24}$/.test(clientId)
    ) {
      console.error("❌ Invalid clientId:", clientId);
      return NextResponse.json(
        { error: "Valid Client ID required" },
        { status: 400 }
      );
    }

    // Find client
    const client = await User.findById(clientId);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Build query: Get documents for this client AND company documents
    const query = {
      $or: [
        // Company documents (visible to all clients)
        { isCompanyDocument: true },
        // Documents specifically assigned to this client
        { targetClient: clientId },
        // Documents with multiple clients including this one
        { specificClients: clientId }
      ]
    };

    // Optional: Filter by category
    if (category && category !== "all") {
      query.type = category;
    }

    const documents = await Document.find(query)
      .populate("uploadedBy", "name email")
      .populate("targetClient", "name email companyName")
      .populate("specificClients", "name email companyName")
      .sort({ uploadDate: -1 });

    console.log(`✅ Client ${clientId} fetched ${documents.length} documents`);
    return NextResponse.json({ documents, success: true });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents: " + error.message },
      { status: 500 }
    );
  }
}

// ✅ ADD POST METHOD FOR DOCUMENT CREATION
export async function POST(request) {
  try {
    // Check permission for document creation
    const denied = requirePermission(request, "documents-create");
    if (denied) return denied;

    await connectDB();

    const body = await request.json();
    console.log("📝 Received document data:", JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.name || !body.type || !body.fileUrl) {
      return NextResponse.json(
        { error: "Name, type, and file URL are required" },
        { status: 400 }
      );
    }

    // Get user from token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    let uploadedBy = null;
    
    if (token) {
      try {
        // ✅ FIX: Use dynamic import for ES modules
        const { verify } = await import('jsonwebtoken');
        const decoded = verify(token, process.env.JWT_SECRET);
        uploadedBy = decoded.userId;
        console.log("✅ Token decoded, uploadedBy:", uploadedBy);
      } catch (err) {
        console.log("❌ Token decode error:", err.message);
        // Continue without uploadedBy if token decode fails
      }
    }

    // ✅ Validate that specificClients are valid ObjectIds
    let validSpecificClients = [];
    if (body.specificClients && Array.isArray(body.specificClients)) {
      // Filter out invalid IDs and empty values
      validSpecificClients = body.specificClients.filter(clientId => {
        return clientId && /^[0-9a-fA-F]{24}$/.test(clientId);
      });
      console.log("✅ Valid specific clients:", validSpecificClients);
    }

    // ✅ Validate targetClient
    let validTargetClient = null;
    if (body.targetClient && /^[0-9a-fA-F]{24}$/.test(body.targetClient)) {
      validTargetClient = body.targetClient;
      console.log("✅ Valid target client:", validTargetClient);
    }

    // ✅ Check if document already exists with same fileId
    if (body.fileId) {
      const existingDoc = await Document.findOne({ fileId: body.fileId });
      if (existingDoc) {
        console.log("⚠️ Document with same fileId already exists:", body.fileId);
        return NextResponse.json({
          success: true,
          message: "Document already exists",
          document: existingDoc
        });
      }
    }

    // Create new document
    const newDocument = new Document({
      name: body.name,
      description: body.description || "",
      type: body.type,
      fileUrl: body.fileUrl,
      fileId: body.fileId || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fileName: body.fileName || body.name,
      originalName: body.originalName || body.name,
      size: body.size || 0,
      mimeType: body.mimeType || "application/pdf",
      documentStartDate: body.documentStartDate || null,
      documentEndDate: body.documentEndDate || null,
      documentPeriod: body.documentPeriod || "",
      isCompanyDocument: body.isCompanyDocument || false,
      category: body.category || (body.isCompanyDocument ? "company" : "client"),
      status: body.status || "pending",
      uploadedBy: uploadedBy,
      uploadDate: new Date(),
      targetClient: validTargetClient,
      specificClients: validSpecificClients,
    });

    await newDocument.save();
    console.log("✅ Document saved to database:", newDocument._id);

    // Populate the created document
    const populatedDoc = await Document.findById(newDocument._id)
      .populate("uploadedBy", "name email")
      .populate("targetClient", "name email companyName")
      .populate("specificClients", "name email companyName");

    console.log("✅ Document created successfully:", populatedDoc._id);

    return NextResponse.json({
      success: true,
      message: "Document created successfully",
      document: populatedDoc
    });

  } catch (error) {
    console.error("❌ Error creating document:", error);
    console.error("❌ Error stack:", error.stack);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: `Validation error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create document: " + error.message },
      { status: 500 }
    );
  }
}

// ✅ ADD OTHER METHODS (PUT, DELETE) IF NEEDED
export async function PUT(request) {
  try {
    const denied = requirePermission(request, "documents-update");
    if (denied) return denied;

    await connectDB();
    
    const body = await request.json();
    const { documentId, status, name, description } = body;

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const updatedDocument = await Document.findByIdAndUpdate(
      documentId,
      updateData,
      { new: true }
    )
      .populate("uploadedBy", "name email")
      .populate("targetClient", "name email companyName")
      .populate("specificClients", "name email companyName");

    if (!updatedDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Document updated successfully",
      document: updatedDocument
    });

  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document: " + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const denied = requirePermission(request, "documents-delete");
    if (denied) return denied;

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    const deletedDocument = await Document.findByIdAndDelete(documentId);

    if (!deletedDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document: " + error.message },
      { status: 500 }
    );
  }
}