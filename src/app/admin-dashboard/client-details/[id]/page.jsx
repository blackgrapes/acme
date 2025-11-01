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
  Users as UsersIcon,
  TrendingUp as TrendingUpIcon,
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
import { toast } from "@/hooks/use-toast";

// Dummy data for categories
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

export default function ClientDetails() {
  const params = useParams();
  const clientId = params.id;
  const [client, setClient] = useState(null);
  const [clientDocuments, setClientDocuments] = useState([]);
  const [clientRequests, setClientRequests] = useState([]);
  const [clientActivity, setClientActivity] = useState([]);
  const [showSpecificAccess, setShowSpecificAccess] = useState(false);
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [assignGuardOpen, setAssignGuardOpen] = useState(false);
  const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [guards, setGuards] = useState([]);

  useEffect(() => {
    if (clientId) {
      fetchClientDetails();
    }
  }, [clientId]);

  const fetchClientDocuments = async () => {
    try {
      console.log("🔄 Fetching documents for client:", clientId);

      const response = await fetch(`/api/documents?clientId=${clientId}`);
      const data = await response.json();

      if (response.ok) {
        console.log("✅ Documents fetched:", data.documents?.length || 0);
        setClientDocuments(data.documents || []);
      } else {
        console.error("❌ Documents fetch failed:", data.error);
        setClientDocuments([]);
      }
    } catch (error) {
      console.error("❌ Error fetching documents:", error);
      setClientDocuments([]);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchClientDocuments();
    }
  }, [clientId]);

  const handleGuardRowClick = (guardId) => {
    router.push(`/admin-dashboard/guard-details/${guardId}`);
  };

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const clientResponse = await fetch(`/api/auth/client/${clientId}`);

      if (!clientResponse.ok) {
        throw new Error(`Failed to fetch client: ${clientResponse.status}`);
      }

      const clientData = await clientResponse.json();

      if (!clientData.client) {
        throw new Error("Client not found");
      }

      setClient(clientData.client);

      await fetchRelatedData(clientData.client._id);
    } catch (error) {
      console.error("Error fetching client details:", error);
      setError(error.message);
      setClient({
        _id: "default-client-id",
        name: "Default Client",
        email: "client@company.com",
        phone: "+91 98765 43210",
        address: "Mumbai, India",
        company: "Sample Company",
        status: "Active",
        joined: "31 Oct 2025",
        activeGuards: 0,
        satisfaction: 93,
        monthlyRevenue: "85,000",
        performance: {
          fulfilledRequests: 45,
          satisfactionRate: 93,
          totalAssignments: 12,
        },
        activeSince: "12 months",
      });
      setClientDocuments([
        {
          id: 1,
          name: "Service Agreement.pdf",
          type: "agreement",
          uploaded: "2025-10-15",
          size: "1.2 MB",
          uploader: "Admin User",
          access: "general",
          description: "Standard service agreement for security services.",
        },
        {
          id: 2,
          name: "Attendance Report Oct 2025.xlsx",
          type: "attendance",
          uploaded: "2025-10-31",
          size: "245 KB",
          uploader: "Admin User",
          access: "specific",
          description: "Monthly attendance records for assigned guards.",
        },
      ]);
      setClientRequests([
        {
          id: 1,
          type: "Document Request",
          date: "2025-10-28",
          status: "Pending",
          description: "Request for salary slips of guards.",
        },
        {
          id: 2,
          type: "Guard Assignment",
          date: "2025-10-25",
          status: "Completed",
          description: "Assigned 2 guards for night shift.",
        },
      ]);
      setClientActivity([
        {
          id: 1,
          type: "Guard Assigned",
          date: "2025-10-30",
          description: "Rajesh Kumar assigned to night duty.",
          icon: "Shield",
        },
        {
          id: 2,
          type: "Document Uploaded",
          date: "2025-10-29",
          description: "Attendance report uploaded.",
          icon: "FileText",
        },
      ]);
      setLoading(false);
    }
  };

  const fetchRelatedData = async (clientId) => {
    try {
      const guardsResponse = await fetch(`/api/guards?clientId=${clientId}`);
      if (guardsResponse.ok) {
        const guardsData = await guardsResponse.json();
        setGuards(guardsData.guards || []);
      }
    } catch (error) {
      console.error("Error fetching guards:", error);
      setGuards(dummyGuards);
    }

    try {
      const requestsResponse = await fetch(
        `/api/requests?clientId=${clientId}`
      );
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setClientRequests(requestsData.requests || []);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setClientRequests([
        {
          id: 1,
          type: "Document Request",
          date: "2025-10-28",
          status: "Pending",
          description: "Request for salary slips of guards.",
        },
        {
          id: 2,
          type: "Guard Assignment",
          date: "2025-10-25",
          status: "Completed",
          description: "Assigned 2 guards for night shift.",
        },
      ]);
    }

    try {
      const activityResponse = await fetch(
        `/api/activity?clientId=${clientId}`
      );
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setClientActivity(activityData.activity || []);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      setClientActivity([
        {
          id: 1,
          type: "Guard Assigned",
          date: "2025-10-30",
          description: "Rajesh Kumar assigned to night duty.",
          icon: "Shield",
        },
        {
          id: 2,
          type: "Document Uploaded",
          date: "2025-10-29",
          description: "Attendance report uploaded.",
          icon: "FileText",
        },
      ]);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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
          <Button onClick={() => router.push("/admin-dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Profile Header with Avatar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" alt={client.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-background text-xl">
              {client.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {client.name}
            </h1>
            <p className="text-muted-foreground">Client ID: {clientId}</p>
          </div>
        </div>
        <Badge variant="default" className="text-lg px-4 py-2">
          {client.status || "Active"}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guards">Guards</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Enhanced Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-6 w-6" />
                Client Overview
              </CardTitle>
              <CardDescription>
                Comprehensive insights into {client.name}'s engagement and
                performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Enhanced Profile Summary Cards with Icons */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="rounded-2xl border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Shield className="h-6 w-6 text-primary mr-2" />
                      <div className="text-3xl font-bold text-primary">
                        {client.activeGuards}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Active Guards
                    </p>
                    <Progress
                      value={client.activeGuards * 10}
                      className="mt-2 h-1"
                    />
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-success/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Star className="h-6 w-6 text-success mr-2" />
                      <div className="text-3xl font-bold text-success">
                        {client.satisfaction}%
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Satisfaction Rate
                    </p>
                    <Progress
                      value={client.satisfaction}
                      className="mt-2 h-1"
                    />
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-secondary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <TrendingUp className="h-6 w-6 text-secondary mr-2" />
                      <div className="text-3xl font-bold text-secondary">
                        ₹{client.monthlyRevenue}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Revenue
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-destructive/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <UsersIcon className="h-6 w-6 text-destructive mr-2" />
                      <div className="text-3xl font-bold text-destructive">
                        {client.performance?.totalAssignments || 0}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Assignments
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Contact Info with Better Layout */}
              <Card className="rounded-2xl border-border/50 hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Details
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">
                          {client.email}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">
                          {client.phone}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">
                          {client.address}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Joined: {formatDate(client.joined)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Recent Assignments with More Details */}
              <Card className="rounded-2xl border-border/50 hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Recent Assignments
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/50 to-background/30 border border-border/30 hover:shadow-sm transition-all"
                      >
                        <div className="flex-1 mb-3 sm:mb-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-foreground">
                              Night Shift Security
                            </span>
                            <Badge
                              variant="outline"
                              className="rounded-full text-xs"
                            >
                              2 Guards
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(new Date())} - Dec 31, 2025</span>
                            <span>•</span>
                            <span>3 months</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-current text-yellow-500" />
                              <span className="font-medium">4.8</span>
                            </div>
                            <div className="w-20">
                              <Progress
                                value={96}
                                className="h-2 rounded-full bg-muted"
                              />
                            </div>
                          </div>

                          <Badge variant="default" className="rounded-full">
                            Active
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Performance Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="rounded-2xl border-success/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {client.performance?.fulfilledRequests || 0}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Requests Fulfilled
                    </div>
                    <Progress value={80} className="mt-2 h-1" />
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Award className="h-6 w-6 text-blue-600 mr-2" />
                      <div className="text-2xl font-bold text-blue-600">
                        {client.performance?.satisfactionRate || 0}%
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Satisfaction Rate
                    </div>
                    <Progress
                      value={client.performance?.satisfactionRate || 0}
                      className="mt-2 h-1"
                    />
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-secondary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Clock className="h-6 w-6 text-purple-600 mr-2" />
                      <div className="text-2xl font-bold text-purple-600">
                        {client.activeSince || "12 months"}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Active Duration
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guards Tab */}
        <TabsContent value="guards" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Assigned Guards</h2>
            <Dialog open={assignGuardOpen} onOpenChange={setAssignGuardOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Guard
                </Button>
              </DialogTrigger>
              <AssignGuardDialog
                open={assignGuardOpen}
                onOpenChange={setAssignGuardOpen}
                clientId={clientId}
                onAssign={(guard) => {
                  fetchClientDetails();
                }}
              />
            </Dialog>
          </div>

          {guards.length > 0 ? (
            <Card className="rounded-2xl">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guard Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guards.map((guard) => (
                      <TableRow
                        key={guard.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleGuardRowClick(guard.id)}
                      >
                        <TableCell className="font-medium">
                          {guard.name}
                        </TableCell>
                        <TableCell>{guard.email}</TableCell>
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
                        <TableCell>{guard.phone}</TableCell>
                        <TableCell>{guard.joinDate}</TableCell>
                        <TableCell>{guard.experience}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            <span>{guard.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>{guard.location}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
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
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Guards Assigned</h3>
              <p className="text-muted-foreground mb-4">
                This client has no assigned guards yet.
              </p>
              <Dialog open={assignGuardOpen} onOpenChange={setAssignGuardOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Assign First Guard
                  </Button>
                </DialogTrigger>
                <AssignGuardDialog
                  open={assignGuardOpen}
                  onOpenChange={setAssignGuardOpen}
                  clientId={clientId}
                  onAssign={(guard) => {
                    fetchClientDetails();
                  }}
                />
              </Dialog>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Client Documents</h2>
            <Dialog
              open={uploadDocumentOpen}
              onOpenChange={setUploadDocumentOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <UploadDocumentDialog
                open={uploadDocumentOpen}
                onOpenChange={setUploadDocumentOpen}
                clientId={clientId}
                onUpload={async (documents) => {
                  console.log(
                    "🔄 onUpload callback triggered with:",
                    documents
                  );
                  await fetchClientDocuments();
                  if (documents && documents.length > 0) {
                    setClientDocuments((prev) => [...prev, ...documents]);
                  }
                }}
              />
            </Dialog>
          </div>

          {clientDocuments.length > 0 ? (
            <Card className="rounded-2xl">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploader</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {doc.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(doc.uploaded)}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>{doc.uploader}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              doc.access === "general" ? "default" : "secondary"
                            }
                          >
                            {doc.access}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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
          ) : (
            <Card className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Documents</h3>
              <p className="text-muted-foreground mb-4">
                No documents uploaded for this client yet.
              </p>
              <Dialog
                open={uploadDocumentOpen}
                onOpenChange={setUploadDocumentOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload First Document
                  </Button>
                </DialogTrigger>
                <UploadDocumentDialog
                  open={uploadDocumentOpen}
                  onOpenChange={setUploadDocumentOpen}
                  clientId={clientId}
                  onUpload={async (documents) => {
                    await fetchClientDocuments();
                    if (documents && documents.length > 0) {
                      setClientDocuments((prev) => [...prev, ...documents]);
                    }
                  }}
                />
              </Dialog>
            </Card>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </h3>
              {clientActivity.length > 0 ? (
                <div className="space-y-4">
                  {clientActivity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 hover:shadow-md transition-all"
                    >
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(item.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AssignGuardDialog
        open={assignGuardOpen}
        onOpenChange={setAssignGuardOpen}
        clientId={clientId}
        onAssign={(guard) => {
          fetchClientDetails();
        }}
      />

      <UploadDocumentDialog
        open={uploadDocumentOpen}
        onOpenChange={setUploadDocumentOpen}
        clientId={clientId}
        onUpload={async (documents) => {
          console.log("🔄 onUpload callback triggered with:", documents);
          await fetchClientDocuments();
          if (documents && documents.length > 0) {
            setClientDocuments((prev) => [...prev, ...documents]);
          }
        }}
      />
    </div>
  );
}
