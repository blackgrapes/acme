// src/app/api/auth/guard/register/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Guard } from "@/lib/db";
import { requirePermission } from "@/lib/auth";

export async function POST(request) {
  try {
    const denied = requirePermission(request, "guards-create");
    if (denied) return denied;
    await connectDB();
    console.log("🔧 Guard Registration API called");

    const {
      name,
      email,
      phone,
      emergencyContact,
      gender,
      dateOfBirth,
      address,
      type,
      experience,
      salary,
      location,
      specialization = [],
      certifications = [],
      documents = [],
    } = await request.json();

    console.log("📝 Guard registration data:", { name, email, type });

    // Validation
    if (
      !name ||
      !email ||
      !phone ||
      !gender ||
      !dateOfBirth ||
      !address ||
      !type ||
      !experience ||
      !salary ||
      !location
    ) {
      console.log("❌ Missing required fields");
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Check if guard already exists
    const existingGuard = await Guard.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingGuard) {
      console.log("❌ Guard already exists:", email);
      return NextResponse.json(
        { error: "Guard with this email or phone already exists" },
        { status: 400 }
      );
    }

    // Generate guard ID manually
    const guardCount = await Guard.countDocuments();
    const guardId = `GUA-${String(guardCount + 1).padStart(3, "0")}`;

    console.log("🆔 Generated Guard ID:", guardId);

    // Create new guard with manual guardId
    const newGuard = await Guard.create({
      name,
      email,
      phone,
      emergencyContact: emergencyContact || "",
      gender,
      dateOfBirth: new Date(dateOfBirth),
      address,
      type,
      experience,
      salary,
      location,
      specialization,
      certifications,
      documents,
      guardId, // Manually add the generated ID
      status: "Available",
      joinDate: new Date(),
      lastActive: new Date(),
      avatar: name.charAt(0).toUpperCase(),
    });

    console.log("✅ Guard created successfully:", newGuard._id);

    const response = NextResponse.json({
      guard: newGuard,
      message: "Guard registered successfully!",
    });

    console.log("✅ Guard registration completed successfully");
    return response;
  } catch (error) {
    console.error("💥 Guard registration error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          error: `Validation error: ${Object.values(error.errors)
            .map((e) => e.message)
            .join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Guard with this email or phone already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

