import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    required: true,
    enum: [
      "agreement", "attendance", "bills", "salary-sheet", "pay-slip",
      "esi", "pf", "employee-details", "training", "night-checking", "paid-gst"
    ]
  },
  
  // File Details
  fileId: {
    type: String,
    required: true,
    unique: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: String,
  fileUrl: {
    type: String,
    required: true
  },
  size: Number,
  mimeType: String,
  
  // Access Control
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

   documentStartDate: {
    type: Date
  },
  documentEndDate: {
    type: Date
  },
  
  // Document validity/period description
  documentPeriod: {
    type: String
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  
  // Document Category
  category: {
    type: String,
    enum: ["client", "company", "general"],
    default: "client"
  },
  
  // For Client-specific documents
  targetClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  
  // For Multi-client documents (from Document Management)
  specificClients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  
  // For Company documents (visible to all clients)
  isCompanyDocument: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved"
  },
  tags: [String],
  
  // System
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
documentSchema.index({ targetClient: 1, uploadDate: -1 });
documentSchema.index({ specificClients: 1 });
documentSchema.index({ isCompanyDocument: 1 });
documentSchema.index({ category: 1 });

const Document = mongoose.models.Document || mongoose.model("Document", documentSchema);

export default Document;