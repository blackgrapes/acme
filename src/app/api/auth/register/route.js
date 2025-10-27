// src/app/api/auth/register/route.js - FIXED VERSION
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User, Role } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectDB();
    console.log("🔧 Register API called");

    const {
      name,
      email,
      password,
      phone,
      companyName,
      address,
      securityPlan,
      serviceDuration,
      roleName = "Client",
      permissions = [], // ✅ Add permissions from frontend
    } = await request.json();

    console.log("📝 Registration data:", {
      name,
      email,
      roleName,
      permissions,
    });

    // Validation
    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // ✅ FIXED: Get or create Role with proper permissions handling
    let role = await Role.findOne({ name: roleName });

    if (!role) {
      console.log("🆕 Creating new role:", roleName);

      // Use permissions from request or default based on role
      const rolePermissions =
        permissions.length > 0
          ? permissions
          : roleName === "Client"
          ? ["client-dashboard-read", "documents-read", "reports-view"]
          : ["dashboard-read", "clients-read"];

      try {
        role = await Role.create({
          name: roleName,
          description: `${roleName} user role`,
          permissions: rolePermissions,
          status: "Active",
          users: 0, // Initialize user count
        });
        console.log(
          "✅ New role created:",
          role.name,
          "with permissions:",
          rolePermissions
        );
      } catch (roleError) {
        console.error("💥 Role creation failed:", roleError);
        return NextResponse.json(
          { error: "Failed to create role: " + roleError.message },
          { status: 500 }
        );
      }
    } else {
      console.log("✅ Existing role found:", role.name);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("🔑 Password hashed");

    // Create User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role._id,
      phone: phone || "",
      companyName: companyName || "",
      address: address || "",
      securityPlan: securityPlan || "",
      serviceDuration: serviceDuration || {},
      status: "Active",
      avatar: name.charAt(0).toUpperCase(),
    });

    console.log("✅ User created:", newUser._id);

    // ✅ FIXED: Update role user count properly
    await Role.findByIdAndUpdate(role._id, {
      $inc: { users: 1 },
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    // Generate token with actual permissions
    const tokenPayload = {
      userId: newUser._id,
      email: newUser.email,
      role: role.name,
      permissions: role.permissions || [],
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      user: userWithoutPassword,
      token,
      role: role.name,
      permissions: role.permissions || [],
      message: "Role and user created successfully!",
    });

    // Set auth cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    console.log("✅ Registration completed successfully");
    return response;
  } catch (error) {
    console.error("💥 Register error:", error);

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
        { error: "Role name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
