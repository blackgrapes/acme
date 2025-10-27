import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    video: {
      type: String, // Cloudinary URL for video testimonials
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

export default mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);
