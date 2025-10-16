// Updated File: src/components/client/ClientDocuments.jsx
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
  Plus,
  Filter,
  ChevronDown,
  Smartphone,
  Tablet,
  Monitor,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function ClientDocuments({ dummyDocuments, currentCategory }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // Filter documents based on current category and search
  const filteredDocuments = (
    currentCategory && currentCategory !== "documents"
      ? dummyDocuments.filter(
          (doc) =>
            (doc.access === "general" || doc.access === "specific") &&
            doc.type ===
              (currentCategory.child
                ? currentCategory.child.toLowerCase()
                : currentCategory.name.toLowerCase())
        )
      : dummyDocuments.filter(
          (doc) => doc.access === "general" || doc.access === "specific"
        )
  )
    .filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((doc) => filterType === "all" || doc.type === filterType);

  // Determine page title and description
  const getPageTitle = () => {
    if (currentCategory && currentCategory !== "documents") {
      return currentCategory.child
        ? `${currentCategory.name} - ${currentCategory.child} Documents`
        : `${currentCategory.name} Documents`;
    }
    return "Secure Document Repository";
  };

  const getPageDescription = () => {
    if (currentCategory && currentCategory !== "documents") {
      return `Access your ${
        currentCategory.child
          ? currentCategory.child.toLowerCase()
          : currentCategory.name.toLowerCase()
      } documents with secure viewing and download options.`;
    }
    return "All contracts, reports, certificates, and other important documents organized for easy access.";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Mobile responsive card view
  const DocumentCard = ({ doc }) => (
    <Card className="rounded-2xl border-border/50 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-primary/10 flex-shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground truncate">
                {doc.name}
              </h3>
              <Badge
                variant="outline"
                className="text-xs rounded-full flex-shrink-0 ml-2"
              >
                {doc.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {doc.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(doc.uploaded)}</span>
              </div>
              <span>{doc.size}</span>
              <Badge variant="secondary" className="rounded-full text-xs">
                {doc.access}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 pt-3 border-t border-border/30">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl gap-2"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden xs:inline">View</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden xs:inline">Download</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            {getPageTitle()}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
            {getPageDescription()}
          </p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 gap-3">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-2xl h-10 pl-10 w-full"
              />
            </div>
          </div>

          {/* Filter - Hidden on mobile, visible on tablet+ */}
          <div className="hidden sm:block">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="rounded-2xl w-[140px] h-10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {/* View Mode Toggle - Hidden on small mobile */}
          <div className="hidden xs:flex bg-muted/50 rounded-2xl p-1">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={cn(
                "rounded-xl h-8 px-3",
                viewMode === "table" && "shadow-sm"
              )}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-xl h-8 px-3",
                viewMode === "grid" && "shadow-sm"
              )}
            >
              <Tablet className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Filter Dropdown */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-2xl h-10 gap-2"
                >
                  <Filter className="h-4 w-4" />
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl">
                <DropdownMenuItem onClick={() => setFilterType("all")}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("contract")}>
                  Contract
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("report")}>
                  Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("certificate")}>
                  Certificate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("policy")}>
                  Policy
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              {filteredDocuments.filter((d) => d.access === "general").length}
            </div>
            <div className="text-xs text-muted-foreground">Public</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-blue-600">
              {filteredDocuments.filter((d) => d.access === "specific").length}
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
              <FileText className="h-6 w-6 sm:h-7 sm:w-7 text-primary flex-shrink-0" />
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  Document Library
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                  {currentCategory
                    ? `${
                        currentCategory.child
                          ? `${currentCategory.name} - ${currentCategory.child}`
                          : currentCategory.name
                      } • `
                    : "All Documents • "}
                  {filteredDocuments.length} items • Last updated:{" "}
                  {formatDate(new Date().toISOString().split("T")[0])}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Grid View for Mobile */}
          {viewMode === "grid" || window.innerWidth < 768 ? (
            <div className="p-4 sm:p-6">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg sm:text-xl font-medium">
                    No documents found
                  </p>
                  <p className="text-sm sm:text-base mt-2">
                    {searchQuery || filterType !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : currentCategory
                      ? `No documents available in this category yet.`
                      : `Check back later or contact support for access.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Table View for Desktop */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-border/50">
                  <TableRow>
                    <TableHead className="font-semibold text-primary w-[200px]">
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
                        <p className="text-xl font-medium">
                          No documents found
                        </p>
                        <p className="text-sm">
                          {searchQuery || filterType !== "all"
                            ? "Try adjusting your search or filter criteria."
                            : currentCategory
                            ? `No documents available in this category yet.`
                            : `Check back later or contact support for access.`}
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
                          {doc.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-full">
                            {doc.access}
                          </Badge>
                        </TableCell>
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
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-xl h-9 w-9 p-0"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
