// src/app/api/auth/client/[id]/toggle-status/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/db";
import { verifyTokenFromRequest } from "@/lib/auth"; // Use verifyTokenFromRequest

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    console.log("Toggle status request for client ID:", id);
    
    // Get token payload directly (NO database query)
    const result = verifyTokenFromRequest(request);
    if (!result.ok) {
      return result.response;
    }

    const userPayload = result.payload;
    
    console.log("Logged-in user from token:", {
      userId: userPayload.userId,
      email: userPayload.email,
      role: userPayload.role,
      permissions: userPayload.permissions
    });

    // Check if LOGGED-IN user has permission to update clients
    const userPermissions = userPayload.permissions || [];
    const canUpdateClients = userPermissions.includes("clients-update") || 
                           userPermissions.includes("clients-delete") ||
                           userPayload.role === "Super Admin" ||
                           userPayload.role === "admin";
    
    if (!canUpdateClients) {
      console.log("Logged-in user lacks permission to update clients:", {
        userId: userPayload.userId,
        role: userPayload.role,
        permissions: userPermissions
      });
      
      return NextResponse.json(
        { 
          error: "Forbidden", 
          message: "You don't have permission to update client status." 
        },
        { status: 403 }
      );
    }

    const { action } = await request.json(); // "enable" or "disable"
    
    // Find the client whose status we want to change
    const client = await User.findById(id);
    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    console.log("Client to update:", {
      clientId: client._id,
      clientEmail: client.email,
      currentStatus: client.status,
      isActive: client.isActive
    });

    let updateData = {};
    let actionMessage = "";
    
    if (action === "disable") {
      updateData = {
        isActive: false,
        status: "Disabled",
      };
      actionMessage = "disabled";
      
      console.log(`🔒 Client disabled: ${client.email} by logged-in user: ${userPayload.email} (${userPayload.role})`);
      
    } else if (action === "enable") {
      updateData = {
        isActive: true,
        status: "Active",
      };
      actionMessage = "enabled";
      
      console.log(`🔓 Client enabled: ${client.email} by logged-in user: ${userPayload.email} (${userPayload.role})`);
      
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'enable' or 'disable'." },
        { status: 400 }
      );
    }

    const updatedClient = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      client: updatedClient,
      message: `Client ${actionMessage} successfully.`,
      details: action === "disable" 
        ? "Client will not be able to login until enabled by administrator."
        : "Client can now login to their account.",
    });
  } catch (error) {
    console.error("Error toggling client status:", error);
    return NextResponse.json(
      { error: "Failed to update client status", details: error.message },
      { status: 500 }
    );
  }
}