// New File: src/components/client/CompanyDocuments.jsx
"use client";

import { useState } from "react";
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
  dummyDocuments,
  currentCategory,
  clientId,
}) {
  // ✅ FIXED: Added clientId prop
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ FIXED: Use dummyDocuments and clientId - Filter for general or specific to this client
  const filteredDocuments = (
    currentCategory && currentCategory !== "company-documents"
      ? dummyDocuments.filter(
          (doc) =>
            (doc.accessLevel === "general" ||
              (doc.specificClients &&
                doc.specificClients.includes(clientId))) && // ✅ FIXED: Check access with safe array
            doc.type === currentCategory.id // Assuming type is category id
        )
      : dummyDocuments.filter(
          (doc) =>
            doc.accessLevel === "general" ||
            (doc.specificClients && doc.specificClients.includes(clientId)) // ✅ General or specific to this client - safe check
        )
  ).filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description || "").toLowerCase().includes(searchQuery.toLowerCase()) // ✅ FIXED: Safe description access
  );

  // Determine page title and description
  const getPageTitle = () => {
    if (currentCategory && currentCategory !== "company-documents") {
      return `${currentCategory.name} Documents`;
    }
    return "Company Document Repository";
  };

  const getPageDescription = () => {
    if (currentCategory && currentCategory !== "company-documents") {
      return `Access your ${currentCategory.name.toLowerCase()} documents with secure viewing and download options.`;
    }
    return "All company documents, certificates, and important files organized for easy access.";
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
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
        </div>
      </div>

      {/* Stats Bar */}
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
              {
                filteredDocuments.filter((d) => d.accessLevel === "general")
                  .length
              }
            </div>
            <div className="text-xs text-muted-foreground">Public</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-blue-600">
              {
                filteredDocuments.filter((d) => d.accessLevel === "specific")
                  .length
              }
            </div>
            <div className="text-xs text-muted-foreground">Restricted</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(filteredDocuments.map((d) => d.type)).size}
            </div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>

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
                  {currentCategory && currentCategory !== "company-documents"
                    ? `${currentCategory.name} • `
                    : "All Company Documents • "}
                  {filteredDocuments.length} items • Last updated:{" "}
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
                {filteredDocuments.length === 0 ? (
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
                          : currentCategory &&
                            currentCategory !== "company-documents"
                          ? `No ${currentCategory.name.toLowerCase()} documents available yet.`
                          : `No company documents available yet.`}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc.id}
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
                        {doc.description || "No description"}{" "}
                        {/* ✅ FIXED: Safe access */}
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
