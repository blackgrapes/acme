import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Role } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function PUT(request, { params }) {
    try {
        const denied = requirePermission(request, "roles-update");
        if (denied) return denied;
        await connectDB();

        const { id } = params;
        const { name, description, permissions } = await request.json();

        const role = await Role.findByIdAndUpdate(
            id,
            { name, description, permissions },
            { new: true }
        );

        if (!role) {
            return NextResponse.json({ error: "Role not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Role updated successfully", role });
    } catch (error) {
        console.error("Role update error:", error);
        return NextResponse.json(
            { error: "Failed to update role" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const denied = requirePermission(request, "roles-delete");
        if (denied) return denied;
        await connectDB();

        const { id } = params;
        const role = await Role.findByIdAndDelete(id);

        if (!role) {
            return NextResponse.json({ error: "Role not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Role deleted successfully" });
    } catch (error) {
        console.error("Role deletion error:", error);
        return NextResponse.json(
            { error: "Failed to delete role" },
            { status: 500 }
        );
    }
}
