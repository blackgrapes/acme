import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/uploads";

export async function GET(request, { params }) {
  try {
    const { fileId } = params;

    // ✅ Security: Validate fileId format (UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(fileId)) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
    }

    // ✅ Find file with any extension
    const files = await fs.readdir(UPLOAD_DIR);
    const fileMatch = files.find((f) => f.startsWith(fileId + "."));

    if (!fileMatch) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const filePath = path.join(UPLOAD_DIR, fileMatch);

    // ✅ Security: Prevent directory traversal
    if (!filePath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // ✅ Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // ✅ Read file and return
    const fileBuffer = await fs.readFile(filePath);
    const mimeType = getMimeType(fileMatch);

    // ✅ Set cache headers for static files (30 days)
    const response = new NextResponse(fileBuffer);
    response.headers.set("Content-Type", mimeType);
    response.headers.set("Cache-Control", "public, max-age=2592000");
    response.headers.set(
      "Content-Disposition",
      `inline; filename="${fileMatch}"`
    );

    return response;
  } catch (error) {
    console.error("File retrieval error:", error);
    return NextResponse.json(
      { error: "File retrieval failed: " + error.message },
      { status: 500 }
    );
  }
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".mp4": "video/mp4",
    ".mpeg": "video/mpeg",
  };

  return mimeTypes[ext] || "application/octet-stream";
}
