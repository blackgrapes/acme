// acme/src/app/api/client/my-documents/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Document from "@/lib/models/Document";
import { getCurrentUser, hasRole } from "@/lib/auth"; // आपके auth utilities का उपयोग

export async function GET(request) {
  try {
    await connectDB();
    
    // Get current user from request using your auth utility
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }
    
    // Check if user has client role using your hasRole function
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
    
    // Build query for client's documents
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
    
    // Filter by category if specified
    if (category && category !== "all") {
      query.type = category;
    }
    
    // If search term is provided, add search conditions
    if (search) {
      // Note: We need to maintain the $or structure, so we'll add search within each condition
      // Alternatively, we can restructure the query
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
    
    // Fetch documents with relevant fields only
    const documents = await Document.find(query)
      .select("name description type fileUrl size uploadDate uploadedBy targetClient specificClients isCompanyDocument status")
      .populate("uploadedBy", "name email")
      .populate("targetClient", "name email companyName")
      .populate("specificClients", "name email companyName")
      .sort({ uploadDate: -1 })
      .lean(); // Use lean for better performance
    
    console.log(`✅ Client ${clientId} fetched ${documents.length} documents`);
    
    // Transform documents for client view
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
      isCompanyDocument: doc.isCompanyDocument
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