// src/app/api/auth/register/route.js - COMPLETELY FIXED
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
      alternatePhone,
      clientType,
      companyName,
      designation,
      address,
      securityPlan,
      serviceType,
      contractStartDate,
      contractEndDate,
      contractValue,
      sites,
      emergencyContacts,
      requiredGuards,
      equipmentRequired,
      assignedGuards,
      notes,
      roleName = "Client",
      permissions = [],
    } = await request.json();

    console.log("📝 Registration data:", {
      name,
      email,
      roleName,
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

    // Get or create Role
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
          users: 0,
        });
        console.log("✅ New role created:", role.name);
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

    // ✅ FIXED: Create address object with proper structure
    let addressObj = {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India"
    };

    if (address) {
      if (typeof address === 'string') {
        addressObj.street = address;
      } else if (typeof address === 'object') {
        addressObj = {
          street: address.street || "",
          city: address.city || "",
          state: address.state || "",
          postalCode: address.postalCode || "",
          country: address.country || "India",
        };
      }
    }

    // ✅ FIXED: Prepare user data with proper field initialization
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role._id,
      phone: phone || "",
      alternatePhone: alternatePhone || "",
      clientType: clientType || "Corporate",
      companyName: companyName || "",
      designation: designation || "",
      address: addressObj, // ✅ Now properly structured object
      status: "Active",
      avatar: name.charAt(0).toUpperCase(),
    };

    // Add optional fields only if provided
    if (securityPlan) {
      userData.securityPlan = securityPlan;
    }

    if (serviceType && Array.isArray(serviceType)) {
      userData.serviceType = serviceType;
    }

    if (contractStartDate) {
      userData.contractStartDate = new Date(contractStartDate);
    }

    if (contractEndDate) {
      userData.contractEndDate = new Date(contractEndDate);
    }

    if (contractValue) {
      userData.contractValue = parseFloat(contractValue);
    }

    if (sites && Array.isArray(sites)) {
      userData.sites = sites.map(site => ({
        siteName: site.siteName || "",
        address: site.address || "",
        contactPerson: site.contactPerson || "",
        contactNumber: site.contactNumber || "",
        shiftTimings: {
          start: site.shiftTimings?.start || "",
          end: site.shiftTimings?.end || "",
        },
        isActive: site.isActive !== undefined ? site.isActive : true,
      }));
    } else {
      userData.sites = [];
    }

    if (emergencyContacts && Array.isArray(emergencyContacts)) {
      userData.emergencyContacts = emergencyContacts.map(contact => ({
        name: contact.name || "",
        relationship: contact.relationship || "",
        phone: contact.phone || "",
        priority: contact.priority || 1,
      }));
    } else {
      userData.emergencyContacts = [];
    }

    if (requiredGuards) {
      userData.requiredGuards = {
        male: parseInt(requiredGuards.male) || 0,
        female: parseInt(requiredGuards.female) || 0,
        total: parseInt(requiredGuards.total) || 0,
      };
    }

    if (equipmentRequired && Array.isArray(equipmentRequired)) {
      userData.equipmentRequired = equipmentRequired;
    } else {
      userData.equipmentRequired = [];
    }

    if (assignedGuards && Array.isArray(assignedGuards)) {
      userData.assignedGuards = assignedGuards;
    } else {
      userData.assignedGuards = [];
    }

    if (notes) {
      userData.notes = notes.substring(0, 500);
    }

    console.log("📦 Final user data:", JSON.stringify(userData, null, 2));

    // Create User
    const newUser = await User.create(userData);
    console.log("✅ User created successfully:", newUser._id);

    // Update role user count
    await Role.findByIdAndUpdate(role._id, {
      $inc: { users: 1 },
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    // Generate token
    const tokenPayload = {
      userId: newUser._id,
      email: newUser.email,
      role: role.name,
      permissions: role.permissions || [],
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      user: userWithoutPassword,
      token,
      role: role.name,
      permissions: role.permissions || [],
      message: "User registered successfully!",
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
    console.error("💥 Error details:", error.message);
    console.error("💥 Error stack:", error.stack);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(e => e.message);
      console.error("💥 Validation errors:", errors);
      return NextResponse.json(
        { 
          error: `Validation error: ${errors.join(", ")}`,
          details: errors 
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error.message 
      },
      { status: 500 }
    );
  }
}