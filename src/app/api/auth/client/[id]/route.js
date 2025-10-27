// Updated File: src/app/api/auth/client/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User, Guard } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const client = await User.findById(id).populate("role").select("-password");

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const updateData = await request.json();

    const client = await User.findById(id);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // If assigning guards, update guard status too
    if (updateData.assignedGuards) {
      // Update guard status to "Assigned"
      await Guard.findByIdAndUpdate(updateData.assignedGuards[0], {
        status: "Assigned",
        currentAssignment: {
          clientId: id,
          clientName: client.name,
          clientEmail: client.email,
          startDate: new Date(),
          status: "Active",
        },
      });
    }

    const updatedClient = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("role")
      .select("-password");

    return NextResponse.json({ client: updatedClient });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}