// File: /src/app/api/upload/route.js
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { requirePermission, getCurrentUser } from "@/lib/auth";

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
  'application/json': '.json', // Added to support JSON uploads
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// Helper function to check user permissions
async function checkUploadPermissions(request, requiredPermission) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
        status: 401
      };
    }

    // Admin always has access
    if (user.role?.name === "admin") {
      return {
        success: true,
        user
      };
    }

    // Check if user has the required permission
    // Note: Your auth.js mein requirePermission function ko update karna hoga
    // agar wo user object return karta hai toh

    // Temporary check - use requirePermission directly
    const permissionResult = requirePermission(request, requiredPermission);
    if (permissionResult) {
      // permissionResult is a NextResponse if permission is denied
      return {
        success: false,
        error: "Insufficient permissions",
        status: 403
      };
    }

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error("Permission check error:", error);
    return {
      success: false,
      error: "Internal server error",
      status: 500
    };
  }
}

export async function POST(request) {
  try {
    // Check permission for upload
    // Since upload can be used in multiple contexts, we can use a generic permission
    // or check based on the context (clientId parameter)
    const permissionCheck = await checkUploadPermissions(request, "frontend-create");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.status }
      );
    }

    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get("file");
    const clientId = formData.get("clientId") || null;
    const context = formData.get("context") || "general"; // frontend, document, profile, etc.

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
      url: fileUrl,
      uploadedBy: permissionCheck.user?.email || "Unknown",
      context
    });

    return NextResponse.json({
      success: true,
      fileId,
      fileName: file.name,
      fileUrl,
      size: file.size,
      mimeType: file.type,
      clientId,
      context,
      uploadedBy: permissionCheck.user?.email
    });

  } catch (error) {
    console.error("❌ File upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Check permission for viewing uploads
    const permissionCheck = await checkUploadPermissions(request, "frontend-read");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.status }
      );
    }

    await ensureUploadDir();

    // Optional query parameters for filtering
    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    const files = await fs.readdir(UPLOAD_BASE_PATH);

    // Get file stats and filter if needed
    const fileStats = await Promise.all(
      files.slice(skip, skip + limit).map(async (file) => {
        const stat = await fs.stat(path.join(UPLOAD_BASE_PATH, file));
        return {
          name: file,
          size: stat.size,
          modified: stat.mtime,
          created: stat.birthtime,
          isDirectory: stat.isDirectory()
        };
      })
    );

    // Filter out directories and sort by modified date (newest first)
    const fileList = fileStats
      .filter(file => !file.isDirectory)
      .sort((a, b) => new Date(b.modified) - new Date(a.modified));

    // Get total count
    const allFiles = await fs.readdir(UPLOAD_BASE_PATH);
    const allFileStats = await Promise.all(
      allFiles.map(async (file) => {
        const stat = await fs.stat(path.join(UPLOAD_BASE_PATH, file));
        return stat.isDirectory();
      })
    );
    const totalFiles = allFileStats.filter(isDir => !isDir).length;

    return NextResponse.json({
      success: true,
      uploadDir: UPLOAD_BASE_PATH,
      totalFiles,
      showing: fileList.length,
      limit,
      skip,
      files: fileList
    });
  } catch (error) {
    console.error("❌ Error reading upload directory:", error);
    return NextResponse.json(
      { error: "Failed to read upload directory" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a file
export async function DELETE(request) {
  try {
    // Check permission for deleting files
    const permissionCheck = await checkUploadPermissions(request, "frontend-delete");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json(
        { error: "File name is required" },
        { status: 400 }
      );
    }

    // Prevent directory traversal attacks
    const sanitizedFileName = path.basename(fileName);
    const filePath = path.join(UPLOAD_BASE_PATH, sanitizedFileName);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Delete the file
    await fs.unlink(filePath);

    console.log("✅ File deleted successfully:", {
      fileName: sanitizedFileName,
      deletedBy: permissionCheck.user?.email || "Unknown"
    });

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      fileName: sanitizedFileName
    });

  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file", details: error.message },
      { status: 500 }
    );
  }
}