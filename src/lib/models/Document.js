// File: src/lib/models/Document.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
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
    // ✅ ACCESS CONTROL FIELDS
    accessLevel: {
      type: String,
      enum: ["general", "specific", "admin"],
      default: "general",
    },
    specificClients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // ✅ For company documents
    isCompanyDocument: {
      type: Boolean,
      default: false,
    },
    // ✅ If uploaded from client details page
    targetClient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Document ||
  mongoose.model("Document", documentSchema);
