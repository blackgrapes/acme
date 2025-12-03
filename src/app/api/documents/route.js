// File: src/app/api/documents/route.js - UPDATED
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

    // CASE 1: Company documents request (no clientId needed)
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

    // CASE 2: Admin requesting client documents
    if (admin) {
      const denied = requirePermission(request, "documents-read");
      if (denied) return denied;
      
      let query = { isCompanyDocument: false };
      
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

    // CASE 3: Client requesting their documents
    if (!clientId || clientId === "undefined" || clientId === "null") {
      console.error("❌ Client ID is required for client document requests");
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    // Validate clientId format
    if (!/^[0-9a-fA-F]{24}$/.test(clientId)) {
      console.error("❌ Invalid clientId format:", clientId);
      return NextResponse.json(
        { error: "Invalid Client ID format" },
        { status: 400 }
      );
    }

    // Find client
    const client = await User.findById(clientId);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Build query for client: Get their specific docs + company docs
    const query = {
      $or: [
        { isCompanyDocument: true },
        { targetClient: clientId },
        { specificClients: clientId }
      ]
    };

    // Filter by category if specified
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