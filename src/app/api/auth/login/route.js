// File: app/api/auth/login/route.js - FIXED: Add permissions to response body
import { NextResponse } from "next/server";
import { connectDB, User, Role } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    console.log("🔐 Login API called");

    // Connect to database
    await connectDB();
    console.log("✅ Database connected");

    const { email, password } = await request.json();
    console.log("📧 Login attempt for:", email);

    if (!email || !password) {
      console.log("❌ Missing credentials");
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    // Find user with role population
    const user = await User.findOne({ email }).populate("role");
    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("📊 User status:", user.status);
    console.log("🎭 User role:", user.role?.name);

    if (user.status !== "Active") {
      console.log("❌ User not active");
      return NextResponse.json(
        { error: "Account is not active" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("🔑 Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("❌ Invalid password");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Generate JWT
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role.name,
      permissions: user.role.permissions || [],
    };

    console.log("🎫 Token payload:", tokenPayload);

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    // FIXED: Include permissions in response body for immediate redirect use
    const response = NextResponse.json({
      user: userWithoutPassword,
      token,
      role: user.role.name,
      permissions: user.role.permissions || [], // Add this
    });

    // Set httpOnly cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    console.log("✅ Login successful for:", email, "Role:", user.role.name);
    return response;
  } catch (error) {
    console.error("💥 Login error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
