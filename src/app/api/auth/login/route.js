// File: app/api/auth/login/route.js - FIXED: Add isActive and status checks
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User, Role } from "@/lib/db";
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
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user with role population
    const user = await User.findOne({ email }).populate("role");
    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("📊 User details:", {
      id: user._id,
      name: user.name,
      role: user.role?.name,
      status: user.status,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
    });

    // ✅ CHECK 1: isActive field check
    if (user.isActive === false) {
      console.log("❌ User account is disabled (isActive: false)");
      return NextResponse.json(
        { 
          error: "Your account has been disabled by the administrator.",
          details: "Please contact support to reactivate your account."
        },
        { status: 403 }
      );
    }

    // ✅ CHECK 2: status field check for Disabled or Suspended
    if (user.status === "Disabled") {
      console.log("❌ User account is disabled (status: Disabled)");
      return NextResponse.json(
        { 
          error: "Your account has been disabled.",
          details: "Please contact your administrator to enable your account."
        },
        { status: 403 }
      );
    }

    if (user.status === "Suspended") {
      console.log("❌ User account is suspended");
      return NextResponse.json(
        { 
          error: "Your account has been suspended.",
          details: "Please contact support for more information."
        },
        { status: 403 }
      );
    }

    // ✅ CHECK 3: Check if account is pending approval
    if (user.status === "Pending") {
      console.log("❌ User account is pending approval");
      return NextResponse.json(
        { 
          error: "Your account is pending approval.",
          details: "Please wait for administrator approval or contact support."
        },
        { status: 403 }
      );
    }

    // ✅ CHECK 4: Check if account is inactive
    if (user.status === "Inactive") {
      console.log("❌ User account is inactive");
      return NextResponse.json(
        { 
          error: "Your account is inactive.",
          details: "Please contact your administrator to activate your account."
        },
        { status: 403 }
      );
    }

    // ✅ CHECK 5: Finally, check if status is Active
    if (user.status !== "Active") {
      console.log(`❌ User account status is: ${user.status}`);
      return NextResponse.json(
        { 
          error: "Your account is not active.",
          details: `Account status: ${user.status}. Please contact support.`
        },
        { status: 403 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("🔑 Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("❌ Invalid password");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ SUCCESS: All checks passed, user can login

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
      name: user.name,
      role: user.role.name,
      permissions: user.role.permissions || [],
      isActive: user.isActive,
      status: user.status,
    };

    console.log("🎫 Token payload generated");

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    // Response with user details
    const response = NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        role: user.role.name,
        permissions: user.role.permissions || [],
      },
      token,
      role: user.role.name,
      permissions: user.role.permissions || [],
      message: "Login successful",
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