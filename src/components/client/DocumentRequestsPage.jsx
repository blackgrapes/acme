// File: src/components/client/DocumentRequestsPage.jsx - UPDATED STYLING
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon, FileText, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, Download, Eye, Trash2, Plus, ChevronLeft, ChevronRight, RefreshCw, ExternalLink, FilterX } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import RequestDocumentDialog from "./DocumentRequestModal";

const DocumentRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
    startDate: null,
    endDate: null,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const { toast } = useToast();

  // Fetch document requests
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.priority !== "all") params.append("priority", filters.priority);
      if (filters.startDate) params.append("startDate", format(filters.startDate, "yyyy-MM-dd"));
      if (filters.endDate) params.append("endDate", format(filters.endDate, "yyyy-MM-dd"));
      params.append("page", pagination.currentPage);
      params.append("limit", pagination.itemsPerPage);
      
      const response = await fetch(`/api/client/document-requests/create?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.data);
        setPagination(data.pagination);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch requests",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load document requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
    setTimeout(() => setRefreshing(false), 1000);
  }, [fetchRequests]);

  // Handle request deletion
  const handleDeleteRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      const response = await fetch(`/api/client/document-requests/create?id=${selectedRequest.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Document request cancelled successfully",
        });
        fetchRequests();
        setOpenDeleteDialog(false);
        setSelectedRequest(null);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to cancel request",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel document request",
        variant: "destructive",
      });
    }
  };

    // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      search: "",
      startDate: null,
      endDate: null,
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 rounded-full px-3 py-1">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-full px-3 py-1">
          <AlertCircle className="mr-1 h-3 w-3" /> In Progress
        </Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-full px-3 py-1">
          <CheckCircle className="mr-1 h-3 w-3" /> Completed
        </Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 rounded-full px-3 py-1">
          <XCircle className="mr-1 h-3 w-3" /> Cancelled
        </Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-3 py-1">Unknown</Badge>;
    }
  };

  // Get priority badge color
  const getPriorityBadge = (priority, isUrgent) => {
    if (isUrgent) {
      return <Badge variant="destructive" className="animate-pulse rounded-full px-3 py-1">
        <AlertCircle className="h-3 w-3 mr-1" /> URGENT
      </Badge>;
    }
    
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="rounded-full px-3 py-1">High</Badge>;
      case "medium":
        return <Badge className="bg-orange-500 hover:bg-orange-600 rounded-full px-3 py-1">Medium</Badge>;
      case "low":
        return <Badge className="bg-gray-500 hover:bg-gray-600 rounded-full px-3 py-1">Low</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-3 py-1">Unknown</Badge>;
    }
  };

  

  // Format date only (without time)
  const formatDateOnly = (dateString) => {
    if (!dateString) return "Not set";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Check if filters are active
  const isFilterActive = filters.status !== "all" || filters.priority !== "all" || 
                        filters.search || filters.startDate || filters.endDate;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h1 className="text-3xl font-bold text-foreground">Document Requests</h1>
          <p className="text-muted-foreground">
            Track and manage your document requests with our team
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="cursor-pointer rounded-lg"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                refreshing || loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Button 
            onClick={() => setOpenRequestDialog(true)} 
            className="rounded-lg cursor-pointer bg-primary shadow-lg gap-2"
          >
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium block">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Document name, description..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10 rounded-lg w-full"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium block">
                Status
              </Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger id="status" className="w-full rounded-lg">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium block">
                Priority
              </Label>
              <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
                <SelectTrigger id="priority" className="w-full rounded-lg">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

           

            {/* Clear Filters Button */}
            <div className="space-y-2">
              <Label className="text-sm font-medium block opacity-0">Clear</Label>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full cursor-pointer rounded-lg"
                disabled={!isFilterActive}
              >
                <FilterX className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Active Filters Indicator */}
          {isFilterActive && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Active filters:</span>
                <div className="flex flex-wrap gap-2 ml-2">
                  {filters.search && (
                    <Badge variant="secondary" className="rounded-full px-3 py-1 gap-1">
                      Search: "{filters.search}"
                    </Badge>
                  )}
                  {filters.status !== "all" && (
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      Status: {filters.status}
                    </Badge>
                  )}
                  {filters.priority !== "all" && (
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      Priority: {filters.priority}
                    </Badge>
                  )}
                  {filters.startDate && (
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      From: {formatDateOnly(filters.startDate)}
                    </Badge>
                  )}
                  {filters.endDate && (
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      To: {formatDateOnly(filters.endDate)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pagination.totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">All time requests</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {requests.filter(r => r.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {requests.filter(r => r.status === "in_progress").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Being processed</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {requests.filter(r => r.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ready for download</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Your Document Requests
              </CardTitle>
              <CardDescription>
                {loading
                  ? "Loading..."
                  : `Showing ${requests.length} of ${pagination.totalItems} requests`
                }
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
                  <TableHead className="font-semibold text-primary w-[100px] min-w-[100px]">
                    Priority
                  </TableHead>
                  <TableHead className="font-semibold text-primary w-[120px] min-w-[120px]">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-primary w-[140px] min-w-[140px]">
                    Requested
                  </TableHead>
                  <TableHead className="font-semibold text-primary w-[140px] min-w-[140px]">
                    Required By
                  </TableHead>
                  <TableHead className="text-right font-semibold text-primary w-[120px] min-w-[120px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">
                          Loading requests...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">No requests found</p>
                      <p className="text-sm">
                        {isFilterActive
                          ? "Try adjusting your search criteria or clear filters."
                          : "Submit your first document request"}
                      </p>
                      <Button 
                        onClick={() => setOpenRequestDialog(true)} 
                        className="mt-4 cursor-pointer rounded-lg"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow
                      key={request.id}
                      className="hover:bg-muted/50"
                    >
                      {/* Document Name */}
                      <TableCell className="font-medium w-[200px] min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-primary/10 shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold truncate" title={request.documentName}>
                              {request.documentName}
                            </div>
                            {request.description && (
                              <div className="text-sm text-muted-foreground truncate mt-1" title={request.description}>
                                {request.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Type */}
                      <TableCell className="w-[120px] min-w-[120px]">
                        <Badge
                          variant="outline"
                          className="rounded-full truncate max-w-full"
                        >
                          <span className="truncate block">
                            {request.documentType}
                          </span>
                        </Badge>
                      </TableCell>

                      {/* Priority */}
                      <TableCell className="w-[100px] min-w-[100px]">
                        {getPriorityBadge(request.priority, request.isUrgent)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="w-[120px] min-w-[120px]">
                        {getStatusBadge(request.status)}
                      </TableCell>

                      {/* Requested Date */}
                      <TableCell className="w-[140px] min-w-[140px]">
                        <div className="flex items-center gap-2">
                         
                          <span className="text-sm">
                            {formatDateOnly(request.requestDate)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Required By */}
                      <TableCell className="w-[140px] min-w-[140px]">
                        {request.requiredBy ? (
                          <div className="flex items-center gap-2">
                            
                            <span className="text-sm">
                              {formatDateOnly(request.requiredBy)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right w-[120px] min-w-[120px]">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setOpenDetailDialog(true);
                            }}
                            className="h-8 cursor-pointer w-8 p-0 rounded-lg shrink-0"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {request.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(request.downloadUrl || '#', "_blank")}
                              className="h-8 cursor-pointer w-8 p-0 rounded-lg shrink-0"
                              title="Download document"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {(request.status === "pending" || request.status === "in_progress") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setOpenDeleteDialog(true);
                              }}
                              className="h-8 cursor-pointer w-8 p-0 rounded-lg shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Cancel request"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && !loading && requests.length > 0 && (
            <div className="flex items-center justify-between p-6 border-t border-border/50">
              <div className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="rounded-lg cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 cursor-pointer p-0 rounded-lg"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="rounded-lg cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Request Details
            </DialogTitle>
            <DialogDescription>
              Complete information about your document request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Document Name</Label>
                  <p className="font-medium text-lg">{selectedRequest.documentName}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Document Type</Label>
                  <p>{selectedRequest.documentType}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Priority</Label>
                  <div>{getPriorityBadge(selectedRequest.priority, selectedRequest.isUrgent)}</div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Status</Label>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Request Date</Label>
                  <p>{formatDate(selectedRequest.requestDate)}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Required By</Label>
                  <p>{selectedRequest.requiredBy ? formatDate(selectedRequest.requiredBy) : "Not specified"}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm font-medium">Description</Label>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="whitespace-pre-wrap">
                    {selectedRequest.description || "No description provided"}
                  </p>
                </div>
              </div>
              
              {selectedRequest.adminNotes && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Admin Notes</Label>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm whitespace-pre-wrap">{selectedRequest.adminNotes}</p>
                  </div>
                </div>
              )}
              
              {selectedRequest.completedDate && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm font-medium">Completed On</Label>
                  <p>{formatDate(selectedRequest.completedDate)}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="gap-2">
            {selectedRequest?.status === "completed" && selectedRequest?.downloadUrl && (
              <Button onClick={() => window.open(selectedRequest.downloadUrl, "_blank")} className="rounded-lg">
                <Download className="mr-2 cursor-pointer h-4 w-4" />
                Download Document
              </Button>
            )}
            <Button variant="outline" onClick={() => setOpenDetailDialog(false)} className="rounded-lg cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Cancel Document Request
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this document request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="font-medium text-red-800">Request Details</p>
                </div>
                <div className="mt-2 text-sm text-red-700 space-y-1">
                  <p><strong>Document:</strong> {selectedRequest.documentName}</p>
                  <p><strong>Type:</strong> {selectedRequest.documentType}</p>
                  <p><strong>Status:</strong> {selectedRequest.status}</p>
                  <p><strong>Priority:</strong> {selectedRequest.priority}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDeleteDialog(false);
                setSelectedRequest(null);
              }}
              className="rounded-lg cursor-pointer"
            >
              Keep Request
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRequest}
              className="rounded-lg gap-2"
            >
              <Trash2 className="h-4 w-4 cursor-pointer" />
              Cancel Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Document Dialog */}
      <RequestDocumentDialog
        open={openRequestDialog}
        onOpenChange={setOpenRequestDialog}
        onSuccess={() => {
          fetchRequests();
          toast({
            title: "Success",
            description: "Document request submitted successfully",
          });
        }}
      />
    </div>
  );
};

export default DocumentRequestsPage;