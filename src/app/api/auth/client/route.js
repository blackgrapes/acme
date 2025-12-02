// src/app/api/auth/client/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/db";

export async function GET(request) {
  try {
    await connectDB();
    console.log("📋 Fetching all clients");

    // Get Client role ID first
    const Role = (await import("@/lib/models/Role")).default;
    const clientRole = await Role.findOne({ name: "Client" }).lean();
    
    if (!clientRole) {
      console.log("⚠️ No Client role found");
      return NextResponse.json({ clients: [] });
    }

    // Find all users with Client role
    const clients = await User.find({ role: clientRole._id })
      .populate("role", "name permissions")
      .select("-password -documents") // Don't include documents in list view
      .sort({ createdAt: -1 })
      .lean();

    // Format clients for frontend
    const formattedClients = clients.map(client => {
      // Format address
      const formatAddress = (address) => {
        if (!address) return "N/A";
        if (typeof address === 'string') return address;
        
        const parts = [];
        if (address.city) parts.push(address.city);
        if (address.state) parts.push(address.state);
        
        return parts.join(", ") || "Address not provided";
      };

      return {
        _id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone || "N/A",
        alternatePhone: client.alternatePhone || "",
        companyName: client.companyName || "No company",
        clientType: client.clientType || "Corporate",
        designation: client.designation || "",
        address: formatAddress(client.address),
        addressObject: client.address || {},
        securityPlan: client.securityPlan || "Standard",
        serviceType: client.serviceType || [],
        contractNumber: client.contractNumber || "No contract",
        contractStartDate: client.contractStartDate,
        contractEndDate: client.contractEndDate,
        contractValue: client.contractValue || 0,
        sites: client.sites || [],
        emergencyContacts: client.emergencyContacts || [],
        requiredGuards: client.requiredGuards || { male: 0, female: 0, total: 0 },
        assignedGuards: client.assignedGuards || [],
        equipmentRequired: client.equipmentRequired || [],
        status: client.status || "Active",
        joinDate: client.joinDate,
        lastLogin: client.lastLogin,
        avatar: client.avatar || "",
        notes: client.notes || "",
        createdBy: client.createdBy,
        updatedBy: client.updatedBy,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        
        // Calculated fields
        activeGuardsCount: client.assignedGuards?.length || 0,
        documentsCount: client.documents?.length || 0,
        contractStatus: !client.contractEndDate ? 'No Contract' : 
          new Date(client.contractEndDate) < new Date() ? 'Expired' : 
          'Active'
      };
    });

    console.log(`✅ Found ${formattedClients.length} clients`);

    return NextResponse.json({ 
      clients: formattedClients,
      count: formattedClients.length,
      message: "Clients fetched successfully" 
    });
  } catch (error) {
    console.error("❌ Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients", details: error.message },
      { status: 500 }
    );
  }
}