// File: src/components/client/CompanyDocuments.jsx - FIXED VERSION
"use client";

import { useState, useEffect, useMemo } from "react";
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
  Building,
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

export default function CompanyDocuments({
  companyDocuments = [], // Changed from dummyDocuments to companyDocuments
  currentCategory,
  clientId,
  availableCategories = [],
  onDocumentsUpdate,
  categoriesLoading = false,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FIXED: Safe array handling
  const safeDocuments = Array.isArray(companyDocuments) ? companyDocuments : [];

  // ✅ FIXED: Filter documents based on category and search
  const filteredDocuments = useMemo(() => {
    let filtered = safeDocuments;

    // Filter by category if not "all"
    if (currentCategory && currentCategory.id !== "all") {
      filtered = filtered.filter(doc => doc.type === currentCategory.id);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(doc =>
        doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [safeDocuments, currentCategory, searchQuery]);

  // ✅ FIXED: Page title and description
  const { pageTitle, pageDescription } = useMemo(() => {
    if (currentCategory) {
      if (currentCategory.id === "all") {
        return {
          pageTitle: "Company Document Repository",
          pageDescription: "All company documents, certificates, and important files organized for easy access."
        };
      }
      return {
        pageTitle: `${currentCategory.name} Documents`,
        pageDescription: `Access your ${currentCategory.name.toLowerCase()} documents with secure viewing and download options.`
      };
    }
    return {
      pageTitle: "Company Document Repository",
      pageDescription: "All company documents, certificates, and important files organized for easy access."
    };
  }, [currentCategory]);

  // ✅ FIXED: Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // ✅ FIXED: Access badge
  const getAccessBadge = (accessLevel) => {
    const variants = {
      general: {
        className: "bg-green-500 text-white rounded-full",
        label: "General Access",
      },
      specific: {
        className: "bg-blue-500 text-white rounded-full",
        label: "Specific Access",
      },
    };
    const config = variants[accessLevel] || {
      className: "bg-gray-500 text-white rounded-full",
      label: accessLevel || "Unknown",
    };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // ✅ Handle document download
  const handleDownload = (doc) => {
    if (doc.fileUrl) {
      const link = document.createElement("a");
      link.href = doc.fileUrl;
      link.download = doc.name || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // ✅ Handle document view
  const handleView = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
    }
  };

  // ✅ Handle refresh
  const handleRefresh = () => {
    if (onDocumentsUpdate) {
      setLoading(true);
      onDocumentsUpdate();
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {pageTitle}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
            {pageDescription}
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 gap-3">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search company documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-2xl h-10 pl-10 w-full"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-2xl h-10 px-4"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Bar - Only show if we have documents */}
      {safeDocuments.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-primary">
                {filteredDocuments.length}
              </div>
              <div className="text-xs text-muted-foreground">Documents</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-green-500/5 to-green-500/10">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-green-600">
                {filteredDocuments.filter(d => d.accessLevel === "general").length}
              </div>
              <div className="text-xs text-muted-foreground">Public</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-blue-600">
                {filteredDocuments.filter(d => d.accessLevel === "specific").length}
              </div>
              <div className="text-xs text-muted-foreground">Restricted</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(filteredDocuments.map(d => d.type)).size}
              </div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Section */}
      <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-background/80 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Building className="h-6 w-6 sm:h-7 sm:w-7 text-primary flex-shrink-0" />
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  Company Document Library
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                  {currentCategory?.name
                    ? `${currentCategory.name} • `
                    : "All Company Documents • "}
                  {loading ? "Loading..." : `${filteredDocuments.length} items`}
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
                  <TableHead className="text-right font-semibold text-primary">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading documents...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">No documents found</p>
                      <p className="text-sm">
                        {searchQuery
                          ? "Try adjusting your search criteria."
                          : safeDocuments.length === 0
                          ? "No company documents available yet."
                          : "No documents match the current filter."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc._id || doc.id}
                      className="hover:bg-muted/20 transition-colors border-b border-border/20"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-primary/10 flex-shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">
                              {doc.name || "Unnamed Document"}
                            </div>
                            <Badge variant="outline" className="mt-1 text-xs rounded-full">
                              {doc.type || "Unknown"}
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
                            {formatDate(doc.uploaded || doc.uploadDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0"
                            onClick={() => handleView(doc)}
                            disabled={!doc.fileUrl}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0"
                            onClick={() => handleDownload(doc)}
                            disabled={!doc.fileUrl}
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