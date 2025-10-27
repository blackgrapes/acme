// File: src/app/api/admin/documents/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Document from "@/lib/models/Document";

// ✅ GET - Fetch all documents for admin (no access control)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const isCompany = searchParams.get("isCompany") === "true";

    let query = {};

    // If company documents filter
    if (isCompany) {
      query.isCompanyDocument = true;
    } else {
      query.isCompanyDocument = { $ne: true };
    }

    const documents = await Document.find(query)
      .populate("specificClients", "name email")
      .sort({ uploaded: -1 });

    return NextResponse.json({
      documents: documents,
    });
  } catch (error) {
    console.error("Error fetching admin documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
