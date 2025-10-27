import mongoose from "mongoose";

const WeProvideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    benefits: [
      {
        type: String,
        required: true,
      },
    ],
    img: {
      type: String, // Cloudinary URL
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    showOnHome: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.WeProvide ||
  mongoose.model("WeProvide", WeProvideSchema);
