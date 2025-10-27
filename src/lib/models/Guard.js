// src/lib/models/Guard.js -

import mongoose from "mongoose";

const guardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Guard name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Security Guard",
        "Security Officer",
        "Personal Security Officer",
        "Security Supervisor",
        "Lady Security Guard",
        "Security Gunmen",
        "Ex-men Security Guard & Bodyguards",
      ],
      required: true,
    },
    guardId: {
      type: String,
      required: true,
      unique: true,
    },
    experience: {
      type: String, // Can be "5 years" or similar
      required: true,
    },
    salary: {
      type: String, // "₹35,000/month" format
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave", "Assigned", "Available"],
      default: "Available",
    },
    location: {
      type: String,
      required: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    specialization: [
      {
        type: String,
      },
    ],
    certifications: [
      {
        type: String,
      },
    ],
    currentAssignment: {
      clientId: mongoose.Schema.Types.ObjectId,
      clientName: String,
      clientEmail: String,
      clientPhone: String,
      organization: String,
      assignmentType: String,
      startDate: Date,
      endDate: Date,
      location: String,
      status: String,
    },
    performance: {
      totalAssignments: {
        type: Number,
        default: 0,
      },
      completedAssignments: {
        type: Number,
        default: 0,
      },
      successRate: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        default: 0,
      },
      clientSatisfaction: {
        type: Number,
        default: 0,
      },
    },
    documents: [
      {
        name: String,
        type: String,
        uploaded: Date,
        size: String,
        category: String,
        description: String,
        uploadedBy: String,
        fileUrl: String,
      },
    ],
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate guard ID before saving
guardSchema.pre("save", async function (next) {
  if (this.isNew) {
    const Guard = this.constructor;
    const count = await Guard.countDocuments();
    this.guardId = `GUA-${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

export default mongoose.models.Guard || mongoose.model("Guard", guardSchema);
