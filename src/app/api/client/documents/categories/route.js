// FILE: src/api/client/documents/categories/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Document from "@/lib/models/Document";
import { getCurrentUser, hasRole } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    // Get current user from request
    const user = await getCurrentUser(request);
    if (!user || !hasRole(user, "Client")) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const clientId = user._id;

    // ✅ Find guards assigned to this client
    const Guard = (await import("@/lib/models/Guard")).default;
    let guardIds = [];
    try {
      const assignedGuards = await Guard.find({
        "currentAssignment.clientId": clientId,
        status: { $in: ["Assigned", "Active"] }
      }).select("_id");
      guardIds = assignedGuards.map(g => g._id);
      console.log(`✅ Client ${clientId} has ${guardIds.length} assigned guards for categories`);
    } catch (err) {
      console.error("Error finding assigned guards:", err);
    }

    // Get all document types/categories that this client has access to
    const matchQuery = {
      $or: [
        { isCompanyDocument: true },
        { targetClient: clientId },
        { specificClients: clientId }
      ]
    };

    // ✅ Add guard documents to the match
    if (guardIds.length > 0) {
      matchQuery.$or.push({ relatedGuard: { $in: guardIds } });
    }

    const categories = await Document.aggregate([
      {
        $match: matchQuery
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          type: "$_id",
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { type: 1 }
      }
    ]);

    // Map to meaningful category names
    const categoryNames = {
      "agreement": "Agreements",
      "attendance": "Attendance Records",
      "bills": "Bills & Invoices",
      "salary-sheet": "Salary Sheets",
      "pay-slip": "Pay Slips",
      "esi": "ESI Documents",
      "pf": "PF Documents",
      "employee-details": "Employee Details",
      "training": "Training Documents",
      "night-checking": "Night Checking Reports",
      "paid-gst": "Paid GST",
      "msme": "MSME Documents",
      "gst": "GST Documents",
      "pasara": "Pasara Documents",
      "pan": "PAN Documents",
      "profile": "Profile Documents",
      "bank-details": "Bank Details"
    };

    const formattedCategories = categories.map(cat => ({
      ...cat,
      name: categoryNames[cat.type] || cat.type,
      id: cat.type
    }));

    return NextResponse.json({
      success: true,
      categories: formattedCategories,
      totalCategories: formattedCategories.length
    });

  } catch (error) {
    console.error("❌ Error fetching document categories:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        details: error.message
      },
      { status: 500 }
    );
  }
}