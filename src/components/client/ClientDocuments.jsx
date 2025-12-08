// File: src/components/client/ClientDocuments.jsx
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
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
  RefreshCw,
  Filter,
  User,
  ExternalLink,
  X,
  Image as ImageIcon,
  FilePdf,
  File,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function ClientDocuments({
  clientDocuments = [],
  currentCategory,

  availableCategories = [],

  onDocumentsUpdate,
  loading = false,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const safeDocuments = useMemo(() => {
    return Array.isArray(clientDocuments) ? clientDocuments : [];
  }, [clientDocuments]);

  const enhancedCategories = useMemo(() => {
    const baseCategories = [
      { id: "all", name: "All Documents", count: safeDocuments.length },
    ];

    const otherCategories = availableCategories.map((cat) => {
      const count = safeDocuments.filter((doc) => doc.type === cat.id).length;
      return { ...cat, count };
    });

    return [...baseCategories, ...otherCategories];
  }, [availableCategories, safeDocuments]);

  const filteredDocuments = useMemo(() => {
    let filtered = safeDocuments;

    if (currentCategory && currentCategory.id !== "all") {
      filtered = filtered.filter((doc) => doc.type === currentCategory.id);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name?.toLowerCase().includes(query) ||
          (doc.description || "").toLowerCase().includes(query)
      );
    }

    if (documentTypeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.type === documentTypeFilter);
    }

    if (periodFilter.trim()) {
      filtered = filtered.filter((doc) => {
        const uploadDate = doc.uploaded || doc.uploadDate;
        if (!uploadDate) return false;

        const date = new Date(uploadDate);
        const monthYear = date.toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        });
        return monthYear.toLowerCase().includes(periodFilter.toLowerCase());
      });
    }

    return filtered;
  }, [
    safeDocuments,
    currentCategory,
    searchQuery,
    documentTypeFilter,
    periodFilter,
  ]);

  const { pageTitle, pageDescription } = useMemo(() => {
    if (currentCategory) {
      if (currentCategory.id === "all") {
        return {
          pageTitle: "Client Document Repository",
          pageDescription:
            "All your personal documents, agreements, and important files organized for easy access.",
        };
      }
      return {
        pageTitle: `${currentCategory.name} Documents`,
        pageDescription: `Access your ${currentCategory.name.toLowerCase()} documents with secure viewing and download options.`,
      };
    }
    return {
      pageTitle: "Client Document Repository",
      pageDescription:
        "All your personal documents, agreements, and important files organized for easy access.",
    };
  }, [currentCategory]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  }, []);

  const formatDateOnly = useCallback((dateString) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Not set";
    }
  }, []);

  //  CHANGE 1: FIXED getDocumentPeriod function
  const getDocumentPeriod = useCallback(
    (doc) => {
      if (doc.documentPeriod && doc.documentPeriod.trim() !== "") {
        return doc.documentPeriod;
      }

      if (doc.documentStartDate && doc.documentEndDate) {
        const start = formatDateOnly(doc.documentStartDate);
        const end = formatDateOnly(doc.documentEndDate);
        return `${start} - ${end}`;
      } else if (doc.documentStartDate) {
        return `From ${formatDateOnly(doc.documentStartDate)}`;
      }

      return "-";
    },
    [formatDateOnly]
  );

  const getDocumentTypeName = useCallback(
    (typeId) => {
      const category = enhancedCategories.find((cat) => cat.id === typeId);
      return category ? category.name : typeId;
    },
    [enhancedCategories]
  );

  //  CHANGE 2: FIXED formatFileSize function
  const formatFileSize = useCallback((bytes) => {
    if (!bytes || bytes === 0 || bytes === "0") return "0 KB";

    if (typeof bytes === "string" && bytes.includes("KB")) {
      return bytes;
    }

    const numBytes = Number(bytes);
    if (isNaN(numBytes)) return "Unknown";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(numBytes) / Math.log(k));
    return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  // CHANGE 3: FIXED getFileExtension function - MULTIPLE SOURCES
  const getFileExtension = useCallback((doc) => {
    // Priority 1: originalName
    if (doc.originalName) {
      const parts = doc.originalName.split(".");
      if (parts.length > 1) return parts.pop().toLowerCase();
    }

    // Priority 2: fileName
    if (doc.fileName) {
      const parts = doc.fileName.split(".");
      if (parts.length > 1) return parts.pop().toLowerCase();
    }

    // Priority 3: name
    if (doc.name) {
      const parts = doc.name.split(".");
      if (parts.length > 1) return parts.pop().toLowerCase();
    }

    // Priority 4: fileUrl
    if (doc.fileUrl) {
      const urlParts = doc.fileUrl.split(".");
      if (urlParts.length > 1) {
        const extension = urlParts.pop().toLowerCase();
        return extension.split("?")[0];
      }
    }

    return "unknown";
  }, []);

  const getFileType = useCallback(
    (doc) => {
      const ext = getFileExtension(doc);
      const imageTypes = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
      const docTypes = ["pdf", "doc", "docx", "txt"];

      if (imageTypes.includes(ext)) return "image";
      if (docTypes.includes(ext)) return "document";
      return "other";
    },
    [getFileExtension]
  );

  // CHANGE 4: FIXED handleDownload function
  const handleDownload = useCallback(
    (doc) => {
      if (doc.fileUrl) {
        const link = document.createElement("a");
        link.href = doc.fileUrl;

        // Use originalName if available, otherwise use name
        const fileName =
          doc.originalName ||
          doc.fileName ||
          `${doc.name || "document"}.${getFileExtension(doc)}`;

        link.download = fileName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    [getFileExtension]
  );

  const handleViewExternal = useCallback((doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
    }
  }, []);


  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (onDocumentsUpdate) {
      onDocumentsUpdate();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  }, [onDocumentsUpdate]);

  const clearFilters = useCallback(() => {
    setDocumentTypeFilter("all");
    setPeriodFilter("");
    setSearchQuery("");
  }, []);

  const isFilterActive = useMemo(() => {
    return documentTypeFilter !== "all" || periodFilter !== "";
  }, [documentTypeFilter, periodFilter]);

  const getFileIcon = useCallback(
    (doc) => {
      const fileType = getFileType(doc);
      const ext = getFileExtension(doc);

      if (fileType === "image") return <ImageIcon className="h-4 w-4" />;
      if (ext === "pdf") return <File className="h-4 w-4" />;
      return <FileText className="h-4 w-4" />;
    },
    [getFileType, getFileExtension]
  );

  return (
    <div className="space-y-7">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h1 className="text-3xl font-bold text-foreground">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="cursor-pointer rounded-lg"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                isRefreshing || loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          {/* <Link href="/client-dashboard">
            <Button className="rounded-lg cursor-pointer bg-primary shadow-lg gap-2">
              <FileText className="h-4 w-4" />
              Request Document
            </Button>
          </Link> */}
        </div>
      </div>

      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="type-filter"
                className="text-sm font-medium block"
              >
                Document Type
              </label>
              <Select
                value={documentTypeFilter}
                onValueChange={setDocumentTypeFilter}
              >
                <SelectTrigger id="type-filter" className="w-full rounded-lg">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {enhancedCategories
                    .filter((cat) => cat.id !== "all")
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="period-filter"
                className="text-sm font-medium block"
              >
                Period/Month
              </label>
              <Input
                id="period-filter"
                placeholder="e.g. December, Q1 2024"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="w-full rounded-lg"
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full cursor-pointer rounded-lg"
                disabled={!isFilterActive && !searchQuery}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by document name, description, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg w-full"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg cursor-pointer"
              onClick={clearFilters}
              disabled={!isFilterActive && !searchQuery}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Document Library
              </CardTitle>
              <CardDescription>
                {loading
                  ? "Loading..."
                  : `${filteredDocuments.length} ${
                      filteredDocuments.length === 1 ? "item" : "items"
                    } found`}
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
                  <TableHead className="font-semibold text-primary w-[200px] min-w-[200px]">
                    Document Name
                  </TableHead>
                  <TableHead className="font-semibold text-primary w-[120px] min-w-[120px]">
                    Type
                  </TableHead>
                  <TableHead className="font-semibold text-primary w-[120px] min-w-[120px]">
                    Start Date
                  </TableHead>
                  <TableHead className="font-semibold text-primary w-[120px] min-w-[120px]">
                    End Date
                  </TableHead>
                  <TableHead className="font-semibold text-primary w-[120px] min-w-[120px]">
                    Period
                  </TableHead>
                  <TableHead className="font-semibold text-primary w-[140px] min-w-[140px]">
                    Uploaded
                  </TableHead>
                  <TableHead className="font-semibold text-primary w-[80px] min-w-[80px]">
                    Size
                  </TableHead>
                  <TableHead className="text-right font-semibold text-primary w-[120px] min-w-[120px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading || isRefreshing ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">
                          {isRefreshing
                            ? "Refreshing..."
                            : "Loading documents..."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">No documents found</p>
                      <p className="text-sm">
                        {searchQuery || isFilterActive
                          ? "Try adjusting your search criteria or clear filters."
                          : "No documents available in this category."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc._id || doc.id}
                      className="hover:bg-muted/50"
                    >
                      {/* Document Name - with tooltip */}
                      <TableCell className="font-medium w-[150px] min-w-[150px]">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl shrink-0 ${
                              getFileType(doc) === "image"
                                ? "bg-green-100"
                                : getFileExtension(doc) === "pdf"
                                ? "bg-red-100"
                                : "bg-primary/10"
                            }`}
                          >
                            {getFileIcon(doc)}
                          </div>
                          <div className="min-w-0 flex-1">
                            {/* Document Name with tooltip */}
                            <div
                              className="font-semibold truncate"
                              title={doc.name || "Unnamed Document"}
                            >
                              {doc.name || "Unnamed Document"}
                            </div>

                            {/* Description with tooltip if available */}
                            {doc.description && (
                              <div
                                className="text-sm text-muted-foreground truncate mt-1"
                                title={doc.description}
                              >
                                {doc.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Type */}
                      <TableCell className="w-[120px] min-w-[120px]">
                        <div title={getDocumentTypeName(doc.type)}>
                          <Badge
                            variant="outline"
                            className="rounded-full truncate max-w-full"
                          >
                            <span className="truncate block">
                              {getDocumentTypeName(doc.type)}
                            </span>
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Start Date */}
                      <TableCell className="w-[120px] min-w-[120px]">
                        <div
                          className="flex items-center gap-2"
                          title={
                            doc.documentStartDate
                              ? formatDateOnly(doc.documentStartDate)
                              : "Not set"
                          }
                        >
                          <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-sm truncate">
                            {doc.documentStartDate
                              ? formatDateOnly(doc.documentStartDate)
                              : "Not set"}
                          </span>
                        </div>
                      </TableCell>

                      {/* End Date */}
                      <TableCell className="w-[120px] min-w-[120px]">
                        <div
                          className="flex items-center gap-2"
                          title={
                            doc.documentEndDate
                              ? formatDateOnly(doc.documentEndDate)
                              : "Not set"
                          }
                        >
                          <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-sm truncate">
                            {doc.documentEndDate
                              ? formatDateOnly(doc.documentEndDate)
                              : "Not set"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Period */}
                      <TableCell className="w-[100px] min-w-[100px]">
                        <div
                          className="text-sm truncate"
                          title={getDocumentPeriod(doc)}
                        >
                          {getDocumentPeriod(doc)}
                        </div>
                      </TableCell>

                      {/* Uploaded */}
                      <TableCell className="w-[140px] min-w-[140px]">
                        <div
                          className="text-sm"
                          title={formatDate(doc.uploaded || doc.uploadDate)}
                        >
                          <div className="truncate">
                            {formatDate(doc.uploaded || doc.uploadDate)}
                          </div>
                          
                        </div>
                      </TableCell>

                      {/* Size */}
                      <TableCell className="w-[80px] min-w-[80px]">
                        <div className="text-sm text-muted-foreground">
                          <div
                            title={formatFileSize(doc.size)}
                            className="truncate"
                          >
                            {formatFileSize(doc.size)}
                          </div>
                          <div
                            className="text-xs flex items-center gap-1 mt-1"
                            title={`File type: ${getFileExtension(
                              doc
                            ).toUpperCase()}`}
                          >
                            {getFileIcon(doc)}
                            <span className="truncate">
                              {getFileExtension(doc).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right w-[120px] min-w-[120px]">
                        <div className="flex gap-2 justify-end">
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            disabled={!doc.fileUrl}
                            className="h-8 cursor-pointer w-8 p-0 rounded-lg shrink-0"
                            title="Download document"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewExternal(doc)}
                            disabled={!doc.fileUrl}
                            className="h-8 cursor-pointer w-8 p-0 rounded-lg shrink-0"
                            title="Open in new tab"
                          >
                            <ExternalLink className="h-4 w-4" />
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
