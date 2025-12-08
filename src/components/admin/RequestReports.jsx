// File: src/components/admin/RequestReports.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  User,
  Mail,
  FileText,
  RefreshCw,
  Edit,
  Eye,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  AlertOctagon,
  Upload,
  Download,
  Trash2,
  PlusCircle,
  FileCheck
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function RequestReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    "in-progress": 0,
    completed: 0,
    rejected: 0,
    cancelled: 0,
    urgent: 0,
    high: 0
  });
  
  const hasFetchedRef = useRef(false);

  // Document types from your model
  const documentTypes = [
    "agreement",
    "attendance",
    "bills",
    "salary-sheet",
    "pay-slip",
    "esi",
    "pf",
    "employee-details",
    "training",
    "night-checking",
    "paid-gst",
    "msme",
    "gst",
    "pasara",
    "pan",
    "profile",
    "bank-details",
    "license",
    "certificate",
    "contract",
    "invoice",
    "report",
    "other"
  ];

  // Priority levels
  const priorityLevels = [
    { value: "low", label: "Low", color: "gray" },
    { value: "medium", label: "Medium", color: "blue" },
    { value: "high", label: "High", color: "orange" },
    { value: "urgent", label: "Urgent", color: "red" }
  ];

  // Status options
  const statusOptions = [
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "in-progress", label: "In Progress", color: "blue" },
    { value: "completed", label: "Completed", color: "green" },
    { value: "rejected", label: "Rejected", color: "red" },
    { value: "cancelled", label: "Cancelled", color: "gray" }
  ];

  // New request form state
  const [newRequest, setNewRequest] = useState({
    clientId: "",
    documentName: "",
    documentType: "",
    description: "",
    priority: "medium",
    requiredBy: "",
    adminNotes: ""
  });

  // Initial fetch only once on mount
  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchRequests();
      hasFetchedRef.current = true;
    }
  }, []);

  // Fetch requests from API - ONLY when manually called
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (searchQuery) params.append("search", searchQuery);
      
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/admin/requests?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.requests || []);
        setStats(data.stats || {});
      } else {
        throw new Error(data.error || "Failed to load requests");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients for new request form
  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/admin/clients", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setClients(data.clients || []);
        }
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // Filter requests based on search and filters
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.documentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.documentType?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesType =
      typeFilter === "all" || request.documentType === typeFilter;
    const matchesPriority =
      priorityFilter === "all" || request.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  // Get status badge with colors
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        className: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Clock,
        label: "Pending"
      },
      "in-progress": {
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: AlertCircle,
        label: "In Progress"
      },
      completed: {
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Completed"
      },
      rejected: {
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "Rejected"
      },
      cancelled: {
        className: "bg-gray-100 text-gray-800 border-gray-200",
        icon: XCircle,
        label: "Cancelled"
      }
    };
    
    const config = statusMap[status] || {
      className: "bg-gray-100 text-gray-800 border-gray-200",
      icon: Clock,
      label: status
    };
    
    const IconComponent = config.icon;

    return (
      <Badge
        variant="outline"
        className={`rounded-full flex items-center gap-1 text-xs font-semibold border ${config.className}`}
      >
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const priorityMap = {
      low: "bg-gray-100 text-gray-800 border-gray-200",
      medium: "bg-blue-100 text-blue-800 border-blue-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      urgent: "bg-red-100 text-red-800 border-red-200"
    };
    
    const className = priorityMap[priority] || priorityMap.medium;
    
    return (
      <Badge
        variant="outline"
        className={`text-xs capitalize ${className}`}
      >
        {priority}
      </Badge>
    );
  };

  // Get document type label
  const getDocumentTypeLabel = (type) => {
    const typeMap = {
      "agreement": "Agreement",
      "attendance": "Attendance",
      "bills": "Bills",
      "salary-sheet": "Salary Sheet",
      "pay-slip": "Pay Slip",
      "esi": "ESI",
      "pf": "PF",
      "employee-details": "Employee Details",
      "training": "Training",
      "night-checking": "Night Checking",
      "paid-gst": "Paid GST",
      "msme": "MSME",
      "gst": "GST",
      "pasara": "Pasara",
      "pan": "PAN",
      "profile": "Profile",
      "bank-details": "Bank Details",
      "license": "License",
      "certificate": "Certificate",
      "contract": "Contract",
      "invoice": "Invoice",
      "report": "Report",
      "other": "Other"
    };
    
    return typeMap[type] || type;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Handle view request
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  // Handle edit request
  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setEditDialogOpen(true);
  };

  // Handle create new request
  const handleCreateRequest = () => {
    fetchClients();
    setCreateDialogOpen(true);
  };

  // Handle update request
  // In your RequestReports.jsx component, update the handleUpdateRequest function:

const handleUpdateRequest = async (formData) => {
  if (!selectedRequest) return;

  try {
    setUpdating(true);
    const token = localStorage.getItem("authToken");
    
    const response = await fetch("/api/admin/requests", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        requestId: selectedRequest._id,
        ...formData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      toast({
        title: "Success",
        description: "Request updated successfully",
      });
      fetchRequests();
      setEditDialogOpen(false);
    } else {
      throw new Error(data.error || "Failed to update request");
    }
  } catch (error) {
    console.error("Error updating request:", error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setUpdating(false);
  }
};

  // Handle create new request
  const handleCreateNewRequest = async () => {
    try {
      if (!newRequest.clientId || !newRequest.documentName || !newRequest.documentType) {
        toast({
          title: "Validation Error",
          description: "Client, Document Name and Type are required",
          variant: "destructive",
        });
        return;
      }

      setUpdating(true);
      const token = localStorage.getItem("authToken");
      
      const response = await fetch("/api/admin/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRequest),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Document request created successfully",
        });
        fetchRequests();
        setCreateDialogOpen(false);
        setNewRequest({
          clientId: "",
          documentName: "",
          documentType: "",
          description: "",
          priority: "medium",
          requiredBy: "",
          adminNotes: ""
        });
      } else {
        throw new Error(data.error || "Failed to create request");
      }
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

 // RequestReports.jsx component mein yeh function update karein:

const handleDeleteRequest = async (id) => {
  if (!confirm("Are you sure you want to delete this request? This action cannot be undone.")) return;

  try {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`/api/admin/requests?id=${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      toast({
        title: "Success",
        description: "Request deleted successfully",
      });
      fetchRequests(); // Refresh the list
    } else {
      throw new Error(data.error || "Failed to delete request");
    }
  } catch (error) {
    console.error("Error deleting request:", error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};

  // Handle export to Excel
  const handleExport = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/admin/requests/export", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-requests-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        
        toast({
          title: "Success",
          description: "Export started successfully",
        });
      } else {
        throw new Error("Failed to export");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Document Requests Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track all client document requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              
              className="gap-2  bg-primary hover:bg-primary/90"
            >
              All Requests
            </Button>
            
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Card */}
          <Card className="rounded-xl border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Total Requests
                  </p>
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.total}
                  </h3>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Card */}
          <Card className="rounded-xl border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Pending
                  </p>
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.pending}
                  </h3>
                  {stats.total > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((stats.pending / stats.total) * 100)}% of total
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* In Progress Card */}
          <Card className="rounded-xl border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    In Progress
                  </p>
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats["in-progress"]}
                  </h3>
                  {stats.total > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((stats["in-progress"] / stats.total) * 100)}% of total
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <AlertCircle className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Card */}
          <Card className="rounded-xl border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Completed
                  </p>
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.completed}
                  </h3>
                  {stats.total > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((stats.completed / stats.total) * 100)}% of total
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Urgent Card */}
          <Card className="rounded-xl border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Urgent
                  </p>
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.urgent + stats.high}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Needs attention
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10">
                  <AlertOctagon className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-border">
            {/* Filters Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
              {/* Search Bar */}
              <div className="flex items-center gap-2 w-full sm:w-64 relative">
                <Search className="h-4 w-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search requests..."
                  className="h-10 pl-10 border-border focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      fetchRequests();
                    }
                  }}
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] border-border">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Document Type Filter */}
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px] border-border">
                    <FileText className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {getDocumentTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Priority Filter */}
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[120px] border-border">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    {priorityLevels.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Refresh Button - ONLY way to reload data */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchRequests}
                  disabled={loading}
                  className="h-10 cursor-pointer border-border"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading && requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading requests...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="text-left font-semibold">Client</TableHead>
                      <TableHead className="text-left font-semibold hidden lg:table-cell">Company</TableHead>
                      <TableHead className="text-left font-semibold">Document</TableHead>
                      <TableHead className="text-left font-semibold hidden md:table-cell">Type</TableHead>
                      <TableHead className="text-center font-semibold">Status</TableHead>
                      <TableHead className="text-center font-semibold hidden lg:table-cell">Priority</TableHead>
                      <TableHead className="text-left font-semibold hidden xl:table-cell">Date</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow
                        key={request._id}
                        className="hover:bg-muted/30 border-b border-border"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {request.clientName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {request.clientEmail}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-sm">
                            {request.clientCompany || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <div className="font-medium text-sm truncate">
                              {request.documentName}
                            </div>
                            <div className="text-xs text-muted-foreground lg:hidden">
                              {getDocumentTypeLabel(request.documentType)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {getDocumentTypeLabel(request.documentType)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {getStatusBadge(request.status)}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex justify-center">
                            {getPriorityBadge(request.priority)}
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <div className="text-sm text-muted-foreground">
                            {formatDate(request.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 cursor-pointer w-8 p-0"
                              onClick={() => handleViewRequest(request)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 cursor-pointer w-8 p-0"
                              onClick={() => handleEditRequest(request)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 cursor-pointer p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteRequest(request._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredRequests.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium mb-2">No requests found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || statusFilter !== "all" || typeFilter !== "all" || priorityFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "No document requests yet"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Request Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Document Request Details
              </DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <User className="h-4 w-4 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Client Name</div>
                        <div className="font-medium">{selectedRequest.clientName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Mail className="h-4 w-4 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div className="font-medium">{selectedRequest.clientEmail}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Building className="h-4 w-4 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Company</div>
                        <div className="font-medium">{selectedRequest.clientCompany || "Not provided"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Document Type</div>
                        <div className="font-medium">{getDocumentTypeLabel(selectedRequest.documentType)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Document Name</Label>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="font-medium">{selectedRequest.documentName}</div>
                  </div>
                </div>

                {selectedRequest.description && (
                  <div className="space-y-3">
                    <Label>Description</Label>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border max-h-40 overflow-y-auto">
                      <div className="whitespace-pre-wrap">{selectedRequest.description}</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div>{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Priority</div>
                    <div>{getPriorityBadge(selectedRequest.priority)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Request Date</div>
                    <div className="font-medium">{formatDate(selectedRequest.createdAt)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Required By</div>
                    <div className="font-medium">
                      {selectedRequest.requiredBy ? formatDate(selectedRequest.requiredBy) : "Not set"}
                    </div>
                  </div>
                </div>

                {selectedRequest.adminNotes && (
                  <div className="space-y-3">
                    <Label>Admin Notes</Label>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 max-h-40 overflow-y-auto">
                      <div className="whitespace-pre-wrap">{selectedRequest.adminNotes}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
                className="cursor-pointer"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setViewDialogOpen(false);
                  setEditDialogOpen(true);
                }}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Request Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Edit Document Request
              </DialogTitle>
              <DialogDescription>
                Update the status and details of this document request
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    status: formData.get("status"),
                    priority: formData.get("priority"),
                    adminNotes: formData.get("adminNotes"),
                    response: formData.get("response"),
                    description: formData.get("description"),
                    requiredBy: formData.get("requiredBy") || null
                  };
                  handleUpdateRequest(data);
                }}
              >
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" defaultValue={selectedRequest.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="priority">Priority</Label>
                      <Select name="priority" defaultValue={selectedRequest.priority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityLevels.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="requiredBy">Required By Date</Label>
                    <Input
                      type="date"
                      id="requiredBy"
                      name="requiredBy"
                      defaultValue={formatDateForInput(selectedRequest.requiredBy)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Update the description..."
                      defaultValue={selectedRequest.description}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="adminNotes">Admin Notes</Label>
                    <Textarea
                      id="adminNotes"
                      name="adminNotes"
                      placeholder="Add internal notes about this request..."
                      defaultValue={selectedRequest.adminNotes}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="response">Response to Client</Label>
                    <Textarea
                      id="response"
                      name="response"
                      placeholder="Add response/feedback for the client..."
                      defaultValue={selectedRequest.response}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button className="cursor-pointer" type="submit" disabled={updating}>
                    {updating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Update Request
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Request Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Create New Document Request
              </DialogTitle>
              <DialogDescription>
                Create a new document request on behalf of a client
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label htmlFor="clientId">Client *</Label>
                <Select
                  value={newRequest.clientId}
                  onValueChange={(value) => setNewRequest({...newRequest, clientId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client._id} value={client._id}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="documentName">Document Name *</Label>
                <Input
                  id="documentName"
                  placeholder="Enter document name"
                  value={newRequest.documentName}
                  onChange={(e) => setNewRequest({...newRequest, documentName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="documentType">Document Type *</Label>
                  <Select
                    value={newRequest.documentType}
                    onValueChange={(value) => setNewRequest({...newRequest, documentType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {getDocumentTypeLabel(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newRequest.priority}
                    onValueChange={(value) => setNewRequest({...newRequest, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter description..."
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="requiredBy">Required By Date</Label>
                <Input
                  type="date"
                  id="requiredBy"
                  value={newRequest.requiredBy}
                  onChange={(e) => setNewRequest({...newRequest, requiredBy: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Add internal notes..."
                  value={newRequest.adminNotes}
                  onChange={(e) => setNewRequest({...newRequest, adminNotes: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateNewRequest}
                disabled={updating}
                className="cursor-pointer"
              >
                {updating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}