import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { requirePermission } from "@/lib/auth";

// Development vs Production paths
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const UPLOAD_BASE_PATH = IS_DEVELOPMENT 
  ? path.join(process.cwd(), "public", "uploads")
  : "/var/www/acme/uploads";

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    if (!existsSync(UPLOAD_BASE_PATH)) {
      await mkdir(UPLOAD_BASE_PATH, { recursive: true });
      console.log(`✅ Created upload directory: ${UPLOAD_BASE_PATH}`);
    }
  } catch (error) {
    console.error("❌ Error creating upload directory:", error);
    throw error;
  }
}

// Allowed file types and sizes
const ALLOWED_MIME_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/zip': '.zip',
  'text/plain': '.txt',
  'text/csv': '.csv',
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await ensureUploadDir();
    
    const formData = await request.formData();
    const file = formData.get("file");
    const clientId = formData.get("clientId") || null;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES[file.type]) {
      return NextResponse.json(
        { error: `File type not allowed: ${file.type}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max size: ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Generate unique file ID
    const fileId = uuidv4();
    const fileExtension = ALLOWED_MIME_TYPES[file.type];
    const fileName = `${fileId}${fileExtension}`;
    const filePath = path.join(UPLOAD_BASE_PATH, fileName);

    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Generate file URL
    const fileUrl = IS_DEVELOPMENT
      ? `/uploads/${fileName}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/uploads/${fileName}`;

    console.log("✅ File uploaded successfully:", {
      fileId,
      originalName: file.name,
      size: file.size,
      path: filePath,
      url: fileUrl
    });

    return NextResponse.json({
      success: true,
      fileId,
      fileName: file.name,
      fileUrl,
      size: file.size,
      mimeType: file.type,
      clientId
    });

  } catch (error) {
    console.error("❌ File upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error.message },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to list files (for admin)
export async function GET() {
  try {
    await ensureUploadDir();
    
    const files = await fs.readdir(UPLOAD_BASE_PATH);
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const stat = await fs.stat(path.join(UPLOAD_BASE_PATH, file));
        return {
          name: file,
          size: stat.size,
          modified: stat.mtime
        };
      })
    );

    return NextResponse.json({
      success: true,
      uploadDir: UPLOAD_BASE_PATH,
      totalFiles: files.length,
      files: fileStats
    });
  } catch (error) {
    console.error("❌ Error reading upload directory:", error);
    return NextResponse.json(
      { error: "Failed to read upload directory" },
      { status: 500 }
    );
  }
}