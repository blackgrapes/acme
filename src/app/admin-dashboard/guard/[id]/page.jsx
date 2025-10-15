// Updated File: src/app/admin-dashboard/guard/[id]/page.jsx
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
} from "lucide-react";
import Header from "@/components/admin/Header";
import DesktopSidebar from "@/components/admin/DesktopSidebar";
import MobileMenu from "@/components/admin/MobileMenu";
import AdminProfileDialog from "@/components/admin/AdminProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";

// Dummy data for categories to fix undefined error
const dummyDocumentCategories = [
  { id: "1", name: "Agreements", children: ["Service Agreement", "NDA"] },
  { id: "2", name: "Attendance", children: [] },
  { id: "3", name: "Bills", children: [] },
  { id: "4", name: "Salary Slips", children: [] },
  { id: "5", name: "Compliance", children: ["PF", "ESI"] },
  { id: "6", name: "GST", children: [] },
  { id: "7", name: "Guard Documents", children: ["KYC", "Aadhar", "PAN"] },
];

const dummyFrontendCategories = [
  { id: "weprovide", name: "We Provide Services" },
  { id: "gallery", name: "Gallery" },
  { id: "clients", name: "Clients" },
  { id: "testimonials", name: "Testimonials" },
];

const dummyGuardDocuments = [
  {
    id: 1,
    name: "Employment Contract.pdf",
    type: "Contract",
    uploaded: "2025-01-15",
    size: "2.4 MB",
    category: "Legal",
    uploadedBy: "Admin User",
  },
  {
    id: 2,
    name: "Background Check Report.pdf",
    type: "Background",
    uploaded: "2025-01-10",
    size: "1.8 MB",
    category: "Compliance",
    uploadedBy: "HR Team",
  },
  {
    id: 3,
    name: "Training Certificate.pdf",
    type: "Certificate",
    uploaded: "2025-01-05",
    size: "3.2 MB",
    category: "Training",
    uploadedBy: "Training Dept",
  },
  {
    id: 4,
    name: "ID Proof.jpg",
    type: "Identification",
    uploaded: "2025-01-01",
    size: "1.1 MB",
    category: "KYC",
    uploadedBy: "Admin User",
  },
];

const dummyGuard = {
  id: 1,
  image: null, // Set to null for dummy image; in real scenario, this would be a URL like '/guards/rajesh.jpg'
  name: "Rajesh Kumar",
  email: "rajesh@securitypro.com",
  phone: "+91 98765 43210",
  emergencyContact: "+91 87654 32109",
  gender: "Male",
  dateOfBirth: "1990-05-15",
  address: "123 Security Quarters, Andheri East, Mumbai - 400069",
  type: "Security Officer",
  guardId: "GUA-001",
  experience: "8 years",
  salary: "₹35,000/month",
  status: "Assigned",
  location: "Mumbai",
  joinDate: "2020-03-15",
  lastActive: "2025-01-15 14:30",
  rating: 4.7,
  specialization: [
    "Crowd Control",
    "Executive Protection",
    "Emergency Response",
    "Surveillance",
  ],
  certifications: [
    "CPR & First Aid Certified",
    "Security Guard License",
    "Firearms Permit",
    "Defensive Driving",
    "Advanced Combat Training",
  ],
  currentAssignment: {
    clientId: 1,
    clientName: "Sarah Johnson",
    clientEmail: "sarah@techcorp.com",
    clientPhone: "+1 (555) 234-5678",
    organization: "TechCorp Inc.",
    assignmentType: "Personal Security",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    location: "TechCorp Headquarters",
    status: "Active",
  },
  assignmentHistory: [
    {
      id: 1,
      clientName: "Mike Davis",
      organization: "Global Finance",
      assignmentType: "Event Security",
      startDate: "2023-06-01",
      endDate: "2023-12-31",
      duration: "7 months",
      status: "Completed",
      rating: 4.8,
    },
    {
      id: 2,
      clientName: "Emily Wilson",
      organization: "Wilson Enterprises",
      assignmentType: "Residential Security",
      startDate: "2022-08-01",
      endDate: "2023-05-31",
      duration: "10 months",
      status: "Completed",
      rating: 4.9,
    },
  ],
  performance: {
    totalAssignments: 12,
    completedAssignments: 11,
    successRate: 92,
    averageRating: 4.7,
    clientSatisfaction: 95,
  },
};

export default function GuardDetails() {
  const params = useParams();
  const guardId = parseInt(params.id);
  const [guard, setGuard] = useState(null);
  const [showSpecificAccess, setShowSpecificAccess] = useState(false);
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    // Simulate fetch
    setGuard(dummyGuard);
  }, [guardId]);

  if (!guard) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          activeTab="guards"
          setActiveTab={() => router.push("/admin-dashboard")}
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          openAdminDialog={openAdminDialog}
          setOpenAdminDialog={setOpenAdminDialog}
          documentCategories={dummyDocumentCategories}
          frontendCategories={dummyFrontendCategories}
        />
        <div className="flex flex-1">
          <DesktopSidebar
            activeTab="guards"
            setActiveTab={() => router.push("/admin-dashboard")}
            documentCategories={dummyDocumentCategories}
            setDocumentCategories={() => {}}
            frontendCategories={dummyFrontendCategories}
            setFrontendCategories={() => {}}
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
        <AdminProfileDialog
          open={openAdminDialog}
          onOpenChange={setOpenAdminDialog}
        />
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge
            variant="default"
            className="rounded-full bg-success text-success-foreground"
          >
            Active
          </Badge>
        );
      case "Assigned":
        return (
          <Badge
            variant="default"
            className="rounded-full bg-primary text-primary-foreground"
          >
            Assigned
          </Badge>
        );
      case "Inactive":
        return (
          <Badge
            variant="default"
            className="rounded-full bg-destructive text-destructive-foreground"
          >
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab="guards"
        setActiveTab={() => router.push("/admin-dashboard")}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        openAdminDialog={openAdminDialog}
        setOpenAdminDialog={setOpenAdminDialog}
        documentCategories={dummyDocumentCategories}
        frontendCategories={dummyFrontendCategories}
      />

      <div className="flex flex-1">
        <DesktopSidebar
          activeTab="guards"
          setActiveTab={() => router.push("/admin-dashboard")}
          documentCategories={dummyDocumentCategories}
          setDocumentCategories={() => {}}
          frontendCategories={dummyFrontendCategories}
          setFrontendCategories={() => {}}
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
                    {guard.guardId} • {guard.type}
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
                  Edit Profile
                </Button>
                <Button variant="destructive" size="sm" className="rounded-xl">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deactivate
                </Button>
              </div>
            </div>

            {/* Profile Section - Enhanced UI */}
            <Card className="rounded-3xl border-border/70 shadow-xl overflow-hidden mb-8">
              <CardHeader className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-4 border-white/20 shadow-lg">
                        {guard.image ? (
                          <Image
                            src={guard.image}
                            alt={guard.name}
                            width={128}
                            height={128}
                            className="rounded-full object-cover"
                          />
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
                          <IdCard className="h-4 w-4" />
                          {guard.guardId}
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          {guard.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-warning" />
                          {guard.rating} ({guard.experience})
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
                          {guard.performance.totalAssignments}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Assignments
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-muted/50">
                        <div className="text-2xl font-bold text-success">
                          {guard.performance.successRate}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Success Rate
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="text-center p-3 rounded-xl bg-muted/50">
                        <div className="text-lg font-semibold text-foreground">
                          {guard.salary}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Monthly Salary
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
                        <div className="font-medium text-foreground">DOB</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(guard.dateOfBirth)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="p-2 bg-info/10 rounded-lg">
                        <MapPin className="h-4 w-4 text-info" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          Address
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {guard.address}
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
                      {guard.specialization.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="rounded-full"
                        >
                          {skill}
                        </Badge>
                      ))}
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
                      {guard.certifications.map((cert, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="rounded-full"
                        >
                          {cert}
                        </Badge>
                      ))}
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
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-12 rounded-2xl bg-muted/40 p-1 shadow-inner">
                {[
                  { value: "overview", label: "Overview", icon: BarChart3 },
                  { value: "documents", label: "Documents", icon: FileText },
                  { value: "assignment", label: "Assignment", icon: Users },
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
                  {/* Current Assignment Card */}
                  <Card className="rounded-3xl border-border/70 shadow-xl">
                    <CardHeader className="p-6">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Users className="h-5 w-5 text-primary" />
                        Current Assignment
                      </CardTitle>
                      <CardDescription>
                        Active security deployment for{" "}
                        {guard.currentAssignment.clientName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Client
                          </span>
                          <span className="font-semibold">
                            {guard.currentAssignment.clientName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Organization
                          </span>
                          <span className="font-semibold">
                            {guard.currentAssignment.organization}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Type
                          </span>
                          <Badge variant="outline" className="rounded-full">
                            {guard.currentAssignment.assignmentType}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Location
                          </span>
                          <span className="font-semibold">
                            {guard.currentAssignment.location}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t">
                          <span className="text-sm font-medium text-muted-foreground">
                            Duration
                          </span>
                          <div className="text-sm">
                            <div>
                              {formatDate(guard.currentAssignment.startDate)} -{" "}
                              {formatDate(guard.currentAssignment.endDate)}
                            </div>
                            <div className="text-xs text-success font-medium">
                              Active
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <Card className="rounded-3xl border-border/70 shadow-xl">
                    <CardHeader className="p-6">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <TrendingUp className="h-5 w-5 text-success" />
                        Performance Metrics
                      </CardTitle>
                      <CardDescription>
                        Key performance indicators for {guard.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">
                              Average Rating
                            </div>
                            <div className="text-2xl font-bold text-foreground">
                              {guard.rating}/5
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              Overall
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-current text-warning" />
                              <span className="text-sm font-medium">
                                {guard.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Progress
                          value={guard.performance.successRate}
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {guard.performance.successRate}% Success Rate •{" "}
                          {guard.performance.completedAssignments}/
                          {guard.performance.totalAssignments} Assignments
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <Card className="rounded-3xl border-border/70 shadow-xl">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5 text-primary" />
                        Guard Documents
                      </CardTitle>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="rounded-xl">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Document
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload Guard Document</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="legal">Legal</SelectItem>
                                <SelectItem value="compliance">
                                  Compliance
                                </SelectItem>
                                <SelectItem value="training">
                                  Training
                                </SelectItem>
                                <SelectItem value="kyc">KYC</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input type="file" accept=".pdf,.jpg,.png" />
                            <Input placeholder="Document Name" />
                            <Button className="w-full">Upload</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <CardDescription>
                      All documents associated with {guard.name} (
                      {dummyGuardDocuments.length} total)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border/50">
                          <TableHead className="text-left">Document</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Category
                          </TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead className="text-right">Size</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dummyGuardDocuments.map((doc) => (
                          <TableRow
                            key={doc.id}
                            className="hover:bg-muted/20 border-b border-border/20"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <FileIcon className="h-4 w-4 text-muted-foreground" />
                                {doc.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="rounded-full text-xs"
                              >
                                {doc.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="secondary" className="text-xs">
                                {doc.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(doc.uploaded)}
                            </TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">
                              {doc.size}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1">
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
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assignment Tab */}
              <TabsContent value="assignment" className="space-y-6">
                <Card className="rounded-3xl border-border/70 shadow-xl">
                  <CardHeader className="p-6">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-primary" />
                      Assignment Details
                    </CardTitle>
                    <CardDescription>
                      Current and past assignments for {guard.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Current Assignment */}
                    <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Current Assignment
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Client
                          </div>
                          <div className="font-semibold">
                            {guard.currentAssignment.clientName}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Organization
                          </div>
                          <div className="font-semibold">
                            {guard.currentAssignment.organization}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Type
                          </div>
                          <Badge variant="default" className="rounded-full">
                            {guard.currentAssignment.assignmentType}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Location
                          </div>
                          <div className="font-semibold">
                            {guard.currentAssignment.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="text-sm font-medium text-muted-foreground">
                          Duration
                        </div>
                        <div className="text-sm">
                          <div>
                            {formatDate(guard.currentAssignment.startDate)} -{" "}
                            {formatDate(guard.currentAssignment.endDate)}
                          </div>
                          <div className="text-xs text-success font-medium">
                            Active
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Assignment History */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <History className="h-5 w-5 text-secondary" />
                        Assignment History ({guard.assignmentHistory.length})
                      </h3>
                      <div className="space-y-3">
                        {guard.assignmentHistory.map((assignment, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-success"></div>
                                <div>
                                  <div className="font-medium">
                                    {assignment.clientName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {assignment.organization}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {assignment.assignmentType}
                                </div>
                                <Badge variant="outline" className="mt-1">
                                  {assignment.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground mt-3">
                              <div className="text-center">
                                <div className="font-medium">
                                  {formatDate(assignment.startDate)}
                                </div>
                                <div>Start</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">
                                  {formatDate(assignment.endDate)}
                                </div>
                                <div>End</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">
                                  {assignment.duration}
                                </div>
                                <div>Duration</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">
                                  {assignment.rating}
                                </div>
                                <div>Rating</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
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
                            {guard.performance.totalAssignments}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Completed
                          </div>
                          <div className="text-2xl font-bold text-success">
                            {guard.performance.completedAssignments}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Success Rate
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            {guard.performance.successRate}%
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Avg Rating
                          </div>
                          <div className="text-2xl font-bold text-warning">
                            {guard.performance.averageRating}
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={guard.performance.clientSatisfaction}
                        className="h-3"
                      />
                      <div className="text-center text-sm text-muted-foreground">
                        Client Satisfaction:{" "}
                        {guard.performance.clientSatisfaction}%
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

              {/* History Tab */}
              <TabsContent value="history" className="space-y-8">
                <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-background/80 shadow-xl">
                  <CardHeader className="p-6">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
                      <History className="h-5 w-5 text-secondary" />
                      Activity Timeline
                    </CardTitle>
                    <CardDescription>
                      Complete chronological log of all activities and updates
                      for {guard.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6 pb-6">
                    {/* Recent Activity */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border-l-4 border-success/50 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 rounded-full p-2 bg-success/20 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            Assignment Started - TechCorp Inc.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Began personal security assignment for Sarah Johnson
                            • 2 hours ago
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto">
                          Today, 10:30 AM
                        </span>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border-l-4 border-primary/50 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 rounded-full p-2 bg-primary/20 mt-0.5">
                          <FileCheck className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            Training Completed
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Advanced combat training certification renewed • 1
                            day ago
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto">
                          Yesterday, 3:15 PM
                        </span>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border-l-4 border-warning/50 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 rounded-full p-2 bg-warning/20 mt-0.5">
                          <Award className="h-4 w-4 text-warning" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            Performance Review
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quarterly performance review completed - Rating:
                            4.7/5 • 1 week ago
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto">
                          Jan 8, 2025
                        </span>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border-l-4 border-info/50 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 rounded-full p-2 bg-info/20 mt-0.5">
                          <Shield className="h-4 w-4 text-info" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            Previous Assignment Completed
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Successfully completed assignment with Global
                            Finance • 2 weeks ago
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto">
                          Jan 1, 2025
                        </span>
                      </div>
                    </div>

                    {/* Monthly Performance Chart - Responsive */}
                    <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-muted/30 to-background/50 border border-border/30">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-secondary" />
                        Monthly Performance Trend
                      </h4>
                      <div className="space-y-3">
                        {[
                          { month: "Jan", rating: 4.7, assignments: 3 },
                          { month: "Feb", rating: 4.8, assignments: 4 },
                          { month: "Mar", rating: 4.6, assignments: 2 },
                          { month: "Apr", rating: 4.9, assignments: 5 },
                          { month: "May", rating: 4.7, assignments: 3 },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
                          >
                            <span className="text-sm font-medium text-foreground w-12">
                              {item.month}
                            </span>
                            <div className="flex-1 mx-4">
                              <Progress
                                value={item.rating * 20}
                                className="h-2 rounded-full"
                              />
                            </div>
                            <div className="flex items-center gap-4 w-24 justify-end">
                              <span className="text-sm text-muted-foreground">
                                {item.rating}/5
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs rounded-full"
                              >
                                {item.assignments}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <AdminProfileDialog
        open={openAdminDialog}
        onOpenChange={setOpenAdminDialog}
      />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}