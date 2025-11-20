// C:\ForD\BlackGrapes\acme-security\seed.js
import dotenv from "dotenv";
import path from "path";

// ✅ Correct path to .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

console.log("🔧 Starting seed process...");
console.log("📁 Current directory:", process.cwd());
console.log("🗄️ MONGODB_URI:", process.env.MONGODB_URI);

import connectDB from "./src/lib/db.js";
import Role from "./src/lib/models/Role.js";
import User from "./src/lib/models/User.js";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    console.log("🔄 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Role.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Old data cleared");

    // Create Super Admin Role
    console.log("👑 Creating Super Admin role...");
    const superAdminRole = await Role.create({
      name: "Super Admin",
      description: "Full access to all admin features and tabs",
      permissions: [
        "dashboard-read",
        "clients-create",
        "clients-read",
        "clients-update",
        "clients-delete",
        // Frontend module specific permissions
        "gallery-create",
        "gallery-read",
        "gallery-update",
        "gallery-delete",
        "testimonials-create",
        "testimonials-read",
        "testimonials-update",
        "testimonials-delete",
        "weprovide-create",
        "weprovide-read",
        "weprovide-update",
        "weprovide-delete",
        "documents-create",
        "documents-read",
        "documents-update",
        "documents-delete",
        "requests-create",
        "requests-read",
        "requests-update",
        "requests-delete",
        "guards-create",
        "guards-read",
        "guards-update",
        "guards-delete",
        "frontend-create",
        "frontend-read",
        "frontend-update",
        "frontend-delete",
        "roles-create",
        "roles-read",
        "roles-update",
        "roles-delete",
        "contact-create",
        "contact-read",
        "contact-update",
        "contact-delete",
        "settings-create",
        "settings-read",
        "settings-update",
        "settings-delete",
      ],
      status: "Active",
    });

    // Create Client Role
    console.log("👤 Creating Client role...");
    const clientRole = await Role.create({
      name: "Client",
      description: "Access to client dashboard only",
      permissions: ["client-dashboard-read"],
      status: "Active",
    });

    // Hash passwords
    console.log("🔐 Hashing passwords...");
    const adminPassword = await bcrypt.hash("SuperAdminPass123!", 12);
    const clientPassword = await bcrypt.hash("ClientPass123!", 12);

    // Create Super Admin User
    console.log("👑 Creating Super Admin user...");
    await User.create({
      name: "Super Admin",
      email: "superadmin@acme.com",
      password: adminPassword,
      role: superAdminRole._id,
      status: "Active",
      avatar: "SA",
    });

    // Create Default Client User
    console.log("👤 Creating Client user...");
    await User.create({
      name: "Default Client",
      email: "client@company.com",
      password: clientPassword,
      role: clientRole._id,
      phone: "+1-123-456-7890",
      status: "Active",
      avatar: "DC",
    });

    console.log("\n🎉 SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=====================================");
    console.log("Super Admin: superadmin@acme.com / SuperAdminPass123!");
    console.log("Client: client@company.com / ClientPass123!");
    console.log("=====================================\n");

    process.exit(0);
  } catch (error) {
    console.error("💥 Seeding error:", error);
    process.exit(1);
  }
}

seed();
