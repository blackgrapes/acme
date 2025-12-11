// src/lib/models/User.js - COMPLETELY FIXED SCHEMA
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    // Contact Information
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    alternatePhone: {
      type: String,
      trim: true,
      default: "",
    },

    // Client Specific Information
    clientType: {
      type: String,
      enum: [
        "Individual",
        "Corporate",
        "Government",
        "Residential",
        "Commercial",
      ],
      default: "Corporate",
    },

    // Company/Organization Details
    companyName: {
      type: String,
      trim: true,
      default: "",
    },
    designation: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ FIXED: Address as Object (not Mixed)
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "India" },
    },

    // Service Information
    securityPlan: {
      type: String,
      enum: ["Basic", "Standard", "Premium", "Enterprise", "Custom"],
      default: "Standard",
    },
    serviceType: [
      {
        type: String,
        enum: [
          "Static Guarding",
          "Patrolling",
          "CCTV Monitoring",
          "Event Security",
          "VIP Protection",
          "Asset Protection",
        ],
      },
    ],

    // Contract Information
    contractNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    contractStartDate: {
      type: Date,
    },
    contractEndDate: {
      type: Date,
    },
    contractValue: {
      type: Number,
      min: 0,
    },

    // Site/Location Information
    sites: [
      {
        siteName: { type: String, default: "" },
        address: { type: String, default: "" },
        contactPerson: { type: String, default: "" },
        contactNumber: { type: String, default: "" },
        shiftTimings: {
          start: { type: String, default: "" },
          end: { type: String, default: "" },
        },
        isActive: { type: Boolean, default: true },
      },
    ],

    // Emergency Contacts
    emergencyContacts: [
      {
        name: { type: String, default: "" },
        relationship: { type: String, default: "" },
        phone: { type: String, default: "" },
        priority: { type: Number, min: 1, max: 3, default: 1 },
      },
    ],

    // Security Requirements
    requiredGuards: {
      male: { type: Number, default: 0 },
      female: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },

    // Equipment Requirements
    equipmentRequired: [
      {
        type: String,
        enum: [
          "Walkie Talkie",
          "CCTV",
          "Metal Detector",
          "Fire Extinguisher",
          "First Aid",
          "Vehicle",
        ],
      },
    ],

    // Assigned Personnel
    assignedGuards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guard",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Status & Tracking
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending", "Suspended", "Disabled"],
      default: "Active",
    },

    // Login Information
    lastLogin: {
      type: Date,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },

    // Profile Information
    avatar: {
      type: String,
      default: "",
    },

    // Documents - CONDITIONAL FIELD
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      }
    ],

    // Notes
    notes: {
      type: String,
      maxLength: 500,
      default: "",
    },

    // Audit Fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      getters: true,
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return this.name;
});

// Virtual for address string
userSchema.virtual("addressString").get(function () {
  if (!this.address) return "";

  const { street, city, state, postalCode, country } = this.address;
  const parts = [];
  if (street) parts.push(street);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (postalCode) parts.push(postalCode);
  if (country && country !== "India") parts.push(country);

  return parts.join(", ");
});

// Virtual for contract status
userSchema.virtual("contractStatus").get(function () {
  if (!this.contractEndDate) return "No Contract";
  const today = new Date();
  const endDate = new Date(this.contractEndDate);
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Expired";
  if (diffDays <= 30) return "Expiring Soon";
  return "Active";
});

// Middleware: Only add documents field for Client role
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("role")) {
    try {
      const Role = mongoose.model("Role");
      const role = await Role.findById(this.role);

      if (role && role.name === "Client") {
        // Initialize client-specific fields
        if (!this.documents) {
          this.documents = [];
        }
        if (!this.contractNumber && this.companyName) {
          // Generate contract number
          const prefix =
            this.companyName.substring(0, 3).toUpperCase() || "CNT";
          const random = Math.floor(1000 + Math.random() * 9000);
          const year = new Date().getFullYear();
          this.contractNumber = `CNT-${prefix}-${year}-${random}`;
        }
      } else {
        // For non-client roles, don't create client-specific fields
        this.documents = [];
        // Clear client-specific fields
        this.contractNumber = undefined;
        this.clientType = undefined;
        this.companyName = undefined;
        this.address = undefined;
      }
    } catch (error) {
      console.error("Error checking role in pre-save:", error);
    }
  }
  next();
});

// Indexes for better query performance
// email index is already defined in the schema with unique: true
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ companyName: 1 });
userSchema.index({ joinDate: -1 });
// contractNumber index is already defined in the schema with sparse: true
userSchema.index({ documents: 1 });
export default mongoose.models.User || mongoose.model("User", userSchema);
