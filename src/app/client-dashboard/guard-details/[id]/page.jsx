// Updated File: app/client-dashboard/guard-details/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  Download,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  FileText,
  User,
  Clock,
  CheckCircle2,
  Star,
  TrendingUp,
  History,
  Activity,
  Target,
  GraduationCap,
  MessageCircle,
  Edit2,
  Trash2,
  ArrowLeft,
  BarChart3,
  Award,
  Users,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Header from "@/components/client/Header";
import DesktopSidebar from "@/components/client/DesktopSidebar";
import { toast } from "@/hooks/use-toast";

// Dummy document categories for consistency
const dummyDocumentCategories = [
  { id: "agreement", name: "Agreement" },
  { id: "attendance", name: "Attendance" },
  { id: "bills", name: "Bills" },
  { id: "salary-slips", name: "Salary Slips" },
  { id: "pay-slips", name: "Pay Slips" },
  { id: "esi", name: "ESI" },
  { id: "pf", name: "PF" },
  { id: "employee-details", name: "Employee Details" },
  { id: "training", name: "Training" },
  { id: "night-checking", name: "Night Checking" },
  { id: "paid-gst", name: "Paid GST" },
  {
    id: "company-documents",
    name: "Company Documents",
    children: ["MSME", "GST", "Pasara", "PAN", "Profile", "Bank Details"],
  },
];

export default function GuardDetails() {
  const params = useParams();
  const guardId = params.id;
  const router = useRouter();
  const [guard, setGuard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch guard details",
          variant: "destructive",
        });
        router.push("/client-dashboard");
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

  const handleTabChange = () => {
    router.push("/client-dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          activeTab="management"
          setActiveTab={handleTabChange}
          documentCategories={dummyDocumentCategories}
        />
        <div className="flex flex-1">
          <DesktopSidebar
            activeTab="management"
            setActiveTab={handleTabChange}
            documentCategories={dummyDocumentCategories}
          />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    Loading guard details...
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!guard) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          activeTab="management"
          setActiveTab={handleTabChange}
          documentCategories={dummyDocumentCategories}
        />
        <div className="flex flex-1">
          <DesktopSidebar
            activeTab="management"
            setActiveTab={handleTabChange}
            documentCategories={dummyDocumentCategories}
          />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
              <div className="text-center">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-destructive" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Guard Not Found
                </h2>
                <p className="text-muted-foreground mb-4">
                  The guard you're looking for doesn't exist.
                </p>
                <Button onClick={() => router.push("/client-dashboard")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab="management"
        setActiveTab={handleTabChange}
        documentCategories={dummyDocumentCategories}
      />
      <div className="flex flex-1">
        <DesktopSidebar
          activeTab="management"
          setActiveTab={handleTabChange}
          documentCategories={dummyDocumentCategories}
        />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
            {/* Page Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="rounded-xl hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Guard Profile
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {guard.type} • {guard.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Message to {guard.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Type your message..." />
                      <Button className="w-full">Send</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Request Change
                </Button>
              </div>
            </div>

            {/* Profile Section */}
            <Card className="rounded-3xl border-border/70 shadow-xl overflow-hidden mb-8">
              <CardHeader className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-4 border-white/20 shadow-lg">
                        {guard.avatar ? (
                          <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">
                              {guard.avatar}
                            </span>
                          </div>
                        ) : (
                          <User className="h-16 w-16 text-primary/60" />
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-success rounded-full p-2">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-foreground">
                          {guard.name}
                        </h2>
                        {getStatusBadge(guard.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          {guard.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-warning" />
                          {guard.rating || "No rating"} ({guard.experience})
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {guard.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-auto space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-3 rounded-xl bg-muted/50">
                        <div className="text-2xl font-bold text-primary">
                          {guard.performance?.totalAssignments || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Assignments
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-muted/50">
                        <div className="text-2xl font-bold text-success">
                          {guard.performance?.successRate || 0}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Success Rate
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Email</div>
                        <div className="text-sm text-muted-foreground">
                          {guard.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <Phone className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Phone</div>
                        <div className="text-sm text-muted-foreground">
                          {guard.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="p-2 bg-warning/10 rounded-lg">
                        <Calendar className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          Experience
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {guard.experience}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="p-2 bg-info/10 rounded-lg">
                        <MapPin className="h-4 w-4 text-info" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          Base Location
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {guard.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Specializations and Certifications */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="rounded-2xl border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Target className="h-4 w-4" />
                        Specializations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      {guard.specialization &&
                      guard.specialization.length > 0 ? (
                        guard.specialization.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="rounded-full m-1"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No specializations listed
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <GraduationCap className="h-4 w-4" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      {guard.certifications &&
                      guard.certifications.length > 0 ? (
                        guard.certifications.map((cert, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="rounded-full m-1"
                          >
                            {cert}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No certifications listed
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 h-12 rounded-2xl bg-muted/40 p-1 shadow-inner">
                {[
                  { value: "overview", label: "Overview", icon: BarChart3 },
                  { value: "documents", label: "Documents", icon: FileText },
                  {
                    value: "performance",
                    label: "Performance",
                    icon: TrendingUp,
                  },
                  { value: "history", label: "History", icon: History },
                ].map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="rounded-3xl border-border/70 shadow-xl">
                    <CardHeader className="p-6">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-success" />
                        Performance Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Total Assignments
                          </div>
                          <div className="text-2xl font-bold text-foreground">
                            {guard.performance?.totalAssignments || 0}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Completed
                          </div>
                          <div className="text-2xl font-bold text-success">
                            {guard.performance?.completedAssignments || 0}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Success Rate
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            {guard.performance?.successRate || 0}%
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Avg Rating
                          </div>
                          <div className="text-2xl font-bold text-warning">
                            {guard.performance?.averageRating || 0}
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={guard.performance?.clientSatisfaction || 0}
                        className="h-3"
                      />
                      <div className="text-center text-sm text-muted-foreground">
                        Client Satisfaction:{" "}
                        {guard.performance?.clientSatisfaction || 0}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-border/70 shadow-xl">
                    <CardHeader className="p-6">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Award className="h-5 w-5 text-warning" />
                        Ratings Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div
                            key={star}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {Array.from({ length: star }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-current text-warning"
                                  />
                                ))}
                                {Array.from({ length: 5 - star }).map(
                                  (_, i) => (
                                    <Star
                                      key={i}
                                      className="h-3 w-3 text-muted-foreground"
                                    />
                                  )
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                ({Math.floor(Math.random() * 10) + 1})
                              </span>
                            </div>
                            <div className="w-24">
                              <Progress
                                value={Math.random() * 100}
                                className="h-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <Card className="rounded-3xl border-border/70 shadow-xl">
                  <CardHeader className="p-6">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Guard Documents
                    </CardTitle>
                    <CardDescription>
                      View and download guard's certifications and reports.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {guard.documents && guard.documents.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Uploaded</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {guard.documents.map((doc, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {doc.name}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className="rounded-full text-xs"
                                >
                                  {doc.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {doc.category}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDate(doc.uploaded)}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {doc.size}
                              </TableCell>
                              <TableCell className="text-foreground max-w-[200px] truncate">
                                {doc.description}
                              </TableCell>
                              <TableCell className="space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No documents available for this guard.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <Card className="rounded-3xl border-border/70 shadow-xl">
                  <CardHeader className="p-6">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Success Rate
                        </span>
                        <span className="text-2xl font-bold">
                          {guard.performance?.successRate || 0}%
                        </span>
                      </div>
                      <Progress
                        value={guard.performance?.successRate || 0}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Client Satisfaction
                        </span>
                        <span className="text-2xl font-bold">
                          {guard.performance?.clientSatisfaction || 0}%
                        </span>
                      </div>
                      <Progress
                        value={guard.performance?.clientSatisfaction || 0}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <Card className="rounded-3xl border-border/70 shadow-xl">
                  <CardHeader className="p-6">
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Activity Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
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
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
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
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                          <div className="p-2 bg-warning/10 rounded-full">
                            <Shield className="h-4 w-4 text-warning" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              Current Assignment Started
                            </p>
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

                    {/* Assignment History */}
                    {guard.assignmentHistory &&
                      guard.assignmentHistory.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-border/50">
                          <h3 className="font-semibold mb-4">
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
                              {guard.assignmentHistory.map(
                                (assignment, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
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
                                    <TableCell>{assignment.rating}/5</TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
