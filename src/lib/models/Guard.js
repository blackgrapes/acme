// File: src/lib/models/Guard.js

import mongoose from "mongoose";

// Update the guardSchema to simplify it:
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
    phone2: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    // Manual code number input by user, used as guardId
    codeNumber: {
      type: String,
      trim: true,
    },
    guardId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave", "Assigned", "Available"],
      default: "Available",
    },
    // location: { type: String }, // Removed as per request
    joinDate: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
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
    documents: [
      {
        name: String,
        type: {
          type: String,
          default: "employee-details",
        },
        uploaded: Date,
        size: Number,
        category: String,
        description: String,
        uploadedBy: String,
        fileUrl: String,
        originalName: String,
        fileName: String,
        fileId: String,
        mimeType: String,
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

// Remove the specialization, certifications, performance fields
// Remove the experience, salary, dateOfBirth, emergencyContact, gender, type fields

// Check if the model is already defined to prevent OverwriteModelError
const Guard = mongoose.models.Guard || mongoose.model("Guard", guardSchema);
export default Guard; 
