// src/lib/models/User.js - UPDATED WITH CONDITIONAL DOCUMENTS
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
    phone: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Active",
    },
    lastLogin: {
      type: Date,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    avatar: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
    },
    address: {
      type: String,
    },
    securityPlan: {
      type: String,
    },
    serviceDuration: {
      from: { type: Date },
      to: { type: Date },
    },
    assignedGuards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // ✅ CONDITIONAL DOCUMENTS FIELD - Only for Client role
    documents: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            required: true,
          },
          category: {
            type: String,
            default: "General",
          },
          description: {
            type: String,
            default: "",
          },
          fileUrl: {
            type: String,
            required: true,
          },
          uploaded: {
            type: Date,
            default: Date.now,
          },
          size: {
            type: String,
            default: "0 MB",
          },
          uploadedBy: {
            type: String,
            default: "Admin",
          },
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
          },
        },
      ],
      default: undefined, // ✅ Important: undefined means field won't exist for non-clients
    },
  },
  { timestamps: true }
);

// ✅ Middleware: Only add documents field for Client role
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const Role = mongoose.model("Role");
      const role = await Role.findById(this.role);

      if (role && role.name === "Client") {
        // Only initialize documents array for Client role
        if (!this.documents) {
          this.documents = [];
        }
      } else {
        // For non-client roles, don't create documents field
        this.documents = undefined;
      }
    } catch (error) {
      console.error("Error checking role in pre-save:", error);
    }
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", userSchema);
