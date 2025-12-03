// File: src/app/api/documents/route.js
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