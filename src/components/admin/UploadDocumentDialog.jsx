// File: src/components/admin/UploadDocumentDialog.jsx
"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X, Plus } from "lucide-react";

export function UploadDocumentDialog({
  open,
  onOpenChange,
  clientId,
  onUpload,
  isCompanyDocument = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    description: "",
  });

  const fileInputRef = useRef(null);

  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);

    if (newFiles.length === 0) return;

    const updatedFiles = newFiles.map((file) => ({
      file,
      name: file.name,
      id: Math.random().toString(36).substr(2, 9),
    }));

    setFiles((prev) => [...prev, ...updatedFiles]);

    // Reset file input to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleUpload = async () => {
    if (files.length === 0 || !formData.type) {
      alert("Please select at least one file and document type");
      return;
    }

    // ✅ CLIENT ID VALIDATION
    if (!clientId || clientId === "undefined") {
      alert(
        "Error: Client ID is missing. Please refresh the page and try again."
      );
      return;
    }

    try {
      setUploading(true);
      const uploadedDocuments = [];

      console.log("📤 Starting upload process for client:", clientId);

      // Upload each file sequentially
      for (const fileObj of files) {
        console.log("📄 Uploading file:", fileObj.name);

        // Cloudinary upload
        const uploadFormData = new FormData();
        uploadFormData.append("file", fileObj.file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success) {
          throw new Error(`Upload failed for ${fileObj.name}`);
        }

        console.log("☁️ Cloudinary upload successful:", uploadResult.fileUrl);

        // ✅ IMPROVED DOCUMENT DATA STRUCTURE
        const documentData = {
          name: fileObj.name,
          type: formData.type,
          category: formData.category || "General",
          description: formData.description || "",
          fileUrl: uploadResult.fileUrl,
          uploaded: new Date().toISOString(),
          size: `${(fileObj.file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadedBy: "Admin",
          // ✅ ACCESS CONTROL FIELDS
          accessLevel: "specific", // Always specific for client uploads
          specificClients: [clientId], // Only this client can access
          isCompanyDocument: isCompanyDocument,
          targetClient: clientId, // Mark as targeted for this client
        };

        console.log("💾 Saving document to database:", documentData);

        // ✅ OPTION 1: Save to main documents collection (RECOMMENDED)
        let saveResponse;
        let saveResult;

        try {
          // Try saving to main documents collection first
          saveResponse = await fetch("/api/documents", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(documentData),
          });

          saveResult = await saveResponse.json();

          if (!saveResponse.ok) {
            throw new Error(`Main save failed: ${saveResult.error}`);
          }

          console.log(
            "✅ Document saved to main collection:",
            saveResult.document
          );
        } catch (mainSaveError) {
          console.warn(
            "⚠️ Main save failed, trying client-specific API:",
            mainSaveError
          );

          // ✅ OPTION 2: Fallback to client-specific API
          saveResponse = await fetch(`/api/auth/client/${clientId}/documents`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(documentData),
          });

          saveResult = await saveResponse.json();

          if (!saveResponse.ok) {
            throw new Error(`Client save failed: ${saveResult.error}`);
          }

          console.log("✅ Document saved via client API:", saveResult.document);
        }

        uploadedDocuments.push(saveResult.document);
      }

      // ✅ IMPROVED REFRESH MECHANISM
      console.log("🔄 All documents uploaded, refreshing...");

      // Method 1: Call onUpload callback if provided
      if (typeof onUpload === "function") {
        onUpload(uploadedDocuments);
      }

      // Method 2: Force refresh after short delay
      setTimeout(() => {
        // Try to refresh the parent component's data
        if (typeof window !== "undefined") {
          // Dispatch custom event for refresh
          window.dispatchEvent(new CustomEvent("documentsUpdated"));

          // Also try to reload the page as fallback
          window.location.reload();
        }
      }, 700);

      onOpenChange(false);
      resetForm();

      // Success message
      alert(
        `✅ Successfully uploaded ${uploadedDocuments.length} document(s)! Documents will appear shortly.`
      );
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFiles([]);
    setFormData({
      type: "",
      category: "",
      description: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle dialog close
  const handleDialogClose = (open) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {clientId ? "Upload Document for Client" : "Upload Documents"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Improved File Upload Section */}
          <div className="space-y-2">
            <Label>Select Files *</Label>
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {files.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {files.length} file(s) selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFiles([]);
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {files.map((fileObj) => (
                      <div
                        key={fileObj.id}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm truncate max-w-[200px]">
                            {fileObj.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(fileObj.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop multiple files
                  </p>
                </div>
              )}

              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                id="file-upload"
                multiple
                onChange={handleFilesChange}
                accept=".pdf,.doc,.docx,.xlsx,.jpg,.jpeg,.png,.txt"
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer text-primary hover:underline inline-flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Plus className="h-4 w-4" />
                {files.length > 0 ? "Add More Files" : "Choose Files"}
              </Label>
            </div>
          </div>

          {/* Document Type - Required */}
          <div className="space-y-2">
            <Label htmlFor="type">Document Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agreement">Agreement</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="kyc">KYC Document</SelectItem>
                <SelectItem value="identity">Identity Proof</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              placeholder="e.g., Legal, Financial, Operational"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description for all documents"
              rows={3}
            />
          </div>

          {/* Upload Info */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> {files.length} file(s) will be uploaded.
              {clientId &&
                " This document will be visible only to this specific client."}
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => handleDialogClose(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || files.length === 0 || !formData.type}
            className="flex-1"
            permission="documents-create"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              `Upload ${files.length} File(s)`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
