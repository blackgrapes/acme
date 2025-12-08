// File: src/lib/models/DocumentRequest.js
import mongoose from "mongoose";

const documentRequestSchema = new mongoose.Schema(
  {
    // Client Information
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    clientCompany: {
      type: String,
      default: "",
    },

    // Document Information
    documentName: {
      type: String,
      required: true,
      trim: true,
    },
    documentType: {
      type: String,
      required: true,
      enum: [
        "agreement",
        "attendance",
        "bills",
        "salary-sheet",
        "pay-slip",
        "esi",
        "pf",
        "employee-details",
        "training",
        "night-checking",
        "paid-gst",
        "msme",
        "gst",
        "pasara",
        "pan",
        "profile",
        "bank-details",
        "license",
        "certificate",
        "contract",
        "invoice",
        "report",
        "other"
      ],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Request Details
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    requiredBy: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "rejected", "cancelled"],
      default: "pending",
    },

    // Admin Information
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    adminNotes: {
      type: String,
      default: "",
    },
    response: {
      type: String,
      default: "",
    },

    // System Fields
    requestDate: {
      type: Date,
      default: Date.now,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        name: String,
        url: String,
        size: Number,
        uploadedAt: Date,
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
documentRequestSchema.index({ clientId: 1, status: 1 });
documentRequestSchema.index({ status: 1, requestDate: -1 });
documentRequestSchema.index({ documentType: 1 });
documentRequestSchema.index({ priority: 1 });

// Virtual for formatted status
documentRequestSchema.virtual("statusFormatted").get(function () {
  const statusMap = {
    pending: { label: "Pending", color: "yellow" },
    "in-progress": { label: "In Progress", color: "blue" },
    completed: { label: "Completed", color: "green" },
    rejected: { label: "Rejected", color: "red" },
    cancelled: { label: "Cancelled", color: "gray" },
  };
  return statusMap[this.status] || { label: this.status, color: "gray" };
});

// Virtual for formatted priority
documentRequestSchema.virtual("priorityFormatted").get(function () {
  const priorityMap = {
    low: { label: "Low", color: "gray" },
    medium: { label: "Medium", color: "blue" },
    high: { label: "High", color: "orange" },
    urgent: { label: "Urgent", color: "red" },
  };
  return priorityMap[this.priority] || { label: this.priority, color: "gray" };
});

const DocumentRequest = mongoose.models.DocumentRequest || mongoose.model("DocumentRequest", documentRequestSchema);

export default DocumentRequest;