import mongoose from "mongoose";

const SupportContactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
        },
        description: {
            type: String,
            required: [true, "Please provide a description"],
        },
        phone1: {
            type: String,
            required: [true, "Please provide a primary phone number"],
        },
        phone2: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.SupportContact || mongoose.model("SupportContact", SupportContactSchema);
