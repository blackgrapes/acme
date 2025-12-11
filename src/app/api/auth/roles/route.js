// File: src/app/api/auth/roles/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Role } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function GET(request) {
  try {
    const denied = requirePermission(request, "roles-read");
    if (denied) return denied;
    await connectDB();

    const roles = await Role.find({}).populate("users");

    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const denied = requirePermission(request, "roles-create");
    if (denied) return denied;
    await connectDB();

    const { name, description, permissions } = await request.json();

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return NextResponse.json(
        { error: "Role already exists" },
        { status: 400 }
      );
    }

    const role = await Role.create({
      name,
      description,
      permissions,
      status: "Active",
    });

    return NextResponse.json({ message: "Role created successfully", role });
  } catch (error) {
    console.error("Role creation error:", error);
    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 }
    );
  }
}
