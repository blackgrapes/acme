// src/lib/models/User.js - UPDATED
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
      default: "Active", // ✅ Direct "Active" कर दिया
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
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
