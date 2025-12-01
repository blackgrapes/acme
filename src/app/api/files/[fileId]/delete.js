import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import dotenv from "dotenv";
import { requirePermission } from "@/lib/auth";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/uploads";

export async function DELETE(request, { params }) {
  try {
    const denied = requirePermission(request, "documents-delete");
    if (denied) return denied;

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

    // ✅ Delete file
    if (existsSync(filePath)) {
      await fs.unlink(filePath);
    }

    return NextResponse.json({ success: true, message: "File deleted" });
  } catch (error) {
    console.error("File deletion error:", error);
    return NextResponse.json(
      { error: "File deletion failed: " + error.message },
      { status: 500 }
    );
  }
}
