//file: src/app/admin-dashboard/guard-details/[id]
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Eye,
  Download,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building,
  Shield,
  FileText,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  ArrowLeft,
  BarChart3,
  Activity,
  CreditCard,
  MessageCircle,
  Upload,
  Award,
  Star,
  History,
  Users,
  Target,
  FileCheck,
  IdCard,
  GraduationCap,
  Image as ImageIcon,
  Play,
  Video,
  Quote,
  Minus,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  File as FileIcon,
  Loader2,
  Shield as ShieldIcon,
  TrendingUpIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function GuardDetails() {
  const params = useParams();
  const guardId = params.id;
  const [guard, setGuard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [customDocumentName, setCustomDocumentName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (guardId) {
      fetchGuardDetails();
    }
  }, [guardId]);

  const fetchGuardDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/guard/${guardId}`);
      const result = await response.json();

      if (response.ok) {
        setGuard(result.guard);
        setEditFormData(result.guard);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch guard details",
          variant: "destructive",
        });
        router.push("/admin-dashboard");
      }
    } catch (error) {
      console.error("Error fetching guard details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch guard details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    setUploadingDocument(true);

    const fileInput = document.getElementById("document-file");
    if (!fileInput.files[0]) {
      toast({
        title: "Error",
        description: "Please select a file",
        variant: "destructive",
      });
      setUploadingDocument(false);
      return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("guardId", guardId);
    formData.append("context", "guard-document");
    formData.append("customName", customDocumentName); // Add custom name to form data if basic upload API supported it (it might not)

    try {
      // Step 1: Upload file
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload failed");
      }

      const uploadData = await uploadResponse.json();

      // Step 2: Create guard document
      const documentData = {
        name: customDocumentName || file.name.replace(/\.[^/.]+$/, ""), // Use custom name or fallback
        type: "employee-details",
        fileId: uploadData.fileId,
        fileName: uploadData.fileName,
        originalName: file.name,
        fileUrl: uploadData.fileUrl,
        size: uploadData.size,
        mimeType: uploadData.mimeType,
        uploaded: new Date().toISOString(),
        category: "guard",
        uploadedBy: guard.guardId, // CRITICAL: Set uploadedBy to Guard ID so it follows the guard
      };

      // Update guard with new document
      const updatedGuard = {
        ...guard,
        documents: [...(guard.documents || []), documentData],
      };

      const updateResponse = await fetch(`/api/auth/guard/${guardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documents: updatedGuard.documents }),
      });

      if (updateResponse.ok) {
        const result = await updateResponse.json();
        setGuard(result.guard);

        // ✅ Create document in global collection linked to Guard (Dynamic Visibility)
        await createGlobalGuardDocument(documentData);

        toast({
          title: "Success",
          description: "Document uploaded successfully!",
        });

        setDocumentDialogOpen(false);
        setCustomDocumentName(""); // Reset custom name
        fileInput.value = ""; // Clear file input
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploadingDocument(false);
    }
  };

  const createGlobalGuardDocument = async (documentData) => {
    try {
      const globalDocData = {
        ...documentData,
        name: documentData.name, // Keep original name
        description: `Employee document for ${guard.name}`,
        // targetClient: clientId, // ❌ REMOVED: Don't link properly to client, rely on relatedGuard
        relatedGuard: guardId, // ✅ ADDED: Link to guard for dynamic visibility
        isCompanyDocument: false,
        category: "guard", // Changed to guard category
        type: "employee-details",
      };

      await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(globalDocData),
      });
      console.log("✅ Created global guard document");
    } catch (error) {
      console.error("Error creating global guard document:", error);
    }
  };

  const handleDownloadDocument = async (doc) => {
    if (doc.fileUrl) {
      const link = document.createElement("a");
      link.href = doc.fileUrl;
      link.download = doc.originalName || doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteDocument = async (doc, index) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      // ✅ STEP 1: Delete from Document collection if it has an _id
      if (doc._id || doc.fileId) {
        const docId = doc._id || doc.fileId;
        const deleteResponse = await fetch(`/api/documents?id=${docId}`, {
          method: "DELETE",
        });

        if (!deleteResponse.ok) {
          console.error("Failed to delete from Document collection");
        } else {
          console.log("✅ Deleted from Document collection");
        }
      }

      // ✅ STEP 2: Remove from guard's embedded documents array
      const updatedDocuments = guard.documents.filter((_, i) => i !== index);

      const updateResponse = await fetch(`/api/auth/guard/${guardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documents: updatedDocuments }),
      });

      if (updateResponse.ok) {
        // ✅ STEP 3: Refresh guard data to get updated state
        await fetchGuardDetails();

        toast({
          title: "Success",
          description: "Document deleted successfully!",
        });
      } else {
        throw new Error("Failed to update guard documents");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };


  const handleUpdateGuard = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`/api/auth/guard/${guardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: result.message || "Guard updated successfully!",
        });
        setGuard(result.guard);
        setEditDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update guard",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating guard:", error);
      toast({
        title: "Error",
        description: "Failed to update guard",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeactivateGuard = async () => {
    if (!confirm("Are you sure you want to deactivate this guard?")) {
      return;
    }

    try {
      const response = await fetch(`/api/auth/guard/${guardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Inactive" }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: result.message || "Guard deactivated successfully!",
        });
        setGuard(result.guard);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to deactivate guard",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deactivating guard:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate guard",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading guard details...</p>
        </div>
      </div>
    );
  }

  if (!guard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Guard Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The guard you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/admin-dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
      case "Assigned":
        return (
          <Badge
            variant="default"
            className="rounded-full bg-success text-success-foreground"
          >
            Active
          </Badge>
        );
      case "Inactive":
        return (
          <Badge
            variant="secondary"
            className="rounded-full bg-destructive text-destructive-foreground"
          >
            Inactive
          </Badge>
        );
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-xl">
            Overview
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xl">
            Documents
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xl">
            History
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-6 w-6" />
                Guard Profile Overview
              </CardTitle>
              <CardDescription>
                Comprehensive profile and key metrics for {guard.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Enhanced Profile Header */}
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="h-12 w-12 text-background" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">{guard.name}</h2>
                    {getStatusBadge(guard.status)}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{guard.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{guard.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{guard.address}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Guard Profile</DialogTitle>
                        <DialogDescription>
                          Update the guard's information.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleUpdateGuard} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={editFormData.name || ""}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editFormData.email || ""}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={editFormData.phone || ""}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={editFormData.address || ""}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={updating}>
                            {updating ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : null}
                            {updating ? "Updating..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  {guard.status === "Active" && (
                    <Button variant="outline" onClick={handleDeactivateGuard}>
                      Deactivate Guard
                    </Button>
                  )}
                </div>
              </div>

              {/* Enhanced Current Assignment */}
              {guard.currentAssignment && (
                <Card className="rounded-2xl border-border/50 hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Current Assignment
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Client</p>
                        <p className="font-medium text-foreground">
                          {guard.currentAssignment.clientName}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Duration
                        </p>
                        <p className="font-medium text-foreground">
                          {formatDate(guard.currentAssignment.startDate)} -{" "}
                          {formatDate(guard.currentAssignment.endDate)}
                        </p>
                      </div>
                    </div>
                    <Progress value={75} className="mt-4 h-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      75% Complete
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Activity Timeline */}
              <Card className="rounded-2xl border-border/50 hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border-l-4 border-success/50 hover:shadow-md transition-all">
                      <div className="flex-shrink-0 rounded-full p-2 bg-success/20 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          Profile Created
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Guard profile was created and added to the system
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {formatDate(guard.createdAt)}
                      </span>
                    </div>

                    {guard.lastActive && (
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border-l-4 border-primary/50 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 rounded-full p-2 bg-primary/20 mt-0.5">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            Last Active Session
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Guard was last active in the system
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatDate(guard.lastActive)}
                        </span>
                      </div>
                    )}

                    {guard.status === "Inactive" && (
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border-l-4 border-destructive/50 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 rounded-full p-2 bg-destructive/20 mt-0.5">
                          <XCircle className="h-4 w-4 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            Account Deactivated
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Guard account has been deactivated
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto">
                          Recently
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Guard Documents
              </CardTitle>
              <CardDescription>
                Upload and manage documents for {guard.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Upload Document Button */}
              <div className="flex justify-end">
                <Button
                  onClick={() => setDocumentDialogOpen(true)}
                  permission="documents-create"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
                <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Guard Document</DialogTitle>
                      <DialogDescription>
                        Select a file to upload for this guard.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUploadDocument} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="custom-doc-name">Document Name</Label>
                        <Input
                          id="custom-doc-name"
                          placeholder="e.g. Aadhar Card, Police Verification"
                          value={customDocumentName}
                          onChange={(e) => setCustomDocumentName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="document-file">Select File</Label>
                        <Input id="document-file" type="file" required />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={uploadingDocument}>
                          {uploadingDocument ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            "Upload"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Documents Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guard.documents && guard.documents.length > 0 ? (
                      guard.documents.map((doc, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileIcon className="h-4 w-4 text-primary" />
                              {doc.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {doc.type || "employee-details"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(doc.uploaded || doc.uploadDate)}
                          </TableCell>
                          <TableCell>
                            {doc.size
                              ? `${(doc.size / 1024).toFixed(1)} KB`
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(doc.fileUrl, "_blank")
                                }
                                className="cursor-pointer"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadDocument(doc)}
                                className="cursor-pointer"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDocument(doc, index)}
                                className="text-destructive cursor-pointer hover:text-destructive"
                                permission="documents-delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No documents uploaded yet</p>
                          <p className="text-sm mt-2">
                            Upload documents to appear here
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Complete Activity History
              </CardTitle>
              <CardDescription>
                Timeline of key events and assignments for {guard.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:shadow-md transition-all">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Profile Created</p>
                    <p className="text-sm text-muted-foreground">
                      Guard profile was added to the system
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(guard.createdAt)}
                    </p>
                  </div>
                </div>

                {guard.lastActive && (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:shadow-md transition-all">
                    <div className="p-2 bg-success/10 rounded-full">
                      <Activity className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Last Active</p>
                      <p className="text-sm text-muted-foreground">
                        Guard was last active in the system
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(guard.lastActive)}
                      </p>
                    </div>
                  </div>
                )}

                {guard.currentAssignment && (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:shadow-md transition-all">
                    <div className="p-2 bg-warning/10 rounded-full">
                      <Shield className="h-4 w-4 text-warning" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Current Assignment Started</p>
                      <p className="text-sm text-muted-foreground">
                        Assigned to current security duty
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(guard.currentAssignment.startDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {guard.assignmentHistory &&
                guard.assignmentHistory.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Assignment History
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Rating</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {guard.assignmentHistory.map((assignment, index) => (
                          <TableRow key={index} className="hover:bg-muted/30">
                            <TableCell className="font-medium">
                              {assignment.clientName}
                            </TableCell>
                            <TableCell>
                              {formatDate(assignment.startDate)} -{" "}
                              {formatDate(assignment.endDate)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {assignment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-current text-yellow-500" />
                                <span>{assignment.rating}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}
