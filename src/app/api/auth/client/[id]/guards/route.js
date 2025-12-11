// /api/auth/client/[id]/guards/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User, Guard } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    console.log("🛡️ Fetching guards for client:", id);

    // Find client and populate assignedGuards with Guard model
    const client = await User.findById(id)
      .populate({
        path: 'assignedGuards',
        model: 'Guard'
      })
      .lean();

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Format guards
    const formattedGuards = (client.assignedGuards || []).map(guard => ({
      id: guard._id,
      name: guard.name,
      email: guard.email,
      phone: guard.phone || "Not provided",
      status: guard.status || "Active",
      avatar: guard.avatar || guard.name?.charAt(0).toUpperCase() || "G",
      designation: guard.type || "Security Guard",
      guardId: guard.guardId || "N/A",
      joinDate: guard.joinDate ?
        new Date(guard.joinDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : "Unknown",
      experience: guard.experience || "0 years",
      rating: guard.rating || 0,
      location: guard.location || "N/A",
      currentAssignment: guard.currentAssignment || null
    }));

    return NextResponse.json({
      guards: formattedGuards,
      count: formattedGuards.length,
      message: "Guards fetched successfully"
    });

  } catch (error) {
    console.error("❌ Error fetching client guards:", error);
    return NextResponse.json(
      { error: "Failed to fetch guards", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { guardId } = await request.json();

    console.log("➕ Assigning guard:", guardId, "to client:", id);

    // Find client
    const client = await User.findById(id);
    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Find guard
    const guard = await Guard.findById(guardId);
    if (!guard) {
      return NextResponse.json(
        { error: "Guard not found" },
        { status: 404 }
      );
    }

    // Check if guard is already assigned
    if (client.assignedGuards.includes(guardId)) {
      return NextResponse.json(
        { error: "Guard already assigned to this client" },
        { status: 400 }
      );
    }

    // Add guard to client's assignedGuards
    client.assignedGuards.push(guardId);
    await client.save();

    // Update guard's status and current assignment
    guard.status = "Assigned";
    guard.currentAssignment = {
      clientId: client._id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      organization: client.companyName,
      assignmentType: client.securityPlan,
      location: formatAddress(client.address),
      startDate: new Date(),
      status: "Active"
    };
    await guard.save();

    // ✅ NO NEED TO LINK DOCUMENTS - Dynamic visibility via relatedGuard + currentAssignment
    console.log(`✅ Guard ${guard.guardId} assigned to client ${client._id}. Documents will be visible dynamically.`);

    return NextResponse.json({
      success: true,
      message: "Guard assigned successfully"
    });
  } catch (error) {
    console.error("❌ Error assigning guard:", error);
    return NextResponse.json(
      { error: "Failed to assign guard", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // Get guardId from query parameters
    const url = new URL(request.url);
    const guardId = url.searchParams.get("guardId");

    if (!guardId) {
      return NextResponse.json(
        { error: "Guard ID is required" },
        { status: 400 }
      );
    }

    console.log("🗑️ Removing guard:", guardId, "from client:", id);

    // Find client
    const client = await User.findById(id);
    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Find guard
    const guard = await Guard.findById(guardId);
    if (!guard) {
      return NextResponse.json(
        { error: "Guard not found" },
        { status: 404 }
      );
    }

    // Check if guard is assigned to this client
    if (!client.assignedGuards.includes(guardId)) {
      return NextResponse.json(
        { error: "Guard is not assigned to this client" },
        { status: 400 }
      );
    }

    // Remove guard from client's assignedGuards
    client.assignedGuards = client.assignedGuards.filter(
      id => id.toString() !== guardId
    );
    await client.save();

    // Update guard's status and current assignment
    guard.status = "Available";
    guard.currentAssignment = null; // ✅ This clears the assignment - documents will no longer be visible
    await guard.save();

    // ✅ NO NEED TO UNLINK DOCUMENTS - Dynamic visibility handles this automatically
    console.log(`✅ Guard ${guard.guardId} removed from client ${client._id}. Documents will no longer be visible.`);

    return NextResponse.json({
      success: true,
      message: "Guard removed successfully"
    });
  } catch (error) {
    console.error("❌ Error removing guard:", error);
    return NextResponse.json(
      { error: "Failed to remove guard", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function
function formatAddress(address) {
  if (!address) return "Not specified";
  if (typeof address === 'string') return address;

  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.postalCode) parts.push(address.postalCode);

  return parts.join(", ") || "Not specified";
}