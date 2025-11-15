// File: src/components/admin/RequestReports.jsx
"use client";

import { useState, useEffect } from "react";
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
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch requests from API
  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/requests");
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to load requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    const variants = {
      pending: {
        className: "text-amber-800 border-amber-200",
        icon: Clock,
      },
      fulfilled: {
        className: "text-blue-800 border-blue-200",
        icon: AlertCircle,
      },
      completed: {
        className: "text-green-800 border-green-200",
        icon: CheckCircle,
      },
    };
    const config = variants[status] || {
      className: "text-gray-800 border-gray-200",
      icon: Clock,
    };
    const IconComponent = config.icon;

    return (
      <Badge
        variant="outline"
        className={`rounded-full flex items-center gap-1 text-xs font-semibold border ${config.className}`}
      >
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      "Service Agreement": FileText,
      "NDA Document": FileText,
      "Compliance Form": FileText,
      "Contract Document": FileText,
      "Security Protocol": FileText,
      "General Document": FileText,
    };
    return icons[type] || FileText;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setEditDialogOpen(true);
  };

  const handleUpdateRequest = async (formData) => {
    if (!selectedRequest) return;

    try {
      setUpdating(true);
      const response = await fetch("/api/admin/requests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          status: formData.status,
          adminNotes: formData.adminNotes,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Request updated successfully",
        });
        fetchRequests();
        setEditDialogOpen(false);
      } else {
        throw new Error("Failed to update request");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast({
        title: "Error",
        description: "Failed to update request",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    try {
      const response = await fetch("/api/admin/requests", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Request deleted successfully",
        });
        fetchRequests();
      } else {
        throw new Error("Failed to delete request");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive",
      });
    }
  };

  // Statistics
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    fulfilled: requests.filter((r) => r.status === "fulfilled").length,
    completed: requests.filter((r) => r.status === "completed").length,
    urgent: requests.filter(
      (r) =>
        r.documentType === "Urgent Request" ||
        r.documentType === "Security Protocol"
    ).length,
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
              Manage client document requests and submissions
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg self-start sm:self-auto">
            <FileText className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {/* Total Card */}
          <div className="group bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Total
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.total}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">All requests</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors duration-300 flex-shrink-0 ml-4">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="group bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Pending
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.pending}
                  </h3>
                  {stats.total > 0 && (
                    <span className="text-sm font-semibold px-2 py-1 rounded-full bg-amber-500/10 text-amber-600">
                      {Math.round((stats.pending / stats.total) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting action</p>
              </div>
              <div className="p-3 rounded-xl text-primary duration-300 flex-shrink-0 ml-4">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Fulfilled Card */}
          <div className="group bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Fulfilled
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.fulfilled}
                  </h3>
                  {stats.total > 0 && (
                    <span className="text-sm font-semibold px-2 py-1 rounded-full bg-blue-500/10 text-blue-600">
                      {Math.round((stats.fulfilled / stats.total) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </div>
              <div className="p-3 rounded-xl text-primary flex-shrink-0 ml-4">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Completed Card */}
          <div className="group bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Completed
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.completed}
                  </h3>
                  {stats.total > 0 && (
                    <span className="text-sm font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-600">
                      {Math.round((stats.completed / stats.total) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Fully resolved</p>
              </div>
              <div className="p-3 rounded-xl text-primary flex-shrink-0 ml-4">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Urgent Card */}
          <div className="group bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Urgent
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.urgent}
                  </h3>
                  {stats.total > 0 && (
                    <span className="text-sm font-semibold px-2 py-1 rounded-full bg-red-500/10 text-red-600">
                      {Math.round((stats.urgent / stats.total) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Urgent attention
                </p>
              </div>
              <div className="p-3 rounded-xl text-primary flex-shrink-0 ml-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-border">
            {/* Requests Filters Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
              {/* Search Bar */}
              <div className="flex items-center gap-2 w-full sm:w-72 relative">
                <Search className="h-4 w-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search requests..."
                  className="h-10 pl-10 border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] border-border focus:border-primary text-foreground">
                    <Filter className="h-4 w-4 mr-2 text-primary" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="fulfilled">Fulfilled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Type Filter */}
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[160px] border-border focus:border-primary text-foreground">
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Service Agreement">
                      Service Agreement
                    </SelectItem>
                    <SelectItem value="NDA Document">NDA Document</SelectItem>
                    <SelectItem value="Compliance Form">
                      Compliance Form
                    </SelectItem>
                    <SelectItem value="Contract Document">
                      Contract Document
                    </SelectItem>
                    <SelectItem value="Security Protocol">
                      Security Protocol
                    </SelectItem>
                    <SelectItem value="General Document">
                      General Document
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchRequests}
                  className="h-10 cursor-pointer border-border text-primary hover:bg-primary/10 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading requests...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border">
                      <TableHead className="text-left font-semibold text-foreground">
                        Client
                      </TableHead>
                      <TableHead className="text-left font-semibold text-foreground hidden lg:table-cell">
                        Company
                      </TableHead>
                      <TableHead className="text-left font-semibold text-foreground">
                        Document & Type
                      </TableHead>
                      <TableHead className="text-center font-semibold text-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-left font-semibold text-foreground hidden xl:table-cell">
                        Date
                      </TableHead>
                      <TableHead className="text-right font-semibold text-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => {
                      const TypeIcon = getTypeIcon(request.documentType);
                      return (
                        <TableRow
                          key={request._id}
                          className="hover:bg-muted/30 transition-colors border-b border-border"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground text-sm">
                                  {request.clientName}
                                </div>
                                <div className="text-xs text-muted-foreground lg:hidden">
                                  {request.company || "No company"}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1 md:hidden">
                                  <Mail className="h-3 w-3" />
                                  {request.clientEmail}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="text-sm text-muted-foreground">
                              {request.company || "No company"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              <div className="font-medium text-foreground text-sm truncate">
                                {request.documentName}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <TypeIcon className="h-3 w-3" />
                                {request.documentType}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              {getStatusBadge(request.status)}
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
                                className="h-8 w-8 p-0 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted"
                                onClick={() => handleEditRequest(request)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {filteredRequests.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No requests found
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery ||
                      statusFilter !== "all" ||
                      typeFilter !== "all"
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
                        <div className="text-sm text-muted-foreground">
                          Client Name
                        </div>
                        <div className="font-medium text-foreground">
                          {selectedRequest.clientName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Mail className="h-4 w-4 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Email
                        </div>
                        <div className="font-medium text-foreground">
                          {selectedRequest.clientEmail}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Building className="h-4 w-4 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Company
                        </div>
                        <div className="font-medium text-foreground">
                          {selectedRequest.company || "Not provided"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Document Type
                        </div>
                        <div className="font-medium text-foreground">
                          {selectedRequest.documentType}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Document Name
                  </Label>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="font-medium text-foreground">
                      {selectedRequest.documentName}
                    </div>
                  </div>
                </div>

                {selectedRequest.additionalInfo && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">
                      Additional Information
                    </Label>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border max-h-40 overflow-y-auto">
                      <div className="text-foreground whitespace-pre-wrap">
                        {selectedRequest.additionalInfo}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <span className="text-sm text-foreground">
                      {formatDate(selectedRequest.createdAt)}
                    </span>
                  </div>
                </div>

                {selectedRequest.adminNotes && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">
                      Admin Notes
                    </Label>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 max-h-40 overflow-y-auto">
                      <div className="text-foreground whitespace-pre-wrap">
                        {selectedRequest.adminNotes}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
                className="border-border hover:bg-muted cursor-pointer"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setViewDialogOpen(false);
                  setEditDialogOpen(true);
                }}
              >
                <Edit className="h-4 w-4 mr-2 cursor-pointer" />
                Edit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Request Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex cursor-pointer items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Edit Document Request
              </DialogTitle>
              <DialogDescription>
                Update the status and add notes for this document request
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    status: formData.get("status"),
                    adminNotes: formData.get("adminNotes"),
                  };
                  handleUpdateRequest(data);
                }}
              >
                <div className="space-y-6 py-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="status" className="text-foreground">
                        Status
                      </Label>
                      <Select
                        name="status"
                        defaultValue={selectedRequest.status}
                      >
                        <SelectTrigger className="border-border focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="fulfilled">Fulfilled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="adminNotes" className="text-foreground">
                      Admin Notes
                    </Label>
                    <Textarea
                      id="adminNotes"
                      name="adminNotes"
                      placeholder="Add internal notes about this request..."
                      defaultValue={selectedRequest.adminNotes}
                      rows={4}
                      className="border-border focus:border-primary resize-none"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <h4 className="font-medium text-foreground mb-2">
                      Request Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Client:</span>
                        <p className="text-foreground">
                          {selectedRequest.clientName}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="text-foreground">
                          {selectedRequest.clientEmail}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Document:</span>
                        <p className="text-foreground">
                          {selectedRequest.documentName}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="text-foreground">
                          {selectedRequest.documentType}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <p className="text-foreground">
                          {formatDate(selectedRequest.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    className="border-border cursor-pointer hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleDeleteRequest(selectedRequest._id)}
                    className="cursor-pointer"
                  >
                    Delete Request
                  </Button>
                  <Button type="submit" disabled={updating}>
                    {updating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin cursor-pointer" />
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
      </div>
    </div>
  );
}
