// Updated File: src/components/admin/DocumentManagement.jsx
"use client";

import { useState } from "react";
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
import { Checkbox } from "radix-ui";

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
  documentCategories = [], // Default to prevent undefined
}) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Filter documents based on current category
  const filteredDocuments =
    currentCategory && currentCategory !== "add-tab"
      ? dummyDocuments.filter(
          (doc) =>
            doc.type ===
            (currentCategory.child
              ? currentCategory.child.toLowerCase()
              : currentCategory.name.toLowerCase())
        )
      : dummyDocuments;

  // Handle add new category
  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      addNewCategory(newCategoryName);
      setNewCategoryName("");
      // Simulate alert with toast or notification
      console.log(`New category "${newCategoryName}" added successfully!`);
    }
  };

  // Determine page title and description with modern flair
  const getPageTitle = () => {
    if (currentCategory === "add-tab") {
      return "Create New Document Category";
    }
    if (currentCategory) {
      return currentCategory.child
        ? `${currentCategory.name} - ${currentCategory.child} Repository`
        : `${currentCategory.name} Repository`;
    }
    return "Secure Document Repository";
  };

  const getPageDescription = () => {
    if (currentCategory === "add-tab") {
      return "Organize your documents with custom categories for optimal security and accessibility.";
    }
    if (currentCategory) {
      return `Manage encrypted ${
        currentCategory.child
          ? currentCategory.child.toLowerCase()
          : currentCategory.name.toLowerCase()
      } documents with role-based access.`;
    }
    return "All documents across categories, with audit logs and secure sharing.";
  };

  // Simulate upload progress
  const simulateUpload = () => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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
      All: {
        variant: "default",
        className: "bg-success text-success-foreground rounded-full",
      },
      Specific: {
        variant: "secondary",
        className: "bg-warning text-warning-foreground rounded-full",
      },
      Admin: {
        variant: "outline",
        className: "bg-destructive text-destructive-foreground rounded-full",
      },
    };
    const config = variants[access] || { variant: "secondary" };
    return <Badge {...config}>{access} Access</Badge>;
  };

  // Render Add New Tab page - Modern UI
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
            onClick={() => setActiveTab("documents-all")}
            variant="outline"
            className="gap-2 rounded-2xl px-6 py-3 border-border/50"
          >
            <ChevronRight className="h-4 w-4" />
            Back to Repository
          </Button>
        </div>

        <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-background/80 shadow-2xl max-w-2xl mx-auto overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground">
              <Folder className="h-7 w-7 text-primary" />
              New Category Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label
                  htmlFor="categoryName"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Shield className="h-4 w-4 text-primary" />
                  Category Name *
                </Label>
                <Input
                  id="categoryName"
                  placeholder="e.g., Compliance Certificates, Guard KYC"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="rounded-2xl h-12 text-lg"
                />
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground">
                  <strong>Tip:</strong> Use descriptive names for easy
                  organization. Categories support sub-folders for hierarchical
                  structure.
                </p>
              </div>
              <Button
                onClick={handleAddNewCategory}
                disabled={!newCategoryName.trim()}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-primary/30 transition-all text-lg font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Secure Category
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground">
            {getPageTitle()}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {getPageDescription()}
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="rounded-2xl w-[200px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {documentCategories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.name.toLowerCase()}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-2xl bg-primary shadow-lg px-6 py-3">
                <Plus className="h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  Secure Document Upload
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Encrypt and share documents with granular access controls.
                  Supports up to 100MB with automatic virus scan.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-3">
                  <Label htmlFor="docName" className="text-sm font-semibold">
                    Document Title *
                  </Label>
                  <Input
                    id="docName"
                    placeholder="e.g., Q4 2025 Compliance Report"
                    className="rounded-2xl h-12"
                  />
                </div>
                {!currentCategory && (
                  <div className="space-y-3">
                    <Label htmlFor="docType" className="text-sm font-semibold">
                      Category
                    </Label>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {documentCategories.map((category) =>
                          category.children ? (
                            <SelectGroup key={category.id}>
                              <SelectLabel>{category.name}</SelectLabel>
                              {category.children.map((child, i) => (
                                <SelectItem key={i} value={child.toLowerCase()}>
                                  {child}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ) : (
                            <SelectItem
                              key={category.id}
                              value={category.name.toLowerCase()}
                            >
                              {category.name}
                            </SelectItem>
                          )
                        )}
                        <SelectItem value="all">All Clients</SelectItem>
                        <SelectItem value="specific">
                          Specific Guards
                        </SelectItem>
                        <SelectItem value="admin">Admin Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Access Level</Label>
                  <Select
                    onValueChange={(value) =>
                      setShowSpecificClients(value === "specific")
                    }
                  >
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Select Access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      <SelectItem value="specific">Specific Guards</SelectItem>
                      <SelectItem value="admin">Admin Only</SelectItem>
                    </SelectContent>
                  </Select>
                  {showSpecificClients && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search guards..."
                          value={docGuardSearch}
                          onChange={(e) => handleGuardSearch(e, "doc")}
                          className="rounded-2xl flex-1"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto rounded-2xl p-4 bg-muted/30 border border-border/30">
                        {filteredDocGuards.map((guard) => (
                          <div
                            key={guard.id}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50"
                          >
                            <Checkbox
                              id={`doc-guard-${guard.id}`}
                              checked={selectedDocGuards.includes(guard.id)}
                              onCheckedChange={() =>
                                toggleGuardSelection(guard.id, "doc")
                              }
                            />
                            <Label
                              htmlFor={`doc-guard-${guard.id}`}
                              className="text-sm cursor-pointer flex-1"
                            >
                              <div className="font-medium">{guard.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {guard.email}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
                      Drop file or click to browse
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
                      onChange={simulateUpload}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="rounded-2xl px-6"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-2xl bg-gradient-to-r from-success to-success/80 shadow-lg px-8"
                  disabled={uploadProgress < 100}
                >
                  {uploadProgress < 100
                    ? `Uploading... ${uploadProgress}%`
                    : "Upload & Encrypt"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-background/80 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-3 text-foreground">
                <FileText className="h-7 w-7 text-primary" />
                Document Library
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
                            {documentCategories.find(
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
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-xl h-9 w-9 p-0 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-2xl">
                              <DialogHeader>
                                <DialogTitle>Delete {doc.name}?</DialogTitle>
                                <DialogDescription>
                                  This action is irreversible and will remove
                                  audit logs.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button variant="destructive">
                                  Permanently Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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
