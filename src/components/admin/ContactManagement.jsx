"use client";

import { useState } from "react";
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

// Enhanced dummy data
const dummyContactSubmissions = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@techcorp.com",
    phone: "+91 98765 43210",
    company: "TechCorp Solutions",
    subject: "Enterprise Security Inquiry",
    message:
      "I'm interested in your enterprise security services for our new corporate office. Could you please share more details about your pricing and service packages? We're looking for 24/7 security coverage.",
    date: "2025-01-15 14:30",
    status: "New",
    priority: "High",
    category: "Service Inquiry",
    read: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@globalfinance.com",
    phone: "+91 87654 32109",
    company: "Global Finance Ltd",
    subject: "Guard Performance Review",
    message:
      "We'd like to discuss the performance of our current security team and explore options for additional personnel for our upcoming corporate event next month.",
    date: "2025-01-14 11:15",
    status: "In Progress",
    priority: "Medium",
    category: "Feedback",
    read: true,
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike.davis@startup.io",
    phone: "+91 76543 21098",
    company: "Startup Innovations",
    subject: "Urgent Security Requirement",
    message:
      "We need immediate security deployment for our new office location. Please contact us as soon as possible to discuss availability and rates.",
    date: "2025-01-14 09:45",
    status: "New",
    priority: "High",
    category: "Urgent Request",
    read: false,
  },
  {
    id: 4,
    name: "Emily Wilson",
    email: "emily.wilson@retailgroup.com",
    phone: "+91 65432 10987",
    company: "Retail Group Inc",
    subject: "Monthly Service Feedback",
    message:
      "Overall satisfied with the service, but would like to discuss some specific incidents from last month and improvements for the coming quarter.",
    date: "2025-01-13 16:20",
    status: "Replied",
    priority: "Low",
    category: "Feedback",
    read: true,
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "robert.b@manufacturing.com",
    phone: "+91 54321 09876",
    company: "Brown Manufacturing",
    subject: "Document Request",
    message:
      "Could you please send us copies of the compliance certificates and guard licenses for our audit next week?",
    date: "2025-01-12 10:30",
    status: "Completed",
    priority: "Medium",
    category: "Documentation",
    read: true,
  },
];

const dummyReplies = [
  {
    id: 1,
    submissionId: 4,
    subject: "Re: Monthly Service Feedback",
    to: "Emily Wilson",
    email: "emily.wilson@retailgroup.com",
    message:
      "Thank you for your feedback. We've reviewed the incidents and implemented additional training for our team.",
    sentDate: "2025-01-14 10:15",
    status: "Sent",
  },
  {
    id: 2,
    submissionId: 5,
    subject: "Re: Document Request",
    to: "Robert Brown",
    email: "robert.b@manufacturing.com",
    message:
      "All requested documents have been sent to your email. Let us know if you need anything else.",
    sentDate: "2025-01-13 14:30",
    status: "Sent",
  },
];

export default function ContactManagement({
  contactTab,
  setContactTab,
  dummyContactSubmissions: propSubmissions,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const submissions = propSubmissions || dummyContactSubmissions;

  // Filter submissions based on search and filters
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.subject.toLowerCase().includes(searchQuery.toLowerCase());

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
          >
            <Download className="h-4 w-4 mr-2 text-primary" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            New Template
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
        <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-gradient-to-r from-muted/50 to-background/50 p-1 shadow-lg">
          <TabsTrigger
            value="submissions"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-sucess-foreground px-6 py-4 transition-all bg-white"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Submissions ({filteredSubmissions.length})
          </TabsTrigger>
          <TabsTrigger
            value="replies"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-success data-[state=active]:to-success/80 data-[state=active]:text-success-foreground px-6 py-4 transition-all bg-white"
          >
            <Reply className="h-5 w-5 mr-2" />
            Replies ({dummyReplies.length})
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
                        key={submission.id}
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
                                {submission.company}
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
                            {submission.company}
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
                            {formatDate(submission.date)}
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                            >
                              <MoreVertical className="h-4 w-4" />
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
            </CardContent>
          </Card>

          {/* Mobile Cards View */}
          <div className="lg:hidden space-y-4">
            {filteredSubmissions.map((submission) => (
              <Card key={submission.id} className="shadow-md border-0">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {submission.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {submission.company}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {submission.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(submission.status)}
                      {getPriorityBadge(submission.priority)}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="font-medium text-foreground text-sm mb-1">
                      {submission.subject}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {submission.message.substring(0, 100)}...
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-primary/10">
                    <div className="text-xs text-muted-foreground">
                      {formatDate(submission.date)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-primary hover:bg-primary/10"
                        onClick={() => handleViewSubmission(submission)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-primary hover:bg-primary/10"
                        onClick={() => handleReply(submission)}
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                New Reply Template
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dummyReplies.map((reply) => (
                  <div
                    key={reply.id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/20"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                        <Send className="h-5 w-5 text-success" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {reply.subject}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            To: {reply.to} ({reply.email})
                          </p>
                        </div>
                        <Badge
                          variant="default"
                          className="rounded-full bg-success text-success-foreground mt-2 sm:mt-0"
                        >
                          {reply.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {reply.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Sent: {formatDate(reply.sentDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl gap-2 px-3 border-primary/20 hover:bg-primary/5"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl gap-2 px-3 border-primary/20 hover:bg-primary/5"
                      >
                        <FileText className="h-4 w-4" />
                        Resend
                      </Button>
                    </div>
                  </div>
                ))}

                {dummyReplies.length === 0 && (
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
                        {selectedSubmission.phone}
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
                        {selectedSubmission.company}
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
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm text-foreground">
                    {formatDate(selectedSubmission.date)}
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

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Reply className="h-5 w-5 text-primary" />
              Reply to {selectedSubmission?.name}
            </DialogTitle>
            <DialogDescription>
              Send a response to the client inquiry. Your reply will be logged
              and tracked.
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label htmlFor="replySubject" className="text-sm font-medium">
                  Subject
                </Label>
                <Input
                  id="replySubject"
                  defaultValue={`Re: ${selectedSubmission.subject}`}
                  className="border-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="replyMessage" className="text-sm font-medium">
                  Message
                </Label>
                <Textarea
                  id="replyMessage"
                  placeholder="Type your response here..."
                  className="min-h-[200px] border-primary/20 focus:border-primary"
                  defaultValue={`Dear ${selectedSubmission.name},\n\nThank you for your inquiry. `}
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-info/10 border border-info/20">
                <Mail className="h-4 w-4 text-info" />
                <span className="text-sm text-info">
                  This reply will be sent to: {selectedSubmission.email}
                </span>
              </div>
            </div>
          )}
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setReplyDialogOpen(false)}
              className="border-primary/20 hover:bg-primary/5"
            >
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Send className="h-4 w-4" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
