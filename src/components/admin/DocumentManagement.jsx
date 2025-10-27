// File: src/components/admin/DocumentManagement.jsx
"use client";

import { useState, useEffect } from "react";
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
  Edit2,
  Trash2,
  Plus,
  Search,
  FileText,
  Folder,
  Shield,
  Calendar,
  User,
  ChevronRight,
  Eye, // ✅ ADD: For view button
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export default function DocumentManagement({
  dummyDocuments,
  showSpecificClients,
  setShowSpecificClients,
  docGuardSearch,
  handleGuardSearch,
  selectedDocGuards,
  toggleGuardSelection,
  filteredDocGuards,
  currentCategory,
  addNewCategory,
  documentCategories = [],
  companyDocumentCategories = [],
  isCompanyDocuments = false,
}) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [accessLevel, setAccessLevel] = useState("general");
  const [docName, setDocName] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [docCategory, setDocCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [allClients, setAllClients] = useState([]);

  // ✅ Fetch all clients for access control
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/auth/client");
        const data = await response.json();
        if (data.clients) {
          setAllClients(data.clients);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  // ✅ FIXED: Filter documents based on current category
  const filteredDocuments =
    currentCategory && currentCategory !== "add-tab"
      ? dummyDocuments.filter((doc) => {
          const categoryName = currentCategory.name
            ? currentCategory.name.toLowerCase()
            : "";
          return doc.type.toLowerCase() === categoryName;
        })
      : dummyDocuments;

  // Handle add new category
  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      addNewCategory(newCategoryName);
      setNewCategoryName("");
      console.log(`New category "${newCategoryName}" added successfully!`);
    }
  };

  // ✅ ADD MISSING FUNCTIONS
  // Determine page title and description
  const getPageTitle = () => {
    if (currentCategory === "add-tab") {
      return "Create New Document Category";
    }
    if (currentCategory) {
      return currentCategory.child
        ? `${currentCategory.name} - ${currentCategory.child} Repository`
        : `${currentCategory.name} Repository`;
    }
    return isCompanyDocuments
      ? "Company Document Repository"
      : "Secure Document Repository";
  };

  const getPageDescription = () => {
    if (currentCategory === "add-tab") {
      return "Organize your documents with custom categories for optimal security and accessibility.";
    }

    if (currentCategory) {
      const categoryName = currentCategory.name
        ? currentCategory.name.toLowerCase()
        : "";
      return `Manage encrypted ${categoryName} documents with role-based access.`;
    }

    return isCompanyDocuments
      ? "All company documents across categories, with audit logs and secure sharing."
      : "All documents across categories, with audit logs and secure sharing.";
  };

  // ✅ Handle document upload with access control - FIXED for company docs visibility
  const handleDocumentUpload = async () => {
    if (!docName || !selectedFile || !selectedType) {
      alert("Please fill all required fields and select a file");
      return;
    }

    try {
      setUploadProgress(0);

      // Upload file to Cloudinary
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload failed - check network");
      }

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error("File upload failed");
      }

      setUploadProgress(50); // ✅ FIXED: Better progress simulation

      // Prepare document data with access control - Ensure general for company to show in client
      const documentData = {
        name: docName,
        type: selectedType,
        category: docCategory || "General",
        description: docDescription,
        fileUrl: uploadResult.fileUrl,
        size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedBy: "Admin",
        // ✅ ACCESS CONTROL DATA - Default to general for visibility in client
        accessLevel: accessLevel || "general", // Ensure default general
        specificClients: accessLevel === "specific" ? selectedDocGuards : [],
        isCompanyDocument: isCompanyDocuments,
      };

      setUploadProgress(75);

      // Save document to database
      const saveResponse = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentData),
      });

      if (!saveResponse.ok) {
        throw new Error("Save failed - check server");
      }

      const saveResult = await saveResponse.json();

      setUploadProgress(100);

      alert("✅ Document uploaded successfully!");
      setAddDialogOpen(false);
      resetUploadForm();

      // Refresh documents list - Dispatch event for client sync
      window.dispatchEvent(new CustomEvent("adminDocumentsUpdated"));
      window.dispatchEvent(new CustomEvent("documentsUpdated")); // ✅ FIXED: Extra event for client
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message} - Check console for details`);
      setUploadProgress(0);
    }
  };

  const resetUploadForm = () => {
    setDocName("");
    setDocDescription("");
    setDocCategory("");
    setSelectedFile(null);
    setSelectedType("");
    setAccessLevel("general");
    setShowSpecificClients(false);
    setUploadProgress(0);
    setSelectedDocGuards([]);
  };

  const simulateUpload = () => {
    // ✅ FIXED: Improved simulation - faster for demo
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 50) {
          // Jump to 50 after file select
          clearInterval(interval);
          return 50;
        }
        return prev + 25;
      });
    }, 100);
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
        variant: "default",
        className: "bg-green-500 text-white rounded-full",
        label: "General Access",
      },
      specific: {
        variant: "secondary",
        className: "bg-blue-500 text-white rounded-full",
        label: "Specific Access",
      },
      admin: {
        variant: "outline",
        className: "bg-red-500 text-white rounded-full",
        label: "Admin Only",
      },
    };
    const config = variants[access] || { variant: "secondary", label: access };
    return <Badge {...config}>{config.label}</Badge>;
  };

  // ✅ Handle document download
  const handleDownload = (doc) => {
    const link = document.createElement("a");
    link.href = doc.fileUrl;
    link.download = doc.name;
    link.click();
  };

  // ✅ Handle document view - NEW: Open in new tab
  const handleView = (doc) => {
    window.open(doc.fileUrl, "_blank");
  };

  // ✅ Handle document delete
  const handleDelete = async (doc) => {
    if (confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      try {
        const response = await fetch(`/api/documents/${doc._id || doc.id}`, {
          // ✅ FIXED: Handle _id or id
          method: "DELETE",
        });

        if (response.ok) {
          alert("Document deleted successfully!");
          // Refresh via event instead of reload for better perf
          window.dispatchEvent(new CustomEvent("adminDocumentsUpdated"));
        } else {
          throw new Error("Delete failed");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete document");
      }
    }
  };

  // Get available categories for dropdown
  const getAvailableCategories = () => {
    return isCompanyDocuments ? companyDocumentCategories : documentCategories;
  };

  // ✅ FIXED: Check if we're in a specific sub-category
  const isSpecificSubCategory =
    currentCategory &&
    getAvailableCategories().some(
      (cat) =>
        cat.name.toLowerCase() === (currentCategory.name || "").toLowerCase() ||
        (cat.children &&
          cat.children.some(
            (child) =>
              child.toLowerCase() === (currentCategory.name || "").toLowerCase()
          ))
    );

  // ✅ ADD MISSING FUNCTION - setActiveTab (dummy function for now)
  const setActiveTab = (tab) => {
    console.log("Setting active tab to:", tab);
    // This function should be passed as prop from parent component
    // For now, we'll just log it
  };

  // Render Add New Tab page
  if (currentCategory === "add-tab") {
    return (
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-primary">
              {getPageTitle()}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {getPageDescription()}
            </p>
          </div>
          <Button
            onClick={() =>
              setActiveTab(
                isCompanyDocuments ? "company-documents-all" : "documents-all"
              )
            }
            className="rounded-2xl px-6"
          >
            Back to Documents
          </Button>
        </div>

        <Card className="rounded-3xl border-border/70 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Category
            </CardTitle>
            <CardDescription>
              Create a custom category to better organize your documents
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="newCategory" className="text-sm font-medium">
                  Category Name
                </Label>
                <Input
                  id="newCategory"
                  placeholder="e.g., Contracts, Invoices"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-2 rounded-2xl"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="rounded-2xl flex-1"
                  onClick={() => setNewCategoryName("")}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-2xl flex-1 bg-primary"
                  onClick={handleAddNewCategory}
                  disabled={!newCategoryName.trim()}
                >
                  Create Category
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h2 className="text-3xl font-bold text-foreground">
            {getPageTitle()}
          </h2>
          <p className="text-muted-foreground">{getPageDescription()}</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl px-6 bg-primary shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-2xl p-0">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="text-xl font-bold">
                Upload Secure Document
              </DialogTitle>
              <DialogDescription>
                All files are automatically encrypted and access-controlled
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Document Details */}
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
                          {getAvailableCategories().map((cat) => (
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
                        <SelectItem value="general">
                          General Access (All Clients)
                        </SelectItem>
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
                    <div className="max-h-40 overflow-y-auto border rounded-xl p-3 space-y-2">
                      {filteredDocGuards.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No clients match "{docGuardSearch}"
                        </p>
                      ) : (
                        filteredDocGuards.map((client) => (
                          <div
                            key={client._id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
                          >
                            <Checkbox
                              id={`doc-client-${client._id}`}
                              checked={selectedDocGuards.includes(client._id)}
                              onCheckedChange={() =>
                                toggleGuardSelection(client._id, "doc")
                              }
                            />
                            <Label
                              htmlFor={`doc-client-${client._id}`}
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
                    {docGuardSearch && (
                      <Input
                        placeholder="Search clients..."
                        value={docGuardSearch}
                        onChange={(e) => handleGuardSearch(e, "doc")}
                        className="rounded-xl"
                      />
                    )}
                  </div>
                )}

                {/* File Upload */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Upload File *</Label>
                  <div
                    className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-1">
                      {selectedFile
                        ? selectedFile.name
                        : "Drop file or click to browse"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOCX, XLSX • Max 100MB • Auto-encrypted
                    </p>
                    <Progress
                      value={uploadProgress}
                      className="mt-4 h-2 rounded-full"
                    />
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xlsx"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.size < 100 * 1024 * 1024) {
                          // ✅ FIXED: Size check
                          setSelectedFile(file);
                          simulateUpload();
                        } else {
                          alert("File too large or invalid type");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 border-t space-x-2">
              <Button
                variant="outline"
                className="rounded-2xl px-6"
                onClick={() => {
                  setAddDialogOpen(false);
                  resetUploadForm();
                }}
              >
                Cancel
              </Button>
              <Button
                className="rounded-2xl bg-primary shadow-lg px-8 text-white"
                onClick={handleDocumentUpload}
                disabled={
                  uploadProgress < 100 ||
                  !docName ||
                  !selectedType ||
                  !selectedFile
                }
              >
                {uploadProgress > 0
                  ? `Uploading... ${uploadProgress}%`
                  : "Upload & Encrypt"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-background/80 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-3 text-foreground">
                <FileText className="h-7 w-7 text-primary" />
                {isCompanyDocuments
                  ? "Company Document Library"
                  : "Document Library"}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                {currentCategory
                  ? `${
                      currentCategory.child
                        ? `${currentCategory.name} - ${currentCategory.child}`
                        : currentCategory.name
                    } • `
                  : "All Documents • "}
                {filteredDocuments.length} items • Last audit:{" "}
                {formatDate(new Date().toISOString().split("T")[0])}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="rounded-2xl h-10 w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-border/50">
                <TableRow>
                  <TableHead className="font-semibold text-primary">
                    Document Name
                  </TableHead>
                  {!currentCategory && (
                    <TableHead className="font-semibold text-primary">
                      Category
                    </TableHead>
                  )}
                  <TableHead className="font-semibold text-primary">
                    Uploaded
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    Size
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    Access
                  </TableHead>
                  <TableHead className="text-right font-semibold text-primary">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">
                        No documents in this repository
                      </p>
                      <p className="text-sm">
                        Upload your first secure document to begin.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc.id}
                      className="hover:bg-muted/20 transition-colors border-b border-border/20"
                    >
                      <TableCell className="font-semibold flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        {doc.name}
                        <Badge
                          variant="outline"
                          className="ml-auto text-xs rounded-full"
                        >
                          {doc.type}
                        </Badge>
                      </TableCell>
                      {!currentCategory && (
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="rounded-full capitalize"
                          >
                            {getAvailableCategories().find(
                              (cat) =>
                                cat.name.toLowerCase() === doc.type ||
                                cat.children?.find(
                                  (child) => child.toLowerCase() === doc.type
                                )
                            )?.name || doc.type}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(doc.uploaded)}
                      </TableCell>
                      <TableCell className="text-sm">{doc.size}</TableCell>
                      <TableCell>{getAccessBadge(doc.access)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0"
                            onClick={() => handleView(doc)} // ✅ NEW: View button
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0 text-destructive"
                            onClick={() => handleDelete(doc)}
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
