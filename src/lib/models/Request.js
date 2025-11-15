// File: src/lib/models/Request.js
import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
      index: true,
    },
    documentName: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "fulfilled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Request ||
  mongoose.model("Request", RequestSchema);
