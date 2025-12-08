// File: src/app/api/client/service-overview/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Guard from "@/lib/models/Guard";
import { getCurrentUser, hasRole } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    
    // Get current user (client)
    const user = await getCurrentUser(request);
    if (!user || !hasRole(user, "Client")) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }
    
    const clientId = user._id;
    
    // Get client details with populated assigned guards
    const client = await User.findById(clientId)
      .populate("assignedGuards", "name email phone gender type guardId experience salary status location rating specialization currentAssignment avatar joinDate lastActive")
      .populate("documents")
      .lean();
    
    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }
    
    // Calculate service duration
    const serviceDuration = client.joinDate ? 
      Math.floor((new Date() - new Date(client.joinDate)) / (1000 * 60 * 60 * 24)) : 0;
    
    // Format the response
    const serviceOverview = {
      // Client Basic Info
      clientInfo: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        companyName: client.companyName,
        designation: client.designation,
        clientType: client.clientType,
        avatar: client.avatar,
        joinDate: client.joinDate,
      },
      
      // Contract Details
      contractDetails: {
        contractNumber: client.contractNumber,
        contractStartDate: client.contractStartDate,
        contractEndDate: client.contractEndDate,
        contractValue: client.contractValue,
        status: client.isActive ? "Active" : "Inactive",
        securityPlan: client.securityPlan,
      },
      
      // Service Details
      serviceDetails: {
        serviceType: client.serviceType || [],
        requiredGuards: client.requiredGuards || { male: 0, female: 0, total: 0 },
        equipmentRequired: client.equipmentRequired || [],
        serviceDuration: `${serviceDuration} days`,
      },
      
      // Sites/Locations
      sites: client.sites || [],
      
      // Assigned Guards (with complete details)
      assignedGuards: client.assignedGuards?.map(guard => ({
        _id: guard._id,
        name: guard.name,
        email: guard.email,
        phone: guard.phone,
        gender: guard.gender,
        type: guard.type,
        guardId: guard.guardId,
        experience: guard.experience,
        salary: guard.salary,
        status: guard.status,
        location: guard.location,
        rating: guard.rating || 0,
        specialization: guard.specialization || [],
        avatar: guard.avatar,
        joinDate: guard.joinDate,
        currentAssignment: guard.currentAssignment || {},
      })) || [],
      
      // Emergency Contacts
      emergencyContacts: client.emergencyContacts || [],
      
      // Documents Count
      documentsCount: client.documents?.length || 0,
      
      // Current Status
      currentStatus: {
        isActive: client.isActive,
        lastLogin: client.lastLogin,
        status: client.status,
      },
      
      // Timestamps
      timestamps: {
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      }
    };
    
    return NextResponse.json({
      success: true,
      data: serviceOverview,
      message: "Service overview fetched successfully"
    });
    
  } catch (error) {
    console.error("❌ Error fetching service overview:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch service overview",
        details: error.message 
      },
      { status: 500 }
    );
  }
}