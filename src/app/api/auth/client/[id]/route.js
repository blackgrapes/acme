// src/app/api/auth/client/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User, Guard } from "@/lib/db"; // Guard import bhi add karo
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    console.log("🔍 Fetching client:", id);

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid client ID format" },
        { status: 400 }
      );
    }

    // Find client and populate role
    const client = await User.findById(id)
      .populate("role", "name permissions")
      .select("-password")
      .lean();

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // 📌 YEH NAYA CODE ADD KARO: Fetch assigned guards details
    const clientGuards = await Guard.find({
      _id: { $in: client.assignedGuards || [] }
    }).lean();

    // Format address
    const formatAddress = (address) => {
      if (!address) return "Address not provided";
      if (typeof address === 'string') return address;
      
      const parts = [];
      if (address.street) parts.push(address.street);
      if (address.city) parts.push(address.city);
      if (address.state) parts.push(address.state);
      if (address.postalCode) parts.push(address.postalCode);
      if (address.country && address.country !== "India") parts.push(address.country);
      
      return parts.join(", ") || "Address incomplete";
    };

    // Format client data for frontend
    const formattedClient = {
      ...client,
      // Basic info
      name: client.name || "Unknown",
      email: client.email || "",
      phone: client.phone || "Not provided",
      alternatePhone: client.alternatePhone || "",
      
      // Company info
      company: client.companyName || "No company",
      designation: client.designation || "",
      clientType: client.clientType || "Corporate",
      
      // Address
      address: formatAddress(client.address),
      addressObject: client.address || {},
      
      // Service info
      securityPlan: client.securityPlan || "Standard",
      serviceType: client.serviceType || [],
      equipmentRequired: client.equipmentRequired || [],
      
      // Contract info
      contractNumber: client.contractNumber || "No contract",
      contractStartDate: client.contractStartDate,
      contractEndDate: client.contractEndDate,
      contractValue: client.contractValue || 0,
      
      // Sites
      sites: client.sites || [],
      
      // Emergency contacts
      emergencyContacts: client.emergencyContacts || [],
      
      // Guard requirements
      requiredGuards: client.requiredGuards || { male: 0, female: 0, total: 0 },
      
      // Assigned guards (IDs)
      assignedGuards: client.assignedGuards || [],
      
      // 📌 YEH NAYA PROPERTY ADD KARO: Assigned guards with details
      assignedGuardsData: clientGuards.map(g => ({
        id: g._id,
        name: g.name,
        email: g.email,
        status: g.status
      })),
      
      // Status
      status: client.status || "Active",
      
      // Dates
      joinDate: client.joinDate,
      joined: client.joinDate ? 
        new Date(client.joinDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : "Unknown",
      
      // Performance metrics (calculated)
      activeGuards: client.assignedGuards?.length || 0,
      monthlyRevenue: client.contractValue ? 
        `₹${Math.round(client.contractValue / 12).toLocaleString('en-IN')}` : "₹0",
      satisfaction: 95, // Default value
      
      // Notes
      notes: client.notes || "",
      
      // Documents count
      documentsCount: client.documents?.length || 0
    };

    return NextResponse.json({ 
      client: formattedClient,
      message: "Client fetched successfully" 
    });
  } catch (error) {
    console.error("❌ Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const updateData = await request.json();

    console.log("✏️ Updating client:", id);

    const client = await User.findById(id);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Update client
    const updatedClient = await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    )
      .populate("role", "name permissions")
      .select("-password")
      .lean();

    return NextResponse.json({ 
      client: updatedClient,
      message: "Client updated successfully" 
    });
  } catch (error) {
    console.error("❌ Error updating client:", error);
    return NextResponse.json(
      { error: "Failed to update client", details: error.message },
      { status: 500 }
    );
  }
}