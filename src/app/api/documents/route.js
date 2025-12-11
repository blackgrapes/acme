// FILE: src/app/api/documents/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Document from "@/lib/models/Document";
import { User } from "@/lib/db";
import Guard from "@/lib/models/Guard";
import { requirePermission, getCurrentUser } from "@/lib/auth";

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

    if (admin) {
      // Allow access if user is Admin OR has permission
      const user = await getCurrentUser(request);
      const isAdminRole = user?.role?.name === "admin";

      if (!isAdminRole) {
        const denied = requirePermission(request, "documents-read");
        if (denied) return denied;
      }

      let query = { isCompanyDocument: false }; // Only client docs for admin

      if (category && category !== "all") {
        query.type = category;
      }

      const documents = await Document.find(query)
        .populate("uploadedBy", "name email")
        .populate("targetClient", "name email companyName")
        .populate("specificClients", "name email companyName")
        .populate("relatedGuard", "name guardId currentAssignment") // ✅ Populate guard with assignment
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
        { isCompanyDocument: true },
        { targetClient: clientId },
        { specificClients: clientId }
      ]
    };

    // ✅ Dynamic Guard Visibility: Include documents for guards assigned to this client

    // ✅ Dynamic Guard Visibility: Include documents for guards assigned to this client
    try {
      const assignedGuards = await Guard.find({
        "currentAssignment.clientId": clientId,
        status: { $in: ["Assigned", "Active"] } // Check both statuses just in case
      }).select("_id");

      if (assignedGuards.length > 0) {
        const guardIds = assignedGuards.map(g => g._id);

        // Add to query using $or
        // We need to keep the existing $or conditions and add this new one
        if (query.$or) {
          query.$or.push({ relatedGuard: { $in: guardIds } });
        } else {
          // Should not happen given previous code, but for safety
          query.$or = [{ relatedGuard: { $in: guardIds } }];
        }

        console.log(`✅ Including documents for ${guardIds.length} assigned guards`);
      }
    } catch (err) {
      console.error("Error finding assigned guards:", err);
    }

    // Optional: Filter by category
    if (category && category !== "all") {
      query.type = category;
    }

    const documents = await Document.find(query)
      .populate("uploadedBy", "name email role")
      .populate("targetClient", "name email companyName")
      .populate("specificClients", "name email companyName")
      .populate("relatedGuard", "name guardId currentAssignment") // ✅ Populate guard with currentAssignment
      .sort({ uploadDate: -1 })
      .lean();
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
    // Allow if user is Admin OR has permission
    const user = await getCurrentUser(request);
    const isAdminRole = user?.role?.name === "admin";

    if (!isAdminRole) {
      const denied = requirePermission(request, "documents-create");
      if (denied) return denied;
    }

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

    // Use user from earlier getCurrentUser call
    const uploadedBy = user?._id;
    console.log("✅ Uploaded by:", uploadedBy);

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
      targetClient: validTargetClient,
      specificClients: validSpecificClients,
      relatedGuard: body.relatedGuard || null, // ✅ Save related guard if provided
    });

    await newDocument.save();
    console.log("✅ Document saved to database:", newDocument._id);

    // ✅ CRITICAL FIX: Update client documents arrays
    try {
      // If targetClient is set (single client)
      if (newDocument.targetClient) {
        await User.findByIdAndUpdate(newDocument.targetClient, {
          $addToSet: { documents: newDocument._id }
        });
        console.log(`✅ Added document to target client: ${newDocument.targetClient}`);
      }

      // If specificClients are set (multiple clients)
      if (newDocument.specificClients && newDocument.specificClients.length > 0) {
        await User.updateMany(
          { _id: { $in: newDocument.specificClients } },
          { $addToSet: { documents: newDocument._id } }
        );
        console.log(`✅ Added document to ${newDocument.specificClients.length} specific clients`);
      }
    } catch (clientUpdateError) {
      console.error("⚠️ Failed to update client documents arrays:", clientUpdateError);
      // Don't fail the entire operation
    }

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

    // ✅ Find the document first to get client references
    const document = await Document.findById(documentId);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // ✅ Remove document from client arrays before deleting
    try {
      // Remove from targetClient
      if (document.targetClient) {
        await User.findByIdAndUpdate(document.targetClient, {
          $pull: { documents: documentId }
        });
        console.log(`✅ Removed document from target client: ${document.targetClient}`);
      }

      // Remove from specificClients
      if (document.specificClients && document.specificClients.length > 0) {
        await User.updateMany(
          { _id: { $in: document.specificClients } },
          { $pull: { documents: documentId } }
        );
        console.log(`✅ Removed document from ${document.specificClients.length} specific clients`);
      }
    } catch (clientUpdateError) {
      console.error("⚠️ Failed to remove document from client arrays:", clientUpdateError);
      // Don't fail the entire operation
    }

    // Now delete the document
    const deletedDocument = await Document.findByIdAndDelete(documentId);

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