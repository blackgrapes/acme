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
  Reply,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  User,
  MessageCircle,
  MoreVertical,
  Download,
  Archive,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Send,
  FileText,
  Building,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ContactManagement({
  contactTab,
  setContactTab,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch submissions from API
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact/submissions');
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter submissions based on search and filters
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (submission.company && submission.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      submission.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || submission.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || submission.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status) => {
    const variants = {
      New: { className: "bg-primary text-primary-foreground", icon: Clock },
      "In Progress": {
        className: "bg-warning text-warning-foreground",
        icon: AlertCircle,
      },
      Replied: { className: "bg-info text-info-foreground", icon: CheckCircle },
      Completed: {
        className: "bg-success text-success-foreground",
        icon: CheckCircle,
      },
    };
    const config = variants[status] || {
      className: "bg-secondary",
      icon: Clock,
    };
    const IconComponent = config.icon;

    return (
      <Badge
        variant="default"
        className={`rounded-full flex items-center gap-1 ${config.className}`}
      >
        <IconComponent className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      High: "bg-destructive text-destructive-foreground",
      Medium: "bg-warning text-warning-foreground",
      Low: "bg-success text-success-foreground",
    };
    return (
      <Badge variant="default" className={`rounded-full ${variants[priority]}`}>
        {priority}
      </Badge>
    );
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

  const handleReply = (submission) => {
    setSelectedSubmission(submission);
    setReplyDialogOpen(true);
  };

  const handleSendReply = async (replyData) => {
    try {
      // Here you would integrate with your email service
      // For now, we'll just update the status
      const response = await fetch(`/api/contact/submissions/${selectedSubmission._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Replied',
          notes: `Replied on ${new Date().toLocaleString()}`
        })
      });

      if (response.ok) {
        // Refresh submissions
        fetchSubmissions();
        setReplyDialogOpen(false);
        // Show success message
        alert('Reply sent successfully!');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply. Please try again.');
    }
  };

  // Statistics
  const stats = {
    total: submissions.length,
    new: submissions.filter((s) => s.status === "New").length,
    inProgress: submissions.filter((s) => s.status === "In Progress").length,
    replied: submissions.filter((s) => s.status === "Replied").length,
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Contact Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage client inquiries, feedback, and service requests with
            efficient response tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-primary/20 hover:bg-primary/5"
            onClick={fetchSubmissions}
          >
            <Download className="h-4 w-4 mr-2 text-primary" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Total Submissions
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">New</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.new}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.inProgress}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Replied</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.replied}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={contactTab} onValueChange={setContactTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 rounded-2xl bg-gradient-to-r from-muted/50 to-background/50 p-1 shadow-lg">
          <TabsTrigger
            value="submissions"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-sucess-foreground px-6 py-4 transition-all bg-white"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Submissions ({filteredSubmissions.length})
          </TabsTrigger>
        
          
        </TabsList>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-6 mt-6">
          <Card className="shadow-md border-0">
            <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3">
              <CardTitle className="text-foreground">
                Contact Submissions
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center space-x-2 w-full sm:w-64">
                  <Search className="h-4 w-4 text-primary flex-shrink-0" />
                  <Input
                    placeholder="Search submissions..."
                    className="h-9 flex-1 border-primary/20 focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] border-primary/20 focus:border-primary">
                    <Filter className="h-4 w-4 mr-2 text-primary" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Replied">Replied</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-[140px] border-primary/20 focus:border-primary">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading submissions...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-primary/10">
                        <TableHead className="text-left font-semibold text-foreground">
                          Contact
                        </TableHead>
                        <TableHead className="text-left font-semibold text-foreground hidden lg:table-cell">
                          Company
                        </TableHead>
                        <TableHead className="text-left font-semibold text-foreground">
                          Subject
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
                        <TableHead className="text-right font-semibold text-foreground">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <TableRow
                          key={submission._id}
                          className="hover:bg-primary/5 transition-colors border-b border-border/20 group"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
                                  {submission.name}
                                </div>
                                <div className="text-xs text-muted-foreground lg:hidden">
                                  {submission.company || 'No company'}
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
                              {submission.company || 'No company'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              <div className="font-medium text-foreground text-sm truncate">
                                {submission.subject}
                              </div>
                              <div className="text-xs text-muted-foreground truncate hidden sm:block">
                                {submission.message.substring(0, 60)}...
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
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                                onClick={() => handleViewSubmission(submission)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                                onClick={() => handleReply(submission)}
                              >
                                <Reply className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {filteredSubmissions.length === 0 && (
                    <div className="text-center py-12">
                      <MessageCircle className="h-16 w-16 mx-auto mb-4 text-primary/30" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No submissions found
                      </h3>
                      <p className="text-muted-foreground">
                        {searchQuery ||
                        statusFilter !== "all" ||
                        priorityFilter !== "all"
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

        {/* Replies Tab */}
        <TabsContent value="replies" className="space-y-6 mt-6">
          <Card className="shadow-md border-0">
            <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3">
              <div>
                <CardTitle className="text-foreground">Sent Replies</CardTitle>
                <CardDescription>
                  Track all responses sent to client inquiries and feedback
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {replies.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Send className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No replies sent yet</p>
                    <p className="text-sm">
                      Start responding to client inquiries to see replies here.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Submission Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Contact Submission Details
            </DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <User className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Name</div>
                      <div className="font-medium text-foreground">
                        {selectedSubmission.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <Mail className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium text-foreground">
                        {selectedSubmission.email}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <Phone className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium text-foreground">
                        {selectedSubmission.phone || 'Not provided'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <Building className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Company
                      </div>
                      <div className="font-medium text-foreground">
                        {selectedSubmission.company || 'Not provided'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Subject</Label>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/20">
                  <div className="font-medium text-foreground">
                    {selectedSubmission.subject}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Message</Label>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/20 max-h-60 overflow-y-auto">
                  <div className="text-foreground whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-border/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(selectedSubmission.status)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Priority:
                  </span>
                  {getPriorityBadge(selectedSubmission.priority)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span className="text-sm text-foreground">
                    {selectedSubmission.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm text-foreground">
                    {formatDate(selectedSubmission.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
              className="border-primary/20 hover:bg-primary/5"
            >
              Close
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => {
                setViewDialogOpen(false);
                setReplyDialogOpen(true);
              }}
            >
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      
    </div>
  );
}
