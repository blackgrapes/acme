// src/app/api/auth/register/route.js - UPDATED
import { NextResponse } from "next/server";
import { connectDB, User, Role } from "@/lib/db";
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
    } = await request.json();

    console.log("📝 Registration data:", { name, email, roleName });

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

    // Get or create Role
    let role = await Role.findOne({ name: roleName });
    if (!role) {
      console.log("🆕 Creating new role:", roleName);
      const permissions =
        roleName === "Client"
          ? ["client-dashboard-read", "documents-read", "reports-view"]
          : ["dashboard-read", "clients-read"];

      role = await Role.create({
        name: roleName,
        description: `${roleName} user role`,
        permissions: permissions,
        status: "Active",
      });
    }

    console.log("✅ Role found/created:", role.name);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("🔑 Password hashed");

    // Create User - Direct Active status
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
      status: "Active", // ✅ Direct Active - No approval needed
      avatar: name.charAt(0).toUpperCase(),
    });

    console.log("✅ User created:", newUser._id);

    // Update role count
    role.users += 1;
    await role.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    // Generate token
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
      message: "Client registered successfully!", // ✅ Simple success message
    });

    // Set cookie for all users (since all are Active now)
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

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
