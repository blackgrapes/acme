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
      phone2,
      address,
      gender,
      codeNumber,
    } = await request.json();

    console.log("📝 Guard registration data:", { name, email, codeNumber });

    // Validation
    if (!name || !email || !phone || !codeNumber) {
      console.log("❌ Missing required fields");
      return NextResponse.json(
        { error: "Name, Email, Phone, and Code Number are required" },
        { status: 400 }
      );
    }

    // Check if guard already exists (email, phone, or guardId/codeNumber)
    const existingGuard = await Guard.findOne({
      $or: [{ email }, { phone }, { guardId: codeNumber }],
    });

    if (existingGuard) {
      console.log("❌ Guard already exists:", email);
      return NextResponse.json(
        { error: "Guard with this Email, Phone, or Code Number already exists" },
        { status: 400 }
      );
    }

    // Create new guard using codeNumber as guardId
    const newGuard = await Guard.create({
      name,
      email,
      phone,
      phone2: phone2 || "",
      address: address || "",
      gender: gender || "",
      guardId: codeNumber, // Use manual code number as ID
      codeNumber, // Keep redundant copy if needed, or just rely on guardId. Model has both.
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

