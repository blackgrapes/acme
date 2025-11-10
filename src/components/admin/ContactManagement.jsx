"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Eye,
  Search,
  Filter,
  Mail,
  Phone,
  User,
  MessageCircle,
  RefreshCw,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  FileText,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  Zap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function ContactManagement({ contactTab, setContactTab }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch submissions from API
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contact/submissions");
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter submissions based on search and filters
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (submission.company &&
        submission.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      submission.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.message?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || submission.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || submission.priority === priorityFilter;
    const matchesCategory =
      categoryFilter === "all" || submission.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusBadge = (status) => {
    const variants = {
      New: {
        className: " text-blue-800 border-blue-200 ",
        icon: Clock,
      },
      "In Progress": {
        className: " text-amber-800 border-amber-200 ",
        icon: AlertCircle,
      },
      Replied: {
        className: " text-green-800 border-green-200 ",
        icon: CheckCircle,
      },
      Completed: {
        className: " text-emerald-800 border-emerald-200 ",
        icon: CheckCircle,
      },
    };
    const config = variants[status] || {
      className: " text-gray-800 border-gray-200 ",
      icon: Clock,
    };
    const IconComponent = config.icon;

    return (
      <Badge
        variant="outline"
        className={`rounded-full flex items-center gap-1 text-xs font-semibold border ${config.className}`}
      >
        <IconComponent className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      High: " text-red-800 border-red-200",
      Medium: " text-amber-800 border-amber-200",
      Low: "text-green-800 border-green-200 ",
    };
    return (
      <Badge
        variant="outline"
        className={`rounded-full text-xs font-semibold border ${
          variants[priority] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {priority}
      </Badge>
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "General Inquiry": MessageSquare,
      "Service Inquiry": FileText,
      Feedback: ThumbsUp,
      Complaint: AlertTriangle,
      Documentation: FileText,
      "Urgent Request": Zap,
    };
    return icons[category] || MessageSquare;
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

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleEditSubmission = (submission) => {
    setSelectedSubmission(submission);
    setEditDialogOpen(true);
  };

  const handleUpdateSubmission = async (formData) => {
    if (!selectedSubmission) return;

    try {
      setUpdating(true);
      const response = await fetch(
        `/api/contact/submissions/${selectedSubmission._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Submission updated successfully",
        });
        fetchSubmissions();
        setEditDialogOpen(false);
      } else {
        throw new Error("Failed to update submission");
      }
    } catch (error) {
      console.error("Error updating submission:", error);
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Statistics
  const stats = {
    total: submissions.length,
    new: submissions.filter((s) => s.status === "New").length,
    inProgress: submissions.filter((s) => s.status === "In Progress").length,
    replied: submissions.filter((s) => s.status === "Replied").length,
    completed: submissions.filter((s) => s.status === "Completed").length,
    highPriority: submissions.filter((s) => s.priority === "High").length,
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Contact Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage client inquiries, feedback, and service requests
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg self-start sm:self-auto">
            <MessageCircle className="h-6 w-6 text-primary" />
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
                <p className="text-xs text-muted-foreground">All submissions</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors duration-300 flex-shrink-0 ml-4">
                <MessageCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* New Card */}
          <div className="group bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  New
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.new}
                  </h3>
                  {stats.total > 0 && (
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        stats.new / stats.total >= 0.3
                          ? "bg-blue-500/10 text-blue-600"
                          : stats.new / stats.total >= 0.1
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {Math.round((stats.new / stats.total) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Pending review</p>
              </div>
              <div className="p-3 rounded-xl text-primary  duration-300 flex-shrink-0 ml-4">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* In Progress Card */}
          <div className="group bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  In Progress
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.inProgress}
                  </h3>
                  {stats.total > 0 && (
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        stats.inProgress / stats.total >= 0.3
                          ? "bg-amber-500/10 text-amber-600"
                          : stats.inProgress / stats.total >= 0.1
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {Math.round((stats.inProgress / stats.total) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Being handled</p>
              </div>
              <div className="p-3 rounded-xl text-primary flex-shrink-0 ml-4">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Replied Card */}
          <div className="group bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Replied
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.replied}
                  </h3>
                  {stats.total > 0 && (
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        stats.replied / stats.total >= 0.7
                          ? "bg-green-500/10 text-green-600"
                          : stats.replied / stats.total >= 0.3
                          ? "bg-green-500/10 text-green-600"
                          : "bg-green-500/10 text-green-600"
                      }`}
                    >
                      {Math.round((stats.replied / stats.total) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Responses sent</p>
              </div>
              <div className="p-3 rounded-xl text-primary flex-shrink-0 ml-4">
                <CheckCircle className="h-6 w-6" />
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
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        stats.completed / stats.total >= 0.7
                          ? "bg-emerald-500/10 text-emerald-600"
                          : stats.completed / stats.total >= 0.3
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-emerald-500/10 text-emerald-600"
                      }`}
                    >
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

          {/* High Priority Card */}
          <div className="group bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-border">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  High Priority
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-foreground">
                    {stats.highPriority}
                  </h3>
                  {stats.total > 0 && (
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        stats.highPriority / stats.total >= 0.3
                          ? "bg-red-500/10 text-red-600"
                          : stats.highPriority / stats.total >= 0.1
                          ? "bg-red-500/10 text-red-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {Math.round((stats.highPriority / stats.total) * 100)}%
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

        <Tabs
          value={contactTab}
          onValueChange={setContactTab}
          className="w-full"
        >
          <TabsList className="w-full bg-muted/40 border h-fit border-border rounded-2xl p-1.5 shadow-sm overflow-x-auto">
            <div className="flex gap-1 text-primary sm:gap-2 min-w-max justify-between">
              <TabsTrigger
                value="submissions"
                className="flex cursor-pointer items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-border text-muted-foreground hover:bg-background hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4 transition-colors text-muted-foreground data-[state=active]:text-primary" />
                <span className="whitespace-nowrap ">
                  Contact Submissions ({filteredSubmissions.length})
                </span>
              </TabsTrigger>
            </div>
          </TabsList>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6 mt-6">
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-border">
                {/* Submissions Filters Section */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
                  {/* Search Bar */}
                  <div className="flex items-center gap-2 w-full sm:w-72 relative">
                    <Search className="h-4 w-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      placeholder="Search submissions..."
                      className="h-10 pl-10 border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Filter Controls */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    {/* Status Filter */}
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[140px] border-border focus:border-primary text-foreground">
                        <Filter className="h-4 w-4 mr-2 text-primary" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-border">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Replied">Replied</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Priority Filter */}
                    <Select
                      value={priorityFilter}
                      onValueChange={setPriorityFilter}
                    >
                      <SelectTrigger className="w-[140px] border-border focus:border-primary text-foreground">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-border">
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Category Filter */}
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-[160px] border-border focus:border-primary text-foreground">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-border">
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="General Inquiry">
                          General Inquiry
                        </SelectItem>
                        <SelectItem value="Service Inquiry">
                          Service Inquiry
                        </SelectItem>
                        <SelectItem value="Feedback">Feedback</SelectItem>
                        <SelectItem value="Complaint">Complaint</SelectItem>
                        <SelectItem value="Documentation">
                          Documentation
                        </SelectItem>
                        <SelectItem value="Urgent Request">
                          Urgent Request
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Refresh Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchSubmissions}
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
                    <p className="text-muted-foreground">
                      Loading submissions...
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border">
                          <TableHead className="text-left font-semibold text-foreground">
                            Contact
                          </TableHead>
                          <TableHead className="text-left font-semibold text-foreground hidden lg:table-cell">
                            Company
                          </TableHead>
                          <TableHead className="text-left font-semibold text-foreground">
                            Subject & Category
                          </TableHead>
                          <TableHead className="text-center font-semibold text-foreground">
                            Status
                          </TableHead>
                          <TableHead className="text-center font-semibold text-foreground hidden md:table-cell">
                            Priority
                          </TableHead>
                          <TableHead className="text-left font-semibold text-foreground hidden xl:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="text-center font-semibold text-foreground">
                            Read
                          </TableHead>
                          <TableHead className="text-right font-semibold text-foreground">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubmissions.map((submission) => {
                          const CategoryIcon = getCategoryIcon(
                            submission.category
                          );
                          return (
                            <TableRow
                              key={submission._id}
                              className="hover:bg-muted/30 transition-colors border-b border-border"
                            >
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-foreground text-sm">
                                      {submission.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground lg:hidden">
                                      {submission.company || "No company"}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 md:hidden">
                                      <Mail className="h-3 w-3" />
                                      {submission.email}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <div className="text-sm text-muted-foreground">
                                  {submission.company || "No company"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[200px]">
                                  <div className="font-medium text-foreground text-sm truncate">
                                    {submission.subject}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <CategoryIcon className="h-3 w-3" />
                                    {submission.category}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center">
                                  {getStatusBadge(submission.status)}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="flex justify-center">
                                  {getPriorityBadge(submission.priority)}
                                </div>
                              </TableCell>
                              <TableCell className="hidden xl:table-cell">
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(submission.createdAt)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center">
                                  <Badge
                                    variant={
                                      submission.read ? "default" : "outline"
                                    }
                                    className={`rounded-full text-xs ${
                                      submission.read
                                        ? "bg-green-100 text-green-800 border-green-200"
                                        : "bg-gray-100 text-gray-800 border-gray-200"
                                    }`}
                                  >
                                    {submission.read ? "Read" : "Unread"}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted"
                                    onClick={() =>
                                      handleViewSubmission(submission)
                                    }
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted"
                                    onClick={() =>
                                      handleEditSubmission(submission)
                                    }
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

                    {filteredSubmissions.length === 0 && (
                      <div className="text-center py-12">
                        <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          No submissions found
                        </h3>
                        <p className="text-muted-foreground">
                          {searchQuery ||
                          statusFilter !== "all" ||
                          priorityFilter !== "all" ||
                          categoryFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "No contact submissions yet"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Submission Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Contact Submission Details
              </DialogTitle>
            </DialogHeader>
            {selectedSubmission && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <User className="h-4 w-4 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Name
                        </div>
                        <div className="font-medium text-foreground">
                          {selectedSubmission.name}
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
                          {selectedSubmission.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Phone className="h-4 w-4 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Phone
                        </div>
                        <div className="font-medium text-foreground">
                          {selectedSubmission.phone || "Not provided"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Building className="h-4 w-4 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Company
                        </div>
                        <div className="font-medium text-foreground">
                          {selectedSubmission.company || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Subject
                  </Label>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="font-medium text-foreground">
                      {selectedSubmission.subject}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Message
                  </Label>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border max-h-60 overflow-y-auto">
                    <div className="text-foreground whitespace-pre-wrap">
                      {selectedSubmission.message}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Priority:
                    </span>
                    {getPriorityBadge(selectedSubmission.priority)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Category:
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedSubmission.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Read:</span>
                    <span className="text-sm text-foreground">
                      {selectedSubmission.read ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <span className="text-sm text-foreground">
                      {formatDate(selectedSubmission.createdAt)}
                    </span>
                  </div>
                </div>

                {selectedSubmission.notes && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">
                      Admin Notes
                    </Label>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 max-h-40 overflow-y-auto">
                      <div className="text-foreground whitespace-pre-wrap">
                        {selectedSubmission.notes}
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
                Edit Submission
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Submission Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex cursor-pointer items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Edit Submission
              </DialogTitle>
              <DialogDescription>
                Update the status, priority, and notes for this submission
              </DialogDescription>
            </DialogHeader>
            {selectedSubmission && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    status: formData.get("status"),
                    priority: formData.get("priority"),
                    category: formData.get("category"),
                    read: formData.get("read") === "on",
                    notes: formData.get("notes"),
                  };
                  handleUpdateSubmission(data);
                }}
              >
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="status" className="text-foreground">
                          Status
                        </Label>
                        <Select
                          name="status"
                          defaultValue={selectedSubmission.status}
                        >
                          <SelectTrigger className="border-border focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Replied">Replied</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority" className="text-foreground">
                          Priority
                        </Label>
                        <Select
                          name="priority"
                          defaultValue={selectedSubmission.priority}
                        >
                          <SelectTrigger className="border-border focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="category" className="text-foreground">
                          Category
                        </Label>
                        <Select
                          name="category"
                          defaultValue={selectedSubmission.category}
                        >
                          <SelectTrigger className="border-border focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Inquiry">
                              General Inquiry
                            </SelectItem>
                            <SelectItem value="Service Inquiry">
                              Service Inquiry
                            </SelectItem>
                            <SelectItem value="Feedback">Feedback</SelectItem>
                            <SelectItem value="Complaint">Complaint</SelectItem>
                            <SelectItem value="Documentation">
                              Documentation
                            </SelectItem>
                            <SelectItem value="Urgent Request">
                              Urgent Request
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="checkbox"
                          id="read"
                          name="read"
                          defaultChecked={selectedSubmission.read}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <Label htmlFor="read" className="text-foreground">
                          Mark as Read
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-foreground">
                      Admin Notes
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Add internal notes about this submission..."
                      defaultValue={selectedSubmission.notes}
                      rows={4}
                      className="border-border focus:border-primary resize-none"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <h4 className="font-medium text-foreground mb-2">
                      Submission Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <p className="text-foreground">
                          {selectedSubmission.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="text-foreground">
                          {selectedSubmission.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Subject:</span>
                        <p className="text-foreground">
                          {selectedSubmission.subject}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <p className="text-foreground">
                          {formatDate(selectedSubmission.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    className="border-border cursor-pointer hover:bg-muted"
                  >
                    Cancel
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
                        Update Submission
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
