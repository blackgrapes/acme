import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/uploads";

/**
 * Get file path from fileId
 */
export async function getFilePath(fileId) {
  const files = await fs.readdir(UPLOAD_DIR);
  const fileMatch = files.find((f) => f.startsWith(fileId + "."));
  return fileMatch ? path.join(UPLOAD_DIR, fileMatch) : null;
}

/**
 * Check if file exists
 */
export async function fileExists(fileId) {
  try {
    const filePath = await getFilePath(fileId);
    return filePath ? existsSync(filePath) : false;
  } catch {
    return false;
  }
}

/**
 * Get file size
 */
export async function getFileSize(fileId) {
  try {
    const filePath = await getFilePath(fileId);
    if (!filePath) return null;

    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return null;
  }
}

/**
 * Get total upload directory size
 */
export async function getTotalUploadSize() {
  try {
    if (!existsSync(UPLOAD_DIR)) return 0;

    const files = await fs.readdir(UPLOAD_DIR);
    let totalSize = 0;

    for (const file of files) {
      const filePath = path.join(UPLOAD_DIR, file);
      const stats = await fs.stat(filePath);
      totalSize += stats.size;
    }

    return totalSize;
  } catch {
    return 0;
  }
}

/**
 * Format bytes to readable size
 */
export function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * List all files in upload directory
 */
export async function listUploadedFiles() {
  try {
    if (!existsSync(UPLOAD_DIR)) return [];

    const files = await fs.readdir(UPLOAD_DIR);
    const fileList = [];

    for (const file of files) {
      const filePath = path.join(UPLOAD_DIR, file);
      const stats = await fs.stat(filePath);
      const fileId = file.split(".")[0];

      fileList.push({
        fileId,
        fileName: file,
        size: stats.size,
        sizeFormatted: formatBytes(stats.size),
        uploadedAt: stats.birthtime,
        modifiedAt: stats.mtime,
      });
    }

    return fileList.sort((a, b) => b.uploadedAt - a.uploadedAt);
  } catch {
    return [];
  }
}

/**
 * Delete file by fileId
 */
export async function deleteFile(fileId) {
  try {
    const filePath = await getFilePath(fileId);
    if (!filePath) throw new Error("File not found");

    // Security check: ensure path is within UPLOAD_DIR
    if (!filePath.startsWith(UPLOAD_DIR)) {
      throw new Error("Access denied");
    }

    if (existsSync(filePath)) {
      await fs.unlink(filePath);
    }

    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

/**
 * Create upload directory if it doesn't exist
 */
export async function ensureUploadDir() {
  try {
    if (!existsSync(UPLOAD_DIR)) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
    return true;
  } catch {
    return false;
  }
}
