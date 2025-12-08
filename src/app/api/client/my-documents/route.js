// acme/src/app/api/client/my-documents/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Document from "@/lib/models/Document";
import { getCurrentUser, hasRole } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }
    
    if (!hasRole(user, "Client")) {
      return NextResponse.json(
        { error: "Access denied: Only clients can access this endpoint" },
        { status: 403 }
      );
    }
    
    const clientId = user._id;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    
    console.log(`📥 Client ${clientId} fetching documents. Category: ${category}, Search: ${search}`);
    
    const query = {
      $or: [
        { isCompanyDocument: true },
        { targetClient: clientId },
        { specificClients: clientId }
      ]
    };
    
    if (category && category !== "all") {
      query.type = category;
    }
    
    if (search) {
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
          ]
        }
      ];
    }
    
    // ✅ CHANGE 1: Add originalName, fileName, documentStartDate, documentEndDate, documentPeriod to select
    const documents = await Document.find(query)
      .select("name description type fileUrl size uploadDate uploadedBy targetClient specificClients isCompanyDocument status originalName fileName documentStartDate documentEndDate documentPeriod")
      .populate("uploadedBy", "name email")
      .populate("targetClient", "name email companyName")
      .populate("specificClients", "name email companyName")
      .sort({ uploadDate: -1 })
      .lean();
    
    console.log(`✅ Client ${clientId} fetched ${documents.length} documents`);
    
    const transformedDocs = documents.map(doc => ({
      _id: doc._id,
      name: doc.name,
      description: doc.description || "",
      type: doc.type,
      fileUrl: doc.fileUrl,
      size: doc.size,
      uploaded: doc.uploadDate,
      uploadedBy: doc.uploadedBy ? {
        name: doc.uploadedBy.name,
        email: doc.uploadedBy.email
      } : null,
      accessLevel: doc.isCompanyDocument ? "general" : 
                  doc.targetClient && doc.targetClient._id.toString() === clientId.toString() ? "specific" : 
                  doc.specificClients && doc.specificClients.some(c => c._id.toString() === clientId.toString()) ? "specific" : 
                  "general",
      status: doc.status,
      isCompanyDocument: doc.isCompanyDocument,
      // ✅ CHANGE 2: Add these new fields to transformed object
      originalName: doc.originalName,
      fileName: doc.fileName,
      documentStartDate: doc.documentStartDate,
      documentEndDate: doc.documentEndDate,
      documentPeriod: doc.documentPeriod
    }));
    
    return NextResponse.json({ 
      success: true,
      documents: transformedDocs,
      total: transformedDocs.length,
      clientInfo: {
        name: user.name,
        email: user.email,
        companyName: user.companyName || "Individual"
      }
    });
    
  } catch (error) {
    console.error("❌ Error fetching client documents:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch documents",
        details: error.message 
      },
      { status: 500 }
    );
  }
}