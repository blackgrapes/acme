// File: src/components/admin/UploadDocumentDialog.jsx (UPDATED WITH SEARCH & FILTER)
"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Upload, X, Calendar, Search, ChevronLeft, ChevronRight, User, Building } from "lucide-react";

export function UploadDocumentDialog({
  open,
  onOpenChange,
  clientId,
  onUpload,
  isAdmin = false,
  isCompanyDocuments = false,
  allClients = [],
  currentCategory,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedClients, setSelectedClients] = useState([]);
  
  // Client search and filter
  const [clientSearch, setClientSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10; // Only show 10 clients at a time

  // Date fields
  const [dateOption, setDateOption] = useState("none");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customPeriod, setCustomPeriod] = useState("");

  // Define document categories based on page
  const clientDocumentCategories = [
    { id: "agreement", name: "Agreement" },
    { id: "attendance", name: "Attendance" },
    { id: "bills", name: "Bills" },
    { id: "salary-sheet", name: "Salary Sheet" },
    { id: "pay-slip", name: "Pay Slip" },
    { id: "esi", name: "ESI" },
    { id: "pf", name: "PF" },
    { id: "employee-details", name: "Employee Details" },
    { id: "training", name: "Training" },
    { id: "night-checking", name: "Night Checking" },
    { id: "paid-gst", name: "Paid GST" },
  ];

  const companyDocumentCategories = [
    { id: "msme", name: "MSME" },
    { id: "gst", name: "GST" },
    { id: "pasara", name: "Pasara" },
    { id: "pan", name: "PAN" },
    { id: "profile", name: "Profile" },
    { id: "bank-details", name: "Bank Details" },
  ];

  // Use appropriate categories
  const documentCategories = isCompanyDocuments
    ? companyDocumentCategories
    : clientDocumentCategories;

  // Filter and paginate clients on frontend (NO API CALL)
  const { filteredClients, totalPages } = useMemo(() => {
    if (!isAdmin || isCompanyDocuments) {
      return { filteredClients: [], totalPages: 0 };
    }

    // Filter clients based on search
    let filtered = allClients;
    if (clientSearch.trim()) {
      const searchTerm = clientSearch.toLowerCase();
      filtered = allClients.filter(client => 
        client.name?.toLowerCase().includes(searchTerm) ||
        client.companyName?.toLowerCase().includes(searchTerm) ||
        client.email?.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate pagination
    const totalPages = Math.ceil(filtered.length / clientsPerPage);
    
    // Get clients for current page
    const startIndex = (currentPage - 1) * clientsPerPage;
    const paginatedClients = filtered.slice(startIndex, startIndex + clientsPerPage);

    return {
      filteredClients: paginatedClients,
      totalPages,
      totalFiltered: filtered.length
    };
  }, [allClients, clientSearch, currentPage, isAdmin, isCompanyDocuments]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      // If currentCategory is not "all", set it as default
      if (currentCategory && currentCategory.id !== "all") {
        setType(currentCategory.id);
      }
      // Reset search and pagination
      setClientSearch("");
      setCurrentPage(1);
    }
  }, [open, currentCategory]);

  // Handle form reset
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleFileChange = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast.error("File size must be less than 100MB");
        e.target.value = "";
        return;
      }
      setFile(selectedFile);

      if (!name) {
        const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setName(fileNameWithoutExt);
      }
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setType("");
    setFile(null);
    setSelectedClients([]);
    setDateOption("none");
    setStartDate("");
    setEndDate("");
    setCustomPeriod("");
    setUploading(false);
    setProgress(0);
    setClientSearch("");
    setCurrentPage(1);

    const fileInput = document.getElementById("file");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    console.log("🔄 Starting upload process...");
    console.log("isAdmin:", isAdmin);
    console.log("isCompanyDocuments:", isCompanyDocuments);
    console.log("clientId:", clientId);

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (!type) {
      toast.error("Please select a document type");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a document name");
      return;
    }

    // For client documents in admin mode, need at least one client selected
    if (
      isAdmin &&
      !isCompanyDocuments &&
      selectedClients.length === 0 &&
      !clientId
    ) {
      toast.error("Please select at least one client");
      return;
    }

    // Validate dates
    if (dateOption === "single" && !startDate) {
      toast.error("Please select a start date");
      return;
    }

    if (dateOption === "range") {
      if (!startDate || !endDate) {
        toast.error("Please select both start and end dates");
        return;
      }
      if (new Date(startDate) > new Date(endDate)) {
        toast.error("Start date cannot be after end date");
        return;
      }
    }

    setUploading(true);
    setProgress(10);

    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        toast.error("Please login to upload documents");
        setUploading(false);
        return;
      }

      // Step 1: Upload file to server
      const formData = new FormData();
      formData.append("file", file);

      setProgress(30);

      console.log("📤 Uploading file to server...");

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setProgress(60);

      if (!uploadResponse.ok) {
        let errorMessage = "File upload failed";
        try {
          const errorData = await uploadResponse.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Upload failed with status: ${uploadResponse.status}`;
        }
        throw new Error(errorMessage);
      }

      const uploadData = await uploadResponse.json();
      console.log("✅ File uploaded successfully:", uploadData);

      setProgress(80);

      // Step 2: Create document record
      const documentData = {
        name: name || file.name,
        description,
        type,
        fileId: uploadData.fileId,
        fileName: uploadData.fileName,
        originalName: file.name,
        fileUrl: uploadData.fileUrl,
        size: uploadData.size,
        mimeType: uploadData.mimeType,
        documentStartDate: startDate || null,
        documentEndDate: endDate || null,
        documentPeriod: customPeriod || generateDocumentPeriod(),
        isCompanyDocument: isCompanyDocuments,
        category: isCompanyDocuments ? "company" : "client",
        status: "approved",
      };

      // Add client information for client documents
      if (!isCompanyDocuments) {
        if (selectedClients.length > 0) {
          documentData.specificClients = selectedClients;
        } else if (clientId) {
          documentData.targetClient = clientId;
        }
      }

      console.log("📝 Creating document record:", documentData);

      // CRITICAL CHANGE: Use different API based on where upload is coming from
      let apiUrl = "/api/documents"; // Default for admin/document management
      let method = "POST";

      // If uploading from client details page (isAdmin = false)
      if (!isAdmin && clientId) {
        apiUrl = `/api/auth/client/${clientId}/documents`;
        console.log("📤 Using CLIENT-SPECIFIC API:", apiUrl);
      }
      // If uploading company documents from admin
      else if (isAdmin && isCompanyDocuments) {
        apiUrl = "/api/documents";
        console.log("📤 Using GENERAL API for company documents");
      }
      // If uploading client documents from admin (document management page)
      else if (isAdmin && !isCompanyDocuments) {
        apiUrl = "/api/documents";
        console.log("📤 Using GENERAL API for admin client documents");
      }

      // Use appropriate API
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(documentData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        let errorMessage = `Failed to create document record (Status: ${response.status})`;

        try {
          // Check if response has content
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } else {
            // Try to get text response
            const text = await response.text();
            if (text) {
              errorMessage = text;
            }
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }

        console.error("❌ API error:", errorMessage);
        throw new Error(errorMessage);
      }

      // Try to parse successful response
      let result;
      try {
        result = await response.json();
        console.log("✅ Document created successfully:", result);
      } catch (parseError) {
        console.warn("Response was successful but not JSON:", parseError);
        result = { success: true };
      }

      setProgress(100);
      console.log("🎉 Upload complete!");

      if (onUpload) {
        onUpload();
      }

      toast.success("Document uploaded successfully!");

      setTimeout(() => {
        resetForm();
        onOpenChange(false);
      }, 1000);
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const generateDocumentPeriod = () => {
    if (dateOption === "none") return "";

    if (dateOption === "single" && startDate) {
      const date = new Date(startDate);
      return `From ${date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    }

    if (dateOption === "range" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return `${start.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} to ${end.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    }

    return customPeriod;
  };

  const handleClientToggle = (clientId) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredClientIds = filteredClients.map(client => client._id);
    const newSelected = [...selectedClients];
    
    filteredClientIds.forEach(id => {
      if (!newSelected.includes(id)) {
        newSelected.push(id);
      }
    });
    
    setSelectedClients(newSelected);
  };

  const handleDeselectAllFiltered = () => {
    const filteredClientIds = filteredClients.map(client => client._id);
    const newSelected = selectedClients.filter(id => !filteredClientIds.includes(id));
    setSelectedClients(newSelected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpload(e);
  };

  const handleDialogClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Calculate total filtered clients (for display)
  const totalFilteredClients = useMemo(() => {
    if (!isAdmin || isCompanyDocuments) return 0;
    const searchTerm = clientSearch.toLowerCase();
    return allClients.filter(client => 
      client.name?.toLowerCase().includes(searchTerm) ||
      client.companyName?.toLowerCase().includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm)
    ).length;
  }, [allClients, clientSearch, isAdmin, isCompanyDocuments]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCompanyDocuments
              ? "Upload Company Document"
              : "Upload Client Document"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection (only for client documents) */}
          {isAdmin && !isCompanyDocuments && (
            <div className="space-y-4">
              <Label>Select Clients *</Label>
              
              {/* Selected Clients Summary */}
              {selectedClients.length > 0 && (
                <div className="p-3 bg-primary/5 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Selected {selectedClients.length} client(s)
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedClients([])}
                      className="h -7 cursor-pointer px-2 text-xs"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Client Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients by name or company..."
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="pl-9"
                />
              </div>

              {/* Client List */}
              <div className="border rounded-md">
                {/* List Header with Bulk Actions */}
                <div className="flex items-center justify-between p-3 border-b">
                  <span className="text-sm text-muted-foreground">
                    {totalFilteredClients} client(s) found
                  </span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAllFiltered}
                      className="h-7 cursor-pointer px-2 text-xs"
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleDeselectAllFiltered}
                      className="h-7 cursor-pointer px-2 text-xs"
                    >
                      Deselect All
                    </Button>
                  </div>
                </div>
                
                {/* Clients List (Fixed Height with Scroll) */}
                <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                  {filteredClients.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <User className="h-8 w-8 mx-auto mb-2" />
                      <p>No clients found</p>
                      {clientSearch && (
                        <p className="text-sm mt-1">Try a different search term</p>
                      )}
                    </div>
                  ) : (
                    filteredClients.map((client) => (
                      <div
                        key={client._id}
                        className={`flex items-center justify-between p-2 rounded hover:bg-muted ${
                          selectedClients.includes(client._id) ? "bg-primary/10" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`client-${client._id}`}
                            checked={selectedClients.includes(client._id)}
                            onCheckedChange={() => handleClientToggle(client._id)}
                            disabled={uploading}
                          />
                          <div className="min-w-0 flex-1">
                            <label
                              htmlFor={`client-${client._id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span className="truncate">{client.name}</span>
                              </div>
                              {client.companyName && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                  <Building className="h-3 w-3" />
                                  <span className="truncate">{client.companyName}</span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {client.email && (
                            <div className="truncate max-w-[150px]">{client.email}</div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-3 border-t">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || uploading}
                        className="h-7 w-7 p-0 cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || uploading}
                        className="h-7 w-7 p-0 cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Validation Message */}
              {selectedClients.length === 0 ? (
                <p className="text-sm text-red-500">
                  Please select at least one client
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Selected {selectedClients.length} client(s)
                </p>
              )}
            </div>
          )}

          {/* Company documents message */}
          {isCompanyDocuments && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                This document will be visible to <strong>all clients</strong> automatically.
              </p>
            </div>
          )}

          {/* Document Details */}
          <div className="space-y-3">
            <Label htmlFor="name">Document Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter document name"
              required
              disabled={uploading}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description"
              rows={3}
              disabled={uploading}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="type">Document Type *</Label>
            <Select
              value={type}
              onValueChange={setType}
              required
              disabled={uploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Document Date/Period Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <Label className="text-lg">Document Period (Optional)</Label>
            </div>

            <RadioGroup
              value={dateOption}
              onValueChange={setDateOption}
              className="space-y-3"
              disabled={uploading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">No specific period</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Single date</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="range" />
                <Label htmlFor="range">Date range</Label>
              </div>
            </RadioGroup>

            {dateOption === "single" && (
              <div className="space-y-3 ml-6">
                <Label htmlFor="startDate">Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={uploading}
                />
              </div>
            )}

            {dateOption === "range" && (
              <div className="space-y-3 ml-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDateRange">Start Date</Label>
                    <Input
                      id="startDateRange"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      disabled={uploading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDateRange">End Date</Label>
                    <Input
                      id="endDateRange"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>
            )}

            {(dateOption === "single" || dateOption === "range") && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="customPeriod">
                  Period Description (Optional)
                </Label>
                <Input
                  id="customPeriod"
                  value={customPeriod}
                  onChange={(e) => setCustomPeriod(e.target.value)}
                  placeholder="e.g., January 2024, Q1 2024, etc."
                  disabled={uploading}
                />
                <p className="text-sm text-muted-foreground">
                  {generateDocumentPeriod() || "No period description"}
                </p>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="file">File *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {file ? (
                <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4 cursor-pointer" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-2">
                    Drag & drop your file here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Max file size: 100MB
                  </p>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => document.getElementById("file").click()}
                    disabled={uploading}
                  >
                    Browse Files
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              disabled={uploading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button className="cursor-pointer" type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}