// File: src/components/admin/DocumentManagement.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Trash2, Plus, Search, FileText, Eye, Calendar, User, RefreshCw } from "lucide-react";
import { UploadDocumentDialog } from "./UploadDocumentDialog";
import { toast } from "sonner";

export default function DocumentManagement({
  documents = [],
  currentCategory = null,
  onCategoryChange,
  documentCategories = [],
  allClients = [],
  loading = false,
  onRefresh,
  isCompanyDocuments = false,
}) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
 
  // Filter documents based on search and filters
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        (doc.targetClient?.name?.toLowerCase().includes(query)) ||
        (doc.specificClients?.some(client => client.name?.toLowerCase().includes(query)))
      );
    }

    // Document type filter
    if (documentTypeFilter !== "all") {
      filtered = filtered.filter(doc => doc.type === documentTypeFilter);
    }

    // Period filter
    if (periodFilter.trim()) {
      const query = periodFilter.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.documentPeriod?.toLowerCase().includes(query) ||
        formatDateOnly(doc.documentStartDate)?.toLowerCase().includes(query) ||
        formatDateOnly(doc.documentEndDate)?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    return filtered;
  }, [documents, searchQuery, documentTypeFilter, periodFilter, statusFilter]);

  // Check if filters are active
  const isFilterActive = useMemo(() => {
    return documentTypeFilter !== "all" || periodFilter !== "" || statusFilter !== "all";
  }, [documentTypeFilter, periodFilter, statusFilter]);

  // Clear all filters
  const clearFilters = () => {
    setDocumentTypeFilter("all");
    setPeriodFilter("");
    setStatusFilter("all");
    setSearchQuery("");
  };

  // Handle document upload success
  const handleUploadSuccess = () => {
    toast.success("Document uploaded successfully!");
    if (onRefresh) {
      onRefresh();
    }
  };

  // Document actions
  const handleView = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
    } else {
      toast.error("No file URL available for viewing");
    }
  };

  const handleDownload = async (doc) => {
    try {
      if (doc.fileUrl) {
        // Extract file extension
        const fileExtension = doc.originalName?.split(".").pop() || "pdf";
        
        // Get document type name
        const docTypeName = getDocumentTypeName(doc.type);
        
        // Format date for filename
        let dateForFilename = "";
        if (doc.documentStartDate) {
          const date = new Date(doc.documentStartDate);
          dateForFilename = date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }).replace(/ /g, "-").replace(/,/g, "");
        }

        // Clean document name for filename
        const cleanDocName = (doc.name || "Document")
          .replace(/[^a-zA-Z0-9-_]/g, "_")
          .replace(/_+/g, "_")
          .substring(0, 50);

        // Construct filename
        let fileName = `${cleanDocName}`;
        if (docTypeName) {
          fileName += `_${docTypeName.replace(/ /g, "_")}`;
        }
        if (dateForFilename) {
          fileName += `_${dateForFilename}`;
        }
        fileName += `.${fileExtension}`;

        const link = document.createElement("a");
        link.href = doc.fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(`Downloading: ${fileName}`);
      } else {
        toast.error("No file URL available for download");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  const handleDelete = async (doc) => {
    if (!confirm(`Are you sure you want to delete "${doc.name}"?`)) return;

    try {
      const response = await fetch(`/api/documents/${doc.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Document deleted successfully");
        if (onRefresh) {
          onRefresh();
        }
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to delete document");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    }
  };

  // Format date functions
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Not set";
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Not set";
    }
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Not set";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Not set";
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get document type name
  const getDocumentTypeName = (typeId) => {
    const category = documentCategories.find(cat => cat.id === typeId);
    return category ? category.name : typeId;
  };

  // Get client names for display
  const getClientDisplay = (doc) => {
    if (doc.isCompanyDocument) {
      return <Badge variant="secondary">Company</Badge>;
    }
    
    if (doc.specificClients && doc.specificClients.length > 0) {
      if (doc.specificClients.length === 1) {
        return <span className="text-sm">{doc.specificClients[0].name}</span>;
      } else {
        return (
          <div className="flex items-center gap-1">
            <span className="text-sm">{doc.specificClients[0].name}</span>
            <Badge variant="outline" className="text-xs">
              +{doc.specificClients.length - 1} more
            </Badge>
          </div>
        );
      }
    }
    
    if (doc.targetClient) {
      return <span className="text-sm">{doc.targetClient.name}</span>;
    }
    
    return <span className="text-sm text-muted-foreground">Not assigned</span>;
  };

  // Get document period display
  const getDocumentPeriod = (doc) => {
    if (doc.documentStartDate && doc.documentEndDate) {
      const start = formatDateOnly(doc.documentStartDate);
      const end = formatDateOnly(doc.documentEndDate);
      return `${start} - ${end}`;
    } else if (doc.documentStartDate) {
      return `From ${formatDateOnly(doc.documentStartDate)}`;
    } else if (doc.documentPeriod) {
      return doc.documentPeriod;
    }
    return "-";
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const variants = {
      approved: { className: "bg-green-500 text-white", label: "Approved" },
      pending: { className: "bg-yellow-500 text-white", label: "Pending" },
      rejected: { className: "bg-red-500 text-white", label: "Rejected" },
    };
    const config = variants[status] || { className: "bg-gray-500 text-white", label: status };
    return <Badge className={`rounded-full ${config.className}`}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h2 className="text-3xl font-bold text-foreground">
            {currentCategory?.name || "All Documents"}
          </h2>
          <p className="text-muted-foreground">
            Manage encrypted documents with role-based access control
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            className="rounded-2xl cursor-pointer px-6 bg-primary shadow-lg"
            onClick={() => setUploadDialogOpen(true)}
            permission="documents-create"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Upload Dialog */}
      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUploadSuccess}
        isAdmin={true}
        isCompanyDocuments={isCompanyDocuments}
        allClients={allClients}
        currentCategory={currentCategory}
      />

      {/* Filters Section */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Document Type Filter */}
            <div>
              <label htmlFor="type-filter" className="text-sm font-medium mb-2 block">
                Document Type
              </label>
              <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
                <SelectTrigger id="type-filter" className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentCategories
                    .filter(cat => cat.id !== "all" && cat.id !== "company")
                    .map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            {/* Period Filter */}
            <div>
              <label htmlFor="period-filter" className="text-sm font-medium mb-2 block">
                Period/Month
              </label>
              <Input
                id="period-filter"
                placeholder="e.g. December, Q1 2024"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="text-sm font-medium mb-2 block">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full cursor-pointer"
                disabled={!isFilterActive && !searchQuery}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, description, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Document Table */}
      <Card className="rounded-2xl border-border/70">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Document Library
              </CardTitle>
              <CardDescription>
                {filteredDocuments.length} {filteredDocuments.length === 1 ? 'item' : 'items'} found
                {isFilterActive && " (filtered)"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                        <p>Loading documents...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No documents found</p>
                      {isFilterActive && (
                        <p className="text-sm mt-1">Try clearing your filters</p>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <div>
                            <div className="font-semibold">{doc.name}</div>
                            {doc.description && (
                              <div className="text-sm text-muted-foreground">
                                {doc.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getClientDisplay(doc)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getDocumentTypeName(doc.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {doc.documentStartDate ? (
                            <span className="text-sm">{formatDateOnly(doc.documentStartDate)}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not set</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {doc.documentEndDate ? (
                            <span className="text-sm">{formatDateOnly(doc.documentEndDate)}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not set</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getDocumentPeriod(doc)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(doc.uploadDate || doc.createdAt)}
                        </div>
                        {doc.uploadedBy && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {doc.uploadedBy.name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatFileSize(doc.size)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(doc.status || "approved")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(doc)}
                            permission="documents-read"
                            title="View"
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            permission="documents-read"
                            title="Download"
                            className="cursor-pointer"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(doc)}
                            permission="documents-delete"
                            title="Delete"
                            className="text-destructive cursor-pointer hover:text-destructive hover:bg-destructive/10"
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