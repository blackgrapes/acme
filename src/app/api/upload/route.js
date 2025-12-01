import { NextResponse } from "next/server";
import dotenv from "dotenv";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { requirePermission } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

// ✅ Load from .env.local in project root
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// ✅ Upload directory configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/uploads";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB max
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "video/mp4",
  "video/mpeg",
];

export async function POST(request) {
  try {
    const denied = requirePermission(request, "documents-create");
    if (denied) return denied;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ File type validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `File type not allowed. Allowed types: ${ALLOWED_TYPES.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // ✅ Size check
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      return NextResponse.json(
        {
          error: `File too large. Max size: 50MB. Got: ${sizeMB}MB`,
        },
        { status: 400 }
      );
    }

    const uploadResult = await saveFileToVPS(file);

    return NextResponse.json({
      success: true,
      fileUrl: uploadResult.fileUrl,
      fileName: uploadResult.fileName,
      fileId: uploadResult.fileId,
      size: uploadResult.size,
      uploadedAt: uploadResult.uploadedAt,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed: " + error.message },
      { status: 500 }
    );
  }
}

async function saveFileToVPS(file) {
  try {
    // ✅ Create upload directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }

    // ✅ Generate unique filename
    const fileId = uuidv4();
    const ext = path.extname(file.name);
    const fileName = `${fileId}${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // ✅ Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // ✅ Generate file URL based on environment
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const fileUrl = `${baseUrl}/api/files/${fileId}`;

    return {
      fileUrl,
      fileName: file.name,
      fileId,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error saving file to VPS:", error);
    throw error;
  }
}