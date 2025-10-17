import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  permissions: [
    {
      type: String, // e.g., "dashboard-read", "clients-create"
    },
  ],
  users: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Role || mongoose.model("Role", roleSchema);
