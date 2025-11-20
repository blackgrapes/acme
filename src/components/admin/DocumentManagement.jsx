// File: src/components/admin/DocumentManagement.jsx - FIXED & OPTIMIZED
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Trash2,
  Plus,
  Search,
  FileText,
  Shield,
  Calendar,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

export default function DocumentManagement({
  dummyDocuments = [],
  showSpecificClients = false,
  setShowSpecificClients,
  docGuardSearch = "",
  handleGuardSearch,
  selectedDocGuards = [],
  toggleGuardSelection,
  filteredDocGuards = [],
  currentCategory = null,
  onCategoryChange,
  addNewCategory,
  documentCategories = [],
  companyDocumentCategories = [],
  isCompanyDocuments = false,
}) {
  const [selectedType, setSelectedType] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [accessLevel, setAccessLevel] = useState("general");
  const [docName, setDocName] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ OPTIMIZED: Memoized category handler
  const handleCategoryClick = useCallback(
    (category) => {
      if (onCategoryChange) {
        onCategoryChange(category);
      }
    },
    [onCategoryChange]
  );

  // ✅ OPTIMIZED: Memoized filtered documents
  const filteredDocuments = useMemo(() => {
    if (currentCategory && currentCategory.id && currentCategory.id !== "all") {
      return dummyDocuments.filter((doc) => doc.type === currentCategory.id);
    }
    return dummyDocuments;
  }, [currentCategory, dummyDocuments]);

  // ✅ OPTIMIZED: Memoized page title and description
  const { pageTitle, pageDescription } = useMemo(() => {
    let title = isCompanyDocuments
      ? "Company Document Repository"
      : "Secure Document Repository";
    let description = isCompanyDocuments
      ? "All company documents across categories, with audit logs and secure sharing."
      : "All documents across categories, with audit logs and secure sharing.";

    if (currentCategory) {
      if (currentCategory.id === "add-tab") {
        title = "Create New Document Category";
        description =
          "Organize your documents with custom categories for optimal security and accessibility.";
      } else if (currentCategory.name) {
        title = currentCategory.child
          ? `${currentCategory.name} - ${currentCategory.child} Repository`
          : `${currentCategory.name} Repository`;
        description = `Manage encrypted ${currentCategory.name.toLowerCase()} documents with role-based access.`;
      }
    }

    return { pageTitle: title, pageDescription: description };
  }, [currentCategory, isCompanyDocuments]);

  // ✅ OPTIMIZED: Memoized available categories
  const availableCategories = useMemo(() => {
    return isCompanyDocuments ? companyDocumentCategories : documentCategories;
  }, [isCompanyDocuments, companyDocumentCategories, documentCategories]);

  // ✅ OPTIMIZED: Document upload with better error handling
  const handleDocumentUpload = async () => {
    if (!docName || !selectedFile || !selectedType) {
      alert("Please fill all required fields and select a file");
      return;
    }

    try {
      setUploadProgress(10);

      // Simulate upload for demo (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUploadProgress(100);

      alert("✅ Document uploaded successfully!");
      setAddDialogOpen(false);
      resetUploadForm();

      // Refresh documents list
      window.dispatchEvent(new CustomEvent("documentsUpdated"));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
      setUploadProgress(0);
    }
  };

  const resetUploadForm = () => {
    setDocName("");
    setDocDescription("");
    setSelectedFile(null);
    setSelectedType("");
    setAccessLevel("general");
    setUploadProgress(0);
  };

  const simulateUpload = () => {
    setUploadProgress(30);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getAccessBadge = (access) => {
    const variants = {
      general: {
        className: "bg-green-500 text-white",
        label: "General Access",
      },
      specific: {
        className: "bg-blue-500 text-white",
        label: "Specific Access",
      },
      admin: { className: "bg-red-500 text-white", label: "Admin Only" },
    };
    const config = variants[access] || {
      className: "bg-gray-500 text-white",
      label: access,
    };
    return (
      <Badge className={`rounded-full ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  // ✅ OPTIMIZED: Document actions
  const handleDownload = (doc) => {
    if (doc.fileUrl) {
      const link = document.createElement("a");
      link.href = doc.fileUrl;
      link.download = doc.name;
      link.click();
    } else {
      alert("No file URL available for download");
    }
  };

  const handleView = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
    } else {
      alert("No file URL available for viewing");
    }
  };

  const handleDelete = async (doc) => {
    if (confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      try {
        // Simulate delete for demo
        await new Promise((resolve) => setTimeout(resolve, 500));
        alert("Document deleted successfully!");
        window.dispatchEvent(new CustomEvent("documentsUpdated"));
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete document");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h2 className="text-3xl font-bold text-foreground">{pageTitle}</h2>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl px-6 bg-primary shadow-lg" permission="documents-create">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Upload Secure Document
              </DialogTitle>
              <DialogDescription>
                All files are automatically encrypted and access-controlled
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="docName" className="text-sm font-semibold">
                    Document Name *
                  </Label>
                  <Input
                    id="docName"
                    placeholder="e.g., Q4 Financial Report.pdf"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="mt-2 rounded-2xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="docType" className="text-sm font-semibold">
                      Document Type *
                    </Label>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger className="mt-2 rounded-2xl">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          {availableCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="accessLevel"
                      className="text-sm font-semibold"
                    >
                      Access Level *
                    </Label>
                    <Select
                      value={accessLevel}
                      onValueChange={(value) => {
                        setAccessLevel(value);
                        if (value === "general") setShowSpecificClients(false);
                      }}
                    >
                      <SelectTrigger className="mt-2 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="general">General Access</SelectItem>
                        <SelectItem value="specific">
                          Specific Clients
                        </SelectItem>
                        <SelectItem value="admin">Admin Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {accessLevel === "specific" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Select Clients (Specific Access)
                    </Label>
                    <div className="max-h-32 overflow-y-auto border rounded-xl p-3 space-y-2">
                      {filteredDocGuards.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          No clients available
                        </p>
                      ) : (
                        filteredDocGuards.slice(0, 5).map((client) => (
                          <div
                            key={client._id || client.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
                          >
                            <Checkbox
                              id={`doc-client-${client._id || client.id}`}
                              checked={selectedDocGuards.includes(
                                client._id || client.id
                              )}
                              onCheckedChange={() =>
                                toggleGuardSelection(client._id || client.id)
                              }
                            />
                            <Label
                              htmlFor={`doc-client-${client._id || client.id}`}
                              className="text-sm cursor-pointer flex-1"
                            >
                              <div className="font-medium">{client.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {client.email}
                              </div>
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Upload File *</Label>
                  <div
                    className="border-2 border-dashed border-border/50 rounded-2xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      {selectedFile
                        ? selectedFile.name
                        : "Click to browse files"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, XLSX • Max 100MB
                    </p>
                    <Progress
                      value={uploadProgress}
                      className="mt-3 h-2 rounded-full"
                    />
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xlsx"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setSelectedFile(file);
                          simulateUpload();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="space-x-2">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDocumentUpload}
                disabled={!docName || !selectedType || !selectedFile}
                permission="documents-create"
              >
                {uploadProgress > 0
                  ? `Uploading... ${uploadProgress}%`
                  : "Upload Document"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-2xl border-border/70">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {isCompanyDocuments
                  ? "Company Document Library"
                  : "Document Library"}
              </CardTitle>
              <CardDescription>
                {currentCategory?.name
                  ? `${currentCategory.name} • `
                  : "All Documents • "}
                {filteredDocuments.length} items
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="rounded-xl h-9 w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  {!currentCategory && <TableHead>Category</TableHead>}
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No documents found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc.id || doc._id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          {doc.name}
                        </div>
                      </TableCell>
                      {!currentCategory && (
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell className="text-sm">
                        {formatDate(doc.uploaded)}
                      </TableCell>
                      <TableCell className="text-sm">{doc.size}</TableCell>
                      <TableCell>{getAccessBadge(doc.access)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(doc)}
                            permission="documents-read"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            permission="documents-read"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(doc)}
                            permission="documents-delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
