// Updated File: src/app/admin-dashboard/client-details/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
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

const dummyGuards = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh@securitypro.com",
    status: "Active",
    phone: "+91 98765 43210",
    joinDate: "2024-01-15",
    experience: "3 years",
    rating: 4.8,
    location: "Mumbai",
    skills: ["Crowd Control", "Surveillance", "First Aid"],
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@securitypro.com",
    status: "Active",
    phone: "+91 87654 32109",
    joinDate: "2024-02-20",
    experience: "2 years",
    rating: 4.6,
    location: "Delhi",
    skills: ["Access Control", "Emergency Response"],
  },
  {
    id: 3,
    name: "Arun Patel",
    email: "arun@securitypro.com",
    status: "Inactive",
    phone: "+91 76543 21098",
    joinDate: "2023-11-10",
    experience: "4 years",
    rating: 4.7,
    location: "Bangalore",
    skills: ["VIP Protection", "Combat Training"],
  },
];

const dummyClientDocuments = [
  {
    id: 1,
    name: "Client Service Agreement.pdf",
    type: "Contract",
    uploaded: "2025-01-01",
    size: "2.4 MB",
    access: "Specific",
    category: "Legal",
    uploadedBy: "Admin User",
  },
  {
    id: 2,
    name: "Invoice January 2025.pdf",
    type: "Invoice",
    uploaded: "2025-01-15",
    size: "1.2 MB",
    access: "Specific",
    category: "Financial",
    uploadedBy: "Finance Team",
  },
  {
    id: 3,
    name: "Security Assessment Report.pdf",
    type: "Report",
    uploaded: "2025-01-10",
    size: "3.1 MB",
    access: "Specific",
    category: "Operational",
    uploadedBy: "Operations",
  },
];

const dummyRequests = [
  {
    id: 1,
    type: "Invoice Copy",
    status: "Pending",
    date: "2025-01-15",
    priority: "High",
    description: "Required for accounting purposes",
  },
  {
    id: 2,
    type: "Guard Performance Report",
    status: "Fulfilled",
    date: "2025-01-14",
    priority: "Medium",
    description: "Monthly performance review",
  },
];

const dummyClientActivity = [
  {
    id: 1,
    type: "Assignment Update",
    description: "Guard assignment updated for TechCorp Inc.",
    date: "2025-01-15",
    status: "Completed",
  },
  {
    id: 2,
    type: "Invoice Generated",
    description: "January 2025 invoice sent to client.",
    date: "2025-01-10",
    status: "Sent",
  },
  {
    id: 3,
    type: "Request Fulfilled",
    description: "Client request for performance report completed.",
    date: "2025-01-05",
    status: "Fulfilled",
  },
];

const dummyClient = {
  id: 1,
  name: "John Smith",
  org: "TechCorp Solutions Pvt. Ltd.",
  email: "john.smith@techcorp.com",
  phone: "+91 98765 43210",
  plan: "Enterprise Security",
  duration: { from: "2025-01-01", to: "2025-12-31" },
  status: "Active",
  joined: "2024-01-15",
  lastLogin: "2025-01-15 14:30",
  currentGuards: [1, 2],
  previousGuards: [3],
  address: "123 Business Park, Andheri East, Mumbai - 400069",
  contactPerson: "John Smith",
  billingCycle: "Monthly",
  totalGuardsAssigned: 8,
  activeSince: "12 months",
  satisfaction: 4.5,
  monthlyRevenue: "₹2,85,000",
  performance: {
    totalRequests: 15,
    fulfilledRequests: 14,
    satisfactionRate: 93,
    averageRating: 4.5,
    retention: 95,
  },
  assignmentHistory: [
    {
      id: 1,
      guards: 2,
      duration: "6 months",
      type: "Corporate Security",
      startDate: "2024-07-01",
      endDate: "2024-12-31",
      status: "Active",
      rating: 4.6,
    },
    {
      id: 2,
      guards: 3,
      duration: "12 months",
      type: "Event Security",
      startDate: "2023-07-01",
      endDate: "2024-06-30",
      status: "Completed",
      rating: 4.7,
    },
  ],
};

export default function ClientDetails() {
  const params = useParams();
  const clientId = parseInt(params.id);
  const [client, setClient] = useState(null);
  const [showSpecificAccess, setShowSpecificAccess] = useState(false);
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    // Simulate fetch
    setClient(dummyClient);
  }, [clientId]);

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          activeTab="clients"
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
            activeTab="clients"
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
                    Loading client details...
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

  const currentGuardsList = client.currentGuards
    .map((gId) => dummyGuards.find((g) => g.id === gId))
    .filter(Boolean);
  const previousGuardsList = client.previousGuards
    .map((gId) => dummyGuards.find((g) => g.id === gId))
    .filter(Boolean);

  const clientRequests = dummyRequests;
  const clientActivity = dummyClientActivity;

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
      case "Pending":
        return (
          <Badge
            variant="default"
            className="rounded-full bg-warning text-warning-foreground"
          >
            Pending
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
      case "Fulfilled":
        return (
          <Badge
            variant="default"
            className="rounded-full bg-success text-success-foreground"
          >
            Fulfilled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="rounded-full">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatFullDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab="clients"
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
          activeTab="clients"
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
                    Client Profile
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {client.org} • {client.plan}
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
                      <DialogTitle>Send Message to {client.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Subject" />
                      <Textarea placeholder="Message content..." rows={6} />
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
                  Archive
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
                        <Building className="h-16 w-16 text-primary/60" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-success rounded-full p-2">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-foreground">
                          {client.name}
                        </h2>
                        {getStatusBadge(client.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <IdCard className="h-4 w-4" />
                          {client.contactPerson}
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          {client.plan}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-warning" />
                          {client.satisfaction} ({client.activeSince})
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Mumbai
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-auto space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-3 rounded-xl bg-muted/50">
                        <div className="text-2xl font-bold text-primary">
                          {currentGuardsList.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Active Guards
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-muted/50">
                        <div className="text-2xl font-bold text-success">
                          {client.performance.satisfactionRate}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Satisfaction
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="text-center p-3 rounded-xl bg-muted/50">
                        <div className="text-lg font-semibold text-foreground">
                          {client.monthlyRevenue}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Monthly Revenue
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
                          {client.email}
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
                          {client.phone}
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
                          Joined
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(client.joined)}
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
                          {client.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Service Details */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="rounded-2xl border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-4 w-4" />
                        Service Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <Badge variant="default" className="rounded-full">
                        {client.plan}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-2">
                        Billing: {client.billingCycle}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-4 w-4" />
                        Contract Duration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(client.duration.from)} -{" "}
                        {formatDate(client.duration.to)}
                      </div>
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
                  { value: "guards", label: "Guards", icon: Users },
                  { value: "documents", label: "Documents", icon: FileText },
                  { value: "requests", label: "Requests", icon: Activity },
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
                            Total Requests
                          </div>
                          <div className="text-2xl font-bold text-foreground">
                            {client.performance.totalRequests}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Fulfilled
                          </div>
                          <div className="text-2xl font-bold text-success">
                            {client.performance.fulfilledRequests}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Satisfaction Rate
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            {client.performance.satisfactionRate}%
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Avg Rating
                          </div>
                          <div className="text-2xl font-bold text-warning">
                            {client.performance.averageRating}
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={client.performance.retention}
                        className="h-3"
                      />
                      <div className="text-center text-sm text-muted-foreground">
                        Retention Rate: {client.performance.retention}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-border/70 shadow-xl">
                    <CardHeader className="p-6">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Award className="h-5 w-5 text-warning" />
                        Satisfaction Breakdown
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

              {/* Guards Tab */}
              <TabsContent value="guards" className="space-y-6">
                <Card className="rounded-3xl border-border/70 shadow-xl">
                  <CardHeader className="p-6">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-primary" />
                      Assigned Guards
                    </CardTitle>
                    <CardDescription>
                      Current and past guards for {client.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Current Guards */}
                    <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Current Guards ({currentGuardsList.length})
                      </h3>
                      <div className="space-y-3">
                        {currentGuardsList.map((guard) => (
                          <div
                            key={guard.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{guard.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {guard.location} • {guard.experience}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{guard.rating}/5</Badge>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Previous Guards */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <History className="h-5 w-5 text-secondary" />
                        Previous Guards ({previousGuardsList.length})
                      </h3>
                      <div className="space-y-3">
                        {previousGuardsList.map((guard) => (
                          <div
                            key={guard.id}
                            className="p-4 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                                  <User className="h-5 w-5 text-secondary" />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {guard.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {guard.location}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="secondary">{guard.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <Card className="rounded-3xl border-border/70 shadow-xl">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Client Documents
                      </CardTitle>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="rounded-xl">
                            <Plus className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload Document</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input type="file" />
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="legal">Legal</SelectItem>
                                <SelectItem value="financial">
                                  Financial
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button className="w-full">Upload</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dummyClientDocuments.map((doc) => (
                          <TableRow key={doc.id}>
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
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="outline" className="text-xs">
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

              {/* Requests Tab */}
              <TabsContent value="requests" className="space-y-6">
                <Card className="rounded-3xl border-border/70 shadow-xl">
                  <CardHeader className="p-6">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Client Requests ({clientRequests.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {clientRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 rounded-xl border bg-muted/30 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">
                            {request.type}
                          </h4>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {request.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatDate(request.date)}</span>
                          <Badge variant="secondary">{request.priority}</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
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
                      for {client.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6 pb-6">
                    {/* Recent Activity */}
                    <div className="space-y-4">
                      {clientActivity.slice(0, 4).map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border-l-4 border-primary/50 hover:shadow-md transition-all"
                        >
                          <div className="flex-shrink-0 rounded-full p-2 bg-primary/20 mt-0.5">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              {activity.type}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {activity.description} •{" "}
                              {formatDate(activity.date)}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {activity.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Assignment History */}
                    <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-muted/30 to-background/50 border border-border/30">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-secondary" />
                        Assignment History
                      </h4>
                      <div className="space-y-3">
                        {client.assignmentHistory.map((assignment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
                          >
                            <span className="text-sm font-medium text-foreground w-24">
                              {assignment.type}
                            </span>
                            <div className="flex-1 mx-4">
                              <Progress
                                value={assignment.rating * 20}
                                className="h-2 rounded-full"
                              />
                            </div>
                            <div className="flex items-center gap-4 w-32 justify-end">
                              <span className="text-sm text-muted-foreground">
                                {assignment.guards} Guards
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs rounded-full"
                              >
                                {assignment.status}
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
