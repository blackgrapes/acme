// src/app/admin-dashboard/clients/[id]/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
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
  Send,
  MessageSquare,
  Star,
  History,
  TrendingUp,
  Users,
  Award,
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
  Users as UsersIcon,
  TrendingUp as TrendingUpIcon,
  Briefcase,
  Home,
  Globe,
  FileSignature,
  Target,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AssignGuardDialog } from "@/components/admin/AssignGuardDialog";
import { UploadDocumentDialog } from "@/components/admin/UploadDocumentDialog";
import { toast } from "sonner";

export default function ClientDetails() {
  const params = useParams();
  const clientId = params.id;
  const [client, setClient] = useState(null);
  const [clientDocuments, setClientDocuments] = useState([]);
  const [assignedGuards, setAssignedGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [assignGuardOpen, setAssignGuardOpen] = useState(false);
  const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // Add these states after other state declarations
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const handleViewGuardDetails = (guardId) => {
    router.push(`/admin-dashboard/guard-details/${guardId}`);
  };
  // Fetch all client data
  const fetchClientData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Fetching client data for:", clientId);

      // Fetch client details
      const clientResponse = await fetch(`/api/auth/client/${clientId}`);
      if (!clientResponse.ok) {
        const errorData = await clientResponse.json();
        throw new Error(errorData.error || "Failed to fetch client");
      }

      const clientData = await clientResponse.json();
      console.log("✅ Client data:", clientData);
      setClient(clientData.client);

      // Fetch client documents
      const docsResponse = await fetch(
        `/api/auth/client/${clientId}/documents`
      );
      if (docsResponse.ok) {
        const docsData = await docsResponse.json();
        setClientDocuments(docsData.documents || []);
      } else {
        setClientDocuments([]);
      }

      // Fetch assigned guards
      const guardsResponse = await fetch(`/api/auth/client/${clientId}/guards`);
      if (guardsResponse.ok) {
        const guardsData = await guardsResponse.json();
        setAssignedGuards(guardsData.guards || []);
      } else {
        setAssignedGuards([]);
      }
    } catch (error) {
      console.error("❌ Error fetching client data:", error);
      setError(error.message);
      toast.error("Failed to load client details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const handleRemoveGuard = async (guardId, guardName) => {
    if (
      !confirm(`Are you sure you want to remove ${guardName} from this client?`)
    ) {
      return;
    }

    try {
      setRefreshing(true);

      // Use DELETE method with query parameter
      const response = await fetch(
        `/api/auth/client/${clientId}/guards?guardId=${guardId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(`${guardName} removed successfully!`);
        // Refresh data
        await fetchClientData();
      } else {
        toast.error(data.error || "Failed to remove guard");
      }
    } catch (error) {
      console.error("Error removing guard:", error);
      toast.error("Error removing guard");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle guard assignment
  const handleGuardAssign = async (guardId) => {
    try {
      setRefreshing(true);

      const response = await fetch(`/api/auth/client/${clientId}/guards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guardId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Guard assigned successfully!");
        // Refresh data
        await fetchClientData();
      } else {
        toast.error(data.error || "Failed to assign guard");
      }
    } catch (error) {
      console.error("Error assigning guard:", error);
      toast.error("Error assigning guard");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDocumentUpload = async () => {
    try {
      setRefreshing(true);

      // Refresh only client-specific documents
      const docsResponse = await fetch(
        `/api/auth/client/${clientId}/documents`
      );
      if (docsResponse.ok) {
        const docsData = await docsResponse.json();

        // Filter out any company documents (just in case)
        const clientSpecificDocs = docsData.documents.filter(
          (doc) => !doc.isCompanyDocument && doc.category === "client"
        );

        setClientDocuments(clientSpecificDocs || []);
        toast.success("Client documents refreshed successfully!");
      } else {
        toast.error("Failed to refresh documents");
      }
    } catch (error) {
      console.error("Error refreshing documents:", error);
      toast.error("Error refreshing documents");
    } finally {
      setRefreshing(false);
    }
  };

  // Format address
  const formatAddress = (address) => {
    if (!address) return "Address not provided";

    if (typeof address === "string") return address;

    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.postalCode) parts.push(address.postalCode);
    if (address.country && address.country !== "India")
      parts.push(address.country);

    return parts.join(", ") || "Address not provided";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Not set";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Not set";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getDocumentTypeName = (typeId) => {
    const documentCategories = [
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

    const category = documentCategories.find((cat) => cat.id === typeId);
    return category ? category.name : typeId;
  };

  // Download document with custom filename
  const handleDownloadDocument = (doc) => {
    try {
      // Extract file extension
      const fileExtension =
        doc.originalName?.split(".").pop() ||
        doc.fileName?.split(".").pop() ||
        "";

      // Get document type name
      const docTypeName = getDocumentTypeName(doc.type);

      // Format date for filename (use custom date if available, otherwise use upload date)
      let dateForFilename = "";

      if (doc.documentStartDate) {
        const date = new Date(doc.documentStartDate);
        dateForFilename = date
          .toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })
          .replace(/ /g, "-")
          .replace(/,/g, "");
      } else if (doc.uploaded) {
        const date = new Date(doc.uploaded);
        dateForFilename = date
          .toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })
          .replace(/ /g, "-")
          .replace(/,/g, "");
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

      // Add extension
      fileName += `.${fileExtension}`;

      // Create download link
      const link = document.createElement("a");
      link.href = doc.fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading: ${fileName}`);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Error downloading document");

      // Fallback to original download
      const link = document.createElement("a");
      link.href = doc.fileUrl;
      link.download = doc.originalName || doc.name || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteDocument = async (documentId, documentName) => {
    if (
      !confirm(
        `Are you sure you want to delete "${documentName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setRefreshing(true);

      // Fetch API with credentials (cookies will be sent automatically)
      const response = await fetch(
        `/api/auth/client/${clientId}/documents?documentId=${documentId}`,
        {
          method: "DELETE",
          credentials: "include", // This sends cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Delete response status:", response.status);

      const data = await response.json();
      console.log("Delete response data:", data);

      if (response.ok) {
        toast.success("Document deleted successfully!");
        // Update the documents list by filtering out the deleted document
        setClientDocuments((prevDocs) =>
          prevDocs.filter((doc) => doc.id !== documentId)
        );
      } else {
        toast.error(data.error || "Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Error deleting document");
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate contract status
  const getContractStatus = () => {
    if (!client?.contractEndDate) return "No Contract";

    const today = new Date();
    const endDate = new Date(client.contractEndDate);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays <= 30) return "Expiring Soon";
    return "Active";
  };

  // Format date only (without time)
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

  // Check if filters are active
  const isFilterActive =
    documentTypeFilter !== "all" ||
    periodFilter !== "" ||
    statusFilter !== "all";

  
const filteredDocuments = useMemo(() => {
  // First, filter out company documents
  let filtered = clientDocuments.filter(doc => 
    !doc.isCompanyDocument && doc.category === "client"
  );
  
  // Then apply other filters
  if (documentTypeFilter !== "all") {
    filtered = filtered.filter(doc => doc.type === documentTypeFilter);
  }
  
  if (periodFilter && periodFilter.trim()) {
    const query = periodFilter.toLowerCase();
    filtered = filtered.filter(doc => 
      (doc.documentPeriod && doc.documentPeriod.toLowerCase().includes(query)) ||
      (doc.documentStartDate && formatDateOnly(doc.documentStartDate).toLowerCase().includes(query)) ||
      (doc.documentEndDate && formatDateOnly(doc.documentEndDate).toLowerCase().includes(query))
    );
  }
  
  if (statusFilter !== "all") {
    filtered = filtered.filter(doc => doc.status === statusFilter);
  }
  
  return filtered;
}, [clientDocuments, documentTypeFilter, periodFilter, statusFilter]);

  // Clear all filters
  const clearFilters = () => {
    setDocumentTypeFilter("all");
    setPeriodFilter("");
    setStatusFilter("all");
  };

  // Calculate remaining days
  const getRemainingDays = () => {
    if (!client?.contractEndDate) return null;

    const today = new Date();
    const endDate = new Date(client.contractEndDate);
    const diffTime = endDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Client Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            {error || "Client details could not be loaded."}
          </p>
          <Button
            className="cursor-pointer"
            onClick={() => router.push("/admin-dashboard/clients")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin-dashboard/clients")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Client Details</h1>
            <p className="text-muted-foreground">
              Manage {client.name}'s information
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={fetchClientData}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => setActiveTab("documents")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Documents ({clientDocuments.length})
          </Button>

          <Button
            className="cursor-pointer"
            onClick={() => setAssignGuardOpen(true)}
          >
            <Users className="h-4 w-4 mr-2" />
            Assign Guard
          </Button>
        </div>
      </div>

      {/* Client Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl">
              {client.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Badge
                variant={client.status === "Active" ? "default" : "secondary"}
              >
                {client.status || "Active"}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {client.clientType || "Corporate"}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined {formatDate(client.joinDate)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">Contract Number</p>
          <p className="text-lg font-semibold">
            {client.contractNumber || "No contract"}
          </p>
          <Badge
            variant={
              getContractStatus() === "Active"
                ? "default"
                : getContractStatus() === "Expiring Soon"
                ? "secondary"
                : "destructive"
            }
            className="mt-2"
          >
            {getContractStatus()}
            {getRemainingDays() && getContractStatus() !== "Expired" && (
              <span className="ml-1">({getRemainingDays()} days)</span>
            )}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger className="cursor-pointer" value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="details">
            Details
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="guards">
            Guards ({assignedGuards.length})
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="documents">
            Documents ({clientDocuments.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Assigned Guards
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {assignedGuards.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Required: {client.requiredGuards?.total || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <Progress
                  value={
                    client.requiredGuards?.total
                      ? (assignedGuards.length / client.requiredGuards.total) *
                        100
                      : 0
                  }
                  className="mt-4 h-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Contract Value
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      ₹{(client.contractValue || 0).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monthly: ₹
                      {Math.round(
                        (client.contractValue || 0) / 12
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Service Sites
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {client.sites?.length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {client.sites?.[0]?.siteName || "No sites"}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Service Types
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {client.serviceType?.length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {client.securityPlan || "Standard"} Plan
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Email Address
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">{client.email}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Phone Number
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">
                        {client.phone || "Not provided"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Alternate Phone
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">
                        {client.alternatePhone || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Company
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">
                        {client.companyName || "No company"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Designation
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <IdCard className="h-4 w-4" />
                      <span className="font-medium">
                        {client.designation || "Not specified"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Address
                    </Label>
                    <div className="flex items-start gap-2 mt-1">
                      <MapPin className="h-4 w-4 mt-1" />
                      <span className="font-medium">
                        {formatAddress(client.address)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSignature className="h-5 w-5" />
                Contract Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Start Date
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">
                      {formatDate(client.contractStartDate)}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    End Date
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">
                      {formatDate(client.contractEndDate)}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    Contract Value
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">
                      ₹{(client.contractValue || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              {client.serviceType && client.serviceType.length > 0 && (
                <div className="mt-6">
                  <Label className="text-sm text-muted-foreground">
                    Service Types
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {client.serviceType.map((service, index) => (
                      <Badge key={index} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment Required */}
              {client.equipmentRequired &&
                client.equipmentRequired.length > 0 && (
                  <div className="mt-6">
                    <Label className="text-sm text-muted-foreground">
                      Equipment Required
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {client.equipmentRequired.map((equipment, index) => (
                        <Badge key={index} variant="secondary">
                          {equipment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sites Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Service Sites
                </CardTitle>
              </CardHeader>
              <CardContent>
                {client.sites && client.sites.length > 0 ? (
                  <div className="space-y-4">
                    {client.sites.map((site, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">
                          {site.siteName || "Unnamed Site"}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {site.address || "No address"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <User className="h-3 w-3 inline mr-1" />
                          {site.contactPerson || "No contact"}
                        </div>
                        {site.contactNumber && (
                          <div className="text-sm text-muted-foreground">
                            <Phone className="h-3 w-3 inline mr-1" />
                            {site.contactNumber}
                          </div>
                        )}
                        <Badge
                          variant={site.isActive ? "default" : "secondary"}
                          className="mt-2"
                        >
                          {site.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No service sites configured
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {client.emergencyContacts &&
                client.emergencyContacts.length > 0 ? (
                  <div className="space-y-4">
                    {client.emergencyContacts.map((contact, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="font-medium mb-2">
                          {contact.name || "Unnamed Contact"}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          <span className="font-medium">Relationship:</span>{" "}
                          {contact.relationship || "Not specified"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 inline mr-1" />
                          {contact.phone || "No phone number"}
                        </div>
                        <Badge variant="outline" className="mt-2">
                          Priority: {contact.priority || 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No emergency contacts added
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.notes ? (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="whitespace-pre-wrap">{client.notes}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No additional notes</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guards Tab */}
        <TabsContent value="guards" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Assigned Guards</h2>
              <p className="text-muted-foreground">
                {assignedGuards.length} guard(s) assigned • Required:{" "}
                {client.requiredGuards?.total || 0}
              </p>
            </div>
            <Dialog open={assignGuardOpen} onOpenChange={setAssignGuardOpen}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer" disabled={refreshing}>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Guard
                </Button>
              </DialogTrigger>
              <AssignGuardDialog
                open={assignGuardOpen}
                onOpenChange={setAssignGuardOpen}
                clientId={clientId}
                onAssign={handleGuardAssign}
              />
            </Dialog>
          </div>

          {assignedGuards.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guard</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedGuards.map((guard) => (
                      <TableRow key={guard.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {guard.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{guard.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {guard.designation}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{guard.email}</div>
                            <div className="text-sm text-muted-foreground">
                              {guard.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              guard.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {guard.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{guard.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            <span>{guard.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 cursor-pointer w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/admin-dashboard/guard-details/${guard.id}`
                                  )
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  handleRemoveGuard(guard.id, guard.name)
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Guards Assigned</h3>
              <p className="text-muted-foreground mb-4">
                This client has no assigned guards yet. Assign guards to start
                security services.
              </p>
              <Dialog open={assignGuardOpen} onOpenChange={setAssignGuardOpen}>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" />
                    Assign First Guard
                  </Button>
                </DialogTrigger>
                <AssignGuardDialog
                  open={assignGuardOpen}
                  onOpenChange={setAssignGuardOpen}
                  clientId={clientId}
                  onAssign={handleGuardAssign}
                />
              </Dialog>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Client Documents</h2>
              <p className="text-muted-foreground">
                {clientDocuments.length} document(s) uploaded
              </p>
            </div>

            <Button
              className="cursor-pointer"
              onClick={() => setUploadDocumentOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          {/* FILTER SECTION ADD KARO */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Document Type Filter */}
                <div>
                  <Label
                    htmlFor="type-filter"
                    className="text-sm font-medium mb-2 block"
                  >
                    Document Type
                  </Label>
                  <Select
                    value={documentTypeFilter}
                    onValueChange={setDocumentTypeFilter}
                  >
                    <SelectTrigger id="type-filter" className="w-full">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="agreement">Agreement</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="bills">Bills</SelectItem>
                      <SelectItem value="salary-sheet">Salary Sheet</SelectItem>
                      <SelectItem value="pay-slip">Pay Slip</SelectItem>
                      <SelectItem value="esi">ESI</SelectItem>
                      <SelectItem value="pf">PF</SelectItem>
                      <SelectItem value="employee-details">
                        Employee Details
                      </SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="night-checking">
                        Night Checking
                      </SelectItem>
                      <SelectItem value="paid-gst">Paid GST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Month/Period Filter */}
                <div>
                  <Label
                    htmlFor="period-filter"
                    className="text-sm font-medium mb-2 block"
                  >
                    Period/Month
                  </Label>
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
                  <Label
                    htmlFor="status-filter"
                    className="text-sm font-medium mb-2 block"
                  >
                    Status
                  </Label>
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
                    disabled={!isFilterActive}
                    
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredDocuments.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">
                      Document Name
                    </TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Start Date</TableHead>
                    <TableHead className="font-semibold">End Date</TableHead>
                    <TableHead className="font-semibold">Period</TableHead>
                    <TableHead className="font-semibold">Uploaded</TableHead>
                    <TableHead className="font-semibold">Size</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate max-w-xs">
                              {doc.name || "Unnamed Document"}
                            </div>
                            {doc.description && (
                              <p className="text-sm text-muted-foreground mt-1 truncate max-w-xs">
                                {doc.description}
                              </p>
                            )}
                            {doc.uploadedBy && (
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {doc.uploadedBy.name} (
                                {doc.uploadedBy.role || "User"})
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {getDocumentTypeName(doc.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {doc.documentStartDate ? (
                            <span className="font-medium">
                              {formatDateOnly(doc.documentStartDate)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Not set
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {doc.documentEndDate ? (
                            <span className="font-medium">
                              {formatDateOnly(doc.documentEndDate)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Not set
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.documentPeriod ? (
                          <Badge variant="secondary" className="font-medium">
                            {doc.documentPeriod}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground italic">
                            N/A
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {formatDate(doc.uploaded)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            by {doc.uploadedBy?.name || "Unknown"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatFileSize(doc.size)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            doc.status === "approved"
                              ? "default"
                              : doc.status === "pending"
                              ? "secondary"
                              : doc.status === "rejected"
                              ? "destructive"
                              : "outline"
                          }
                          className="font-medium"
                        >
                          {doc.status
                            ? doc.status.charAt(0).toUpperCase() +
                              doc.status.slice(1)
                            : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(doc.fileUrl, "_blank")}
                            title="View Document"
                            className="h-8 w-8 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadDocument(doc)}
                            title="Download Document"
                            className="h-8 w-8 cursor-pointer"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeleteDocument(
                                doc.id,
                                doc.name || "Unnamed Document"
                              )
                            }
                            title="Delete Document"
                            className="h-8 w-8 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={refreshing}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Documents Found</h3>
              <p className="text-muted-foreground mb-4">
                {clientDocuments.length === 0
                  ? "No documents uploaded for this client yet. Upload documents for contracts, reports, and other important files."
                  : "No documents match your filter criteria. Try changing your filters."}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setUploadDocumentOpen(true)}>
                  <Plus className="h-4 w-4 mr-2 cursor-pointer" />
                  Upload First Document
                </Button>
                {isFilterActive && (
                  <Button className="cursor-pointer" variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* UploadDialog */}

          <UploadDocumentDialog
            open={uploadDocumentOpen}
            onOpenChange={setUploadDocumentOpen}
            clientId={clientId}
            onUpload={handleDocumentUpload}
            isAdmin={false}
            isCompanyDocuments={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
