// File: src/app/api/upload/route.js
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import path from "path";
import { requirePermission } from "@/lib/auth";

// ✅ Load from .env.local in project root
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

export async function POST(request) {
  try {
    const denied = requirePermission(request, "documents-create");
    if (denied) return denied;
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ FIXED: Size check (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      return NextResponse.json(
        {
          error: `File too large. Max size: 10MB. Got: ${sizeMB}MB`,
        },
        { status: 400 }
      );
    }

    const uploadResult = await uploadToCloudinary(file);

    return NextResponse.json({
      success: true,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed: " + error.message },
      { status: 500 }
    );
  }
}

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "acme_security"); // YEH WOHI NAME HAI JO AAPNE PRESET BANAYA HAI

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cloudinary upload failed:", errorText);
    throw new Error("Cloudinary upload failed: " + errorText);
  }

  return response.json();
}