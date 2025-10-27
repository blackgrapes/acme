import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      enum: ["events", "training", "patrols", "team"],
    },
    mediaFiles: [
      {
        type: String, // Cloudinary URLs
      },
    ],
    caption: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    showOnHome: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Gallery ||
  mongoose.model("Gallery", GallerySchema);
