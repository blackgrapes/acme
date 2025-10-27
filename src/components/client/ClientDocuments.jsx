// File: src/components/client/ClientDocuments.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Eye,
  Download,
  Calendar,
  Search,
  Folder,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ClientDocuments({
  currentCategory,
  clientId,
  onDocumentsUpdate,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // ✅ ADD: Mounted flag to prevent multiple fetches

  // ✅ FIXED: Better clientId validation and fetch logic with mounted check
  useEffect(() => {
    console.log("🔄 ClientDocuments useEffect - clientId:", clientId);

    if (!mounted) {
      setMounted(true);
      return;
    }

    // Wait a bit for clientId to be available from parent
    const timer = setTimeout(() => {
      if (clientId && isValidObjectId(clientId)) {
        console.log("✅ Valid clientId found, fetching documents");
        fetchDocuments();
      } else {
        console.warn("⚠️ Invalid clientId, will retry:", clientId);
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [clientId, currentCategory, mounted]); // ✅ FIXED: Added mounted to deps

  // ✅ ADD: ObjectId validation function
  const isValidObjectId = (id) => {
    if (!id || id === "undefined" || id === "null" || id === "admin") {
      return false;
    }
    // Check if it's a valid MongoDB ObjectId (24 character hex string)
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const fetchDocuments = async () => {
    // ✅ DOUBLE CHECK clientId before fetch
    if (!isValidObjectId(clientId)) {
      console.error("❌ Invalid clientId for fetch:", clientId);
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Fetching documents for client:", clientId);

      const response = await fetch(`/api/documents?clientId=${clientId}`);
      const data = await response.json();

      if (response.ok) {
        console.log(
          "✅ Documents fetched successfully:",
          data.documents?.length || 0
        );
        setDocuments(data.documents || []);
      } else {
        console.error("❌ API Error:", data.error);
        setDocuments([]);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Add event listener for document updates with mounted check
  useEffect(() => {
    if (!mounted) return;

    const handleDocumentsUpdated = () => {
      console.log("📢 Documents updated event received");
      if (isValidObjectId(clientId)) {
        fetchDocuments();
      }
    };

    window.addEventListener("documentsUpdated", handleDocumentsUpdated);

    return () => {
      window.removeEventListener("documentsUpdated", handleDocumentsUpdated);
    };
  }, [clientId, mounted]); // ✅ FIXED: Added mounted

  const refreshDocuments = () => {
    console.log("🔄 Manual refresh called");
    if (isValidObjectId(clientId)) {
      fetchDocuments();
    } else {
      console.error("❌ Cannot refresh - invalid clientId:", clientId);
    }
  };

  // ✅ FIXED: Pass refresh function to parent
  useEffect(() => {
    if (onDocumentsUpdate && isValidObjectId(clientId)) {
      onDocumentsUpdate(refreshDocuments);
    }
  }, [onDocumentsUpdate, clientId]);

  // ✅ Filter documents based on search and category
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description &&
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ✅ Determine page title and description - Company Documents Style
  const getPageTitle = () => {
    if (currentCategory && currentCategory !== "documents") {
      return `${currentCategory.name} Documents`;
    }
    return "Client Document Repository";
  };

  const getPageDescription = () => {
    if (currentCategory && currentCategory !== "documents") {
      return `Access your ${currentCategory.name.toLowerCase()} documents with secure viewing and download options.`;
    }
    return "All your personal documents, agreements, and important files organized for easy access.";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getAccessBadge = (accessLevel) => {
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
    };
    const config = variants[accessLevel] || {
      variant: "secondary",
      label: accessLevel,
    };
    return <Badge {...config}>{config.label}</Badge>;
  };

  // ✅ Handle document download
  const handleDownload = (doc) => {
    const link = document.createElement("a");
    link.href = doc.fileUrl;
    link.download = doc.name;
    link.click();
  };

  // ✅ Handle document view - NEW: Open in new tab without download
  const handleView = (doc) => {
    window.open(doc.fileUrl, "_blank");
  };

  const handleRefresh = () => {
    refreshDocuments();
    if (onDocumentsUpdate) {
      onDocumentsUpdate();
    }
  };

  // ✅ FIXED: Show loading state while waiting for valid clientId
  if (!isValidObjectId(clientId) && loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16 text-muted-foreground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl font-medium">Loading documents...</p>
          <p className="text-sm">
            Please wait while we authenticate your session
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ Header Section - Company Documents Style */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground">
            {getPageTitle()}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
            {getPageDescription()}
          </p>
        </div>
      </div>

      {/* ✅ Search Section - Company Documents Style */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 gap-3">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-2xl h-10 pl-10 w-full"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || !isValidObjectId(clientId)}
            className="rounded-2xl h-10 px-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* ✅ Stats Bar - Company Documents Style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-primary">
              {loading ? "-" : filteredDocuments.length}
            </div>
            <div className="text-xs text-muted-foreground">Documents</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-green-500/5 to-green-500/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-green-600">
              {loading
                ? "-"
                : filteredDocuments.filter((d) => d.accessLevel === "general")
                    .length}
            </div>
            <div className="text-xs text-muted-foreground">Public</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-blue-600">
              {loading
                ? "-"
                : filteredDocuments.filter((d) => d.accessLevel === "specific")
                    .length}
            </div>
            <div className="text-xs text-muted-foreground">Restricted</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-purple-600">
              {loading
                ? "-"
                : new Set(filteredDocuments.map((d) => d.type)).size}
            </div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Content Section - Company Documents Style */}
      <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-background/80 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Folder className="h-6 w-6 sm:h-7 sm:w-7 text-primary flex-shrink-0" />
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  Client Document Library
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                  {currentCategory && currentCategory !== "documents"
                    ? `${currentCategory.name} • `
                    : "All Documents • "}
                  {loading ? "Loading..." : `${filteredDocuments.length} items`}{" "}
                  • Last updated:{" "}
                  {formatDate(new Date().toISOString().split("T")[0])}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-border/50">
                <TableRow>
                  <TableHead className="font-semibold text-primary w-[300px]">
                    Document Name
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-semibold text-primary">
                    Description
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    Access
                  </TableHead>
                  <TableHead className="hidden sm:table-cell font-semibold text-primary">
                    Uploaded
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-semibold text-primary">
                    Size
                  </TableHead>
                  <TableHead className="text-right font-semibold text-primary">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">
                        Loading documents...
                      </p>
                    </TableCell>
                  </TableRow>
                ) : filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">No documents found</p>
                      <p className="text-sm">
                        {searchQuery
                          ? "Try adjusting your search criteria."
                          : currentCategory && currentCategory !== "documents"
                          ? `No ${currentCategory.name.toLowerCase()} documents available yet.`
                          : `No documents available yet.`}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc._id}
                      className="hover:bg-muted/20 transition-colors border-b border-border/20"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-primary/10 flex-shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">
                              {doc.name}
                            </div>
                            <Badge
                              variant="outline"
                              className="mt-1 text-xs rounded-full"
                            >
                              {doc.type}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                        {doc.description || "No description"}
                      </TableCell>
                      <TableCell>{getAccessBadge(doc.accessLevel)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(doc.uploaded)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {doc.size}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0"
                            onClick={() => handleView(doc)} // ✅ FIXED: Added view handler
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
