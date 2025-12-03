import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User, Role } from "@/lib/db";
import bcrypt from "bcryptjs";

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
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Role handling
    let role = await Role.findOne({ name: roleName });

    if (!role) {
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
      } catch (roleError) {
        return NextResponse.json(
          { error: "Failed to create role: " + roleError.message },
          { status: 500 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Address handling
    let addressObj = {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    };

    if (address) {
      if (typeof address === "string") {
        addressObj.street = address;
      } else if (typeof address === "object") {
        addressObj = {
          street: address.street || "",
          city: address.city || "",
          state: address.state || "",
          postalCode: address.postalCode || "",
          country: address.country || "India",
        };
      }
    }

    // Prepare user data
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
      address: addressObj,
      status: "Active",
      avatar: name.charAt(0).toUpperCase(),
    };

    if (securityPlan) userData.securityPlan = securityPlan;
    if (serviceType && Array.isArray(serviceType))
      userData.serviceType = serviceType;

    if (contractStartDate)
      userData.contractStartDate = new Date(contractStartDate);
    if (contractEndDate) userData.contractEndDate = new Date(contractEndDate);
    if (contractValue) userData.contractValue = parseFloat(contractValue);

    if (sites && Array.isArray(sites)) {
      userData.sites = sites.map((site) => ({
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
      userData.emergencyContacts = emergencyContacts.map((contact) => ({
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

    if (notes) userData.notes = notes.substring(0, 500);

    // Create user
    const newUser = await User.create(userData);

    // Update role user count
    await Role.findByIdAndUpdate(role._id, {
      $inc: { users: 1 },
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    // 🔥 FINAL RESPONSE (No Token)
    return NextResponse.json({
      user: userWithoutPassword,
      role: role.name,
      permissions: role.permissions || [],
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("💥 Register error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        {
          error: `Validation error: ${errors.join(", ")}`,
          details: errors,
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
        details: error.message,
      },
      { status: 500 }
    );
  }
}
