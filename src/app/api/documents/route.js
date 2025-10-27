// File: src/app/api/documents/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Document from "@/lib/models/Document";
import { User } from "@/lib/db"; // Assuming User model is exported from db.js or similar

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";
    const clientId = searchParams.get("clientId");
    const isCompany = searchParams.get("isCompanyDocument") === "true"; // Fixed param name
    const accessLevel = searchParams.get("accessLevel"); // For company general filter

    console.log(
      "📥 Fetching documents. Admin:",
      admin,
      "ClientId:",
      clientId,
      "isCompany:",
      isCompany
    );

    if (admin) {
      // Admin: Fetch all, with optional filters
      let query = {};
      if (isCompany !== undefined) query.isCompanyDocument = isCompany;
      if (accessLevel) query.accessLevel = accessLevel;

      const documents = await Document.find(query)
        .populate("specificClients", "name email")
        .sort({ uploaded: -1 });

      console.log(`✅ Admin fetched ${documents.length} documents`);
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

    // Find client (for existence check)
    const client = await User.findById(clientId);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Build query: general OR specific to this client
    let query = {
      $or: [
        { accessLevel: "general" },
        { accessLevel: "specific", specificClients: clientId },
        { targetClient: clientId },
      ],
    };

    if (isCompany !== undefined) {
      query.isCompanyDocument = isCompany;
    } else {
      // Default: Exclude company docs for client regular view
      query.isCompanyDocument = { $ne: true };
    }

    const documents = await Document.find(query)
      .populate("specificClients", "name email")
      .sort({ uploaded: -1 });

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

export async function POST(request) {
  try {
    await connectDB();
    const documentData = await request.json();

    console.log("📥 Creating document:", documentData);

    const newDocument = new Document(documentData);
    await newDocument.save();

    await newDocument.populate("specificClients", "name email");

    console.log("✅ Document created successfully:", newDocument._id);

    return NextResponse.json({
      success: true,
      document: newDocument,
      message: "Document uploaded successfully",
    });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document: " + error.message },
      { status: 500 }
    );
  }
}