abhi bhi upload nhi ho rhe hai, or mujhe samjh nhi aata hai hai ki jo document ki list client-details page me dikhti hai wo document-managment section me admin-dashboard and client-dashboard pr kyu nhi dikhti 


200 in 457ms
Upload route error: Error: Cloudinary upload failed: {"message":"Upload preset must be specified when using unsigned upload"}
    at uploadSingleFileToCloudinary (src\app\api\upload\route.js:36:11)
    at async POST (src\app\api\upload\route.js:106:26)        



  34 |   if (!res.ok) {
  35 |     const errMsg = json.error || json;
> 36 |     throw new Error("Cloudinary upload failed: " + JSON.stringify(errMsg));
     |           ^
  37 |   }
  38 |   // Provide normalized info
  39 |   return {
 POST /api/upload 500 in 3938ms

// File: src/app/admin-dashboard/client-details/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog,  DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,  DialogTrigger,} from "@/components/ui/dialog";
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
import AdminProfileDialog from "@/components/admin/AdminProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { AssignGuardDialog } from "@/components/admin/AssignGuardDialog";
import UploadDocumentDialog from "@/components/admin/UploadDocumentDialog";

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

  // ✅ Use effect mein call karen
  useEffect(() => {
    if (clientId) {
      fetchClientDocuments();
    }
  }, [clientId]);

  // ✅ YEH FUNCTION ADD KAREN - Guard row click handler
  const handleGuardRowClick = (guardId) => {
    router.push(`/admin-dashboard/guard-details/${guardId}`);
  };

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch client data from API
      const clientResponse = await fetch(`/api/auth/client/${clientId}`);

      if (!clientResponse.ok) {
        throw new Error(`Failed to fetch client: ${clientResponse.status}`);
      }

      const clientData = await clientResponse.json();

      if (!clientData.client) {
        throw new Error("Client not found");
      }

      setClient(clientData.client);

      // Fetch related data
      await fetchRelatedData(clientData.client._id);
    } catch (error) {
      console.error("Error fetching client details:", error);
      setError(error.message);
      // Fallback to dummy data only if absolutely necessary
      setClient(getDummyClientData());
      setClientDocuments(getDummyDocuments());
      setClientRequests(getDummyRequests());
      setClientActivity(getDummyActivity());
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedData = async (clientId) => {
    try {
      console.log("🔄 Fetching related data for client:", clientId);

      // Fetch client documents - YEH PART IMPROVE KAREN
      const docsResponse = await fetch(`/api/documents?clientId=${clientId}`);
      if (docsResponse.ok) {
        const docsData = await docsResponse.json();
        console.log("✅ Documents fetched:", docsData.documents);
        setClientDocuments(docsData.documents || []);
      } else {
        console.error("❌ Documents fetch failed");
        // Try alternative API
        try {
          const altDocsResponse = await fetch(
            `/api/auth/client/${clientId}/documents`
          );
          if (altDocsResponse.ok) {
            const altDocsData = await altDocsResponse.json();
            setClientDocuments(altDocsData.documents || []);
          } else {
            setClientDocuments(getDummyDocuments());
          }
        } catch (altError) {
          console.error("Alternative documents fetch failed:", altError);
          setClientDocuments(getDummyDocuments());
        }
      }

      // Fetch client requests
      const requestsResponse = await fetch(
        `/api/requests?clientId=${clientId}`
      );
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setClientRequests(requestsData.requests || []);
      } else {
        setClientRequests(getDummyRequests());
      }

      // Fetch client activity
      const activityResponse = await fetch(
        `/api/activity?clientId=${clientId}`
      );
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setClientActivity(activityData.activities || []);
      } else {
        setClientActivity(getDummyActivity());
      }
    } catch (error) {
      console.error("❌ Error fetching related data:", error);
      setClientDocuments(getDummyDocuments());
      setClientRequests(getDummyRequests());
      setClientActivity(getDummyActivity());
    }
  };

  // Transform database client data to frontend format
  const transformClientData = (dbClient) => {
    return {
      _id: dbClient._id,
      name: dbClient.name || `${dbClient.firstName} ${dbClient.lastName}`,
      email: dbClient.email,
      phone: dbClient.phone,
      companyName: dbClient.companyName || dbClient.company,
      address: dbClient.address,
      securityPlan: dbClient.securityPlan || dbClient.plan || "Standard",
      serviceDuration: {
        from: dbClient.serviceStartDate || dbClient.createdAt,
        to: dbClient.serviceEndDate,
      },
      status: dbClient.status || "Active",
      joinDate: dbClient.createdAt,
      lastLogin: dbClient.lastLogin,
      assignedGuards: dbClient.assignedGuards || [],
      previousGuards: dbClient.previousGuards || [],
      contactPerson: dbClient.contactPerson || dbClient.name,
      billingCycle: dbClient.billingCycle || "Monthly",
      totalGuardsAssigned: dbClient.totalGuardsAssigned || 0,
      activeSince: calculateActiveSince(dbClient.createdAt),
      satisfaction: dbClient.satisfactionRating || 4.5,
      monthlyRevenue: formatRevenue(dbClient.monthlyRevenue),
      performance: {
        totalRequests: dbClient.totalRequests || 0,
        fulfilledRequests: dbClient.fulfilledRequests || 0,
        satisfactionRate: dbClient.satisfactionRate || 0,
        averageRating: dbClient.averageRating || 0,
        retention: dbClient.retentionRate || 0,
      },
      assignmentHistory: dbClient.assignmentHistory || [],
    };
  };

  const calculateActiveSince = (joinDate) => {
    const join = new Date(joinDate);
    const now = new Date();
    const diffTime = Math.abs(now - join);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return `${diffMonths} months`;
  };

  const formatRevenue = (revenue) => {
    if (!revenue) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(revenue);
  };

  // Fallback dummy data (only used when API fails completely)
  const getDummyClientData = () => ({
    _id: clientId,
    name: "John Smith",
    email: "john.smith@techcorp.com",
    phone: "+91 98765 43210",
    companyName: "TechCorp Solutions Pvt. Ltd.",
    address: "123 Business Park, Andheri East, Mumbai - 400069",
    securityPlan: "Enterprise Security",
    serviceDuration: { from: "2025-01-01", to: "2025-12-31" },
    status: "Active",
    joinDate: "2024-01-15",
    lastLogin: "2025-01-15 14:30",
    assignedGuards: [1, 2],
    previousGuards: [3],
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
    ],
  });

  const getDummyDocuments = () => [
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
  ];

  const getDummyRequests = () => [
    {
      id: 1,
      type: "Invoice Copy",
      status: "Pending",
      date: "2025-01-15",
      priority: "High",
      description: "Required for accounting purposes",
    },
  ];

  const getDummyActivity = () => [
    {
      id: 1,
      type: "Assignment Update",
      description: "Guard assignment updated",
      date: "2025-01-15",
      status: "Completed",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge
            variant="default"
            className="rounded-full bg-green-500 text-white"
          >
            Active
          </Badge>
        );
      case "Pending":
        return (
          <Badge
            variant="default"
            className="rounded-full bg-yellow-500 text-white"
          >
            Pending
          </Badge>
        );
      case "Inactive":
        return (
          <Badge
            variant="default"
            className="rounded-full bg-red-500 text-white"
          >
            Inactive
          </Badge>
        );
      case "Fulfilled":
        return (
          <Badge
            variant="default"
            className="rounded-full bg-green-500 text-white"
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
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatFullDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get assigned guards from real data
  const currentGuardsList = (client?.assignedGuards || [])
    .map((guardId) => {
      const foundGuard = guards.find((g) => g._id === guardId);
      if (foundGuard) {
        return foundGuard;
      }
      return (
        dummyGuards.find((g) => g.id === guardId) || {
          id: guardId,
          name: `Guard ${guardId}`,
          location: "Unknown",
          experience: "Unknown",
          rating: 4.0,
          status: "Active",
        }
      );
    })
    .filter(Boolean);

  useEffect(() => {
    const fetchAllGuards = async () => {
      try {
        const response = await fetch("/api/auth/guard");
        const data = await response.json();
        if (data.guards) {
          setGuards(data.guards);
        }
      } catch (error) {
        console.error("Error fetching guards:", error);
      }
    };

    if (clientId) {
      fetchAllGuards();
    }
  }, [clientId]);

  const previousGuardsList = (client?.previousGuards || [])
    .map((guardId) => {
      return (
        dummyGuards.find((g) => g.id === guardId) || {
          id: guardId,
          name: `Guard ${guardId}`,
          location: "Unknown",
          experience: "Unknown",
          rating: 4.0,
          status: "Inactive",
        }
      );
    })
    .filter(Boolean);

  if (loading) {
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

  if (error && !client) {
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
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Error Loading Client
                </h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => router.push("/admin-dashboard")}>
                    Back to Clients
                  </Button>
                  <Button onClick={fetchClientDetails} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Client Not Found
                </h2>
                <p className="text-muted-foreground mb-6">
                  The client you're looking for doesn't exist or has been
                  removed.
                </p>
                <Button onClick={() => router.push("/admin-dashboard")}>
                  Back to Clients
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                    {client.companyName} • {client.securityPlan}
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

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Some data may not be loading correctly: {error}
                  </span>
                </div>
              </div>
            )}

            {/* Rest of your JSX remains the same */}
            {/* Profile Section */}
            <Card className="rounded-3xl border-border/70 shadow-xl overflow-hidden mb-8">
              <CardHeader className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-4 border-white/20 shadow-lg">
                        <Building className="h-16 w-16 text-primary/60" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
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
                          {client.contactPerson || client.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          {client.securityPlan}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          {client.satisfaction || 4.5} (
                          {client.activeSince || "12 months"})
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {client.address
                            ? client.address.split(",")[2] || "Mumbai"
                            : "Mumbai"}
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
                        <div className="text-2xl font-bold text-green-500">
                          {client.performance?.satisfactionRate || 93}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Satisfaction
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="text-center p-3 rounded-xl bg-muted/50">
                        <div className="text-lg font-semibold text-foreground">
                          {client.monthlyRevenue || "₹2,85,000"}
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
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Phone className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Phone</div>
                        <div className="text-sm text-muted-foreground">
                          {client.phone || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Calendar className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          Joined
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(client.joinDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <MapPin className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          Address
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {client.address || "N/A"}
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
                        {client.securityPlan}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-2">
                        Billing: {client.billingCycle || "Monthly"}
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
                        {formatDate(client.serviceDuration?.from)} -{" "}
                        {formatDate(client.serviceDuration?.to)}
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
                        <TrendingUp className="h-5 w-5 text-green-500" />
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
                            {client.performance?.totalRequests || 15}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Fulfilled
                          </div>
                          <div className="text-2xl font-bold text-green-500">
                            {client.performance?.fulfilledRequests || 14}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Satisfaction Rate
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            {client.performance?.satisfactionRate || 93}%
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-muted-foreground">
                            Avg Rating
                          </div>
                          <div className="text-2xl font-bold text-yellow-500">
                            {client.performance?.averageRating || 4.5}
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={client.performance?.retention || 95}
                        className="h-3"
                      />
                      <div className="text-center text-sm text-muted-foreground">
                        Retention Rate: {client.performance?.retention || 95}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border-border/70 shadow-xl">
                    <CardHeader className="p-6">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Award className="h-5 w-5 text-yellow-500" />
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
                                    className="h-3 w-3 fill-current text-yellow-500"
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
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          Current Guards ({currentGuardsList.length})
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => setAssignGuardOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Assign Guard
                        </Button>
                      </div>

                      {currentGuardsList.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          {currentGuardsList.map((guard) => (
                            <Card
                              key={guard.id}
                              className="rounded-2xl border-border/50 hover:shadow-md transition-shadow"
                              onClick={() => handleGuardRowClick(guard._id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                      <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-foreground">
                                        {guard.name}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {guard.location} • {guard.experience}
                                      </div>
                                      <div className="flex items-center gap-1 mt-1">
                                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                                        <span className="text-xs font-medium">
                                          {guard.rating}/5
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <Badge
                                    variant={
                                      guard.status === "Active"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className={`rounded-full ${
                                      guard.status === "Active"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-700"
                                    }`}
                                  >
                                    {guard.status}
                                  </Badge>
                                </div>

                                {guard.skills && guard.skills.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-1">
                                    {guard.skills
                                      .slice(0, 3)
                                      .map((skill, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="text-xs rounded-full"
                                        >
                                          {skill}
                                        </Badge>
                                      ))}
                                    {guard.skills.length > 3 && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs rounded-full"
                                      >
                                        +{guard.skills.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {guard.phone}
                                    </div>
                                  </div>
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
                                      <MessageCircle className="h-4 w-4" />
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <Edit2 className="h-4 w-4 mr-2" />
                                          Edit Assignment
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <FileText className="h-4 w-4 mr-2" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Remove
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-foreground mb-2">
                            No guards assigned
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Assign guards to get started with security services
                          </p>
                          <Button onClick={() => setAssignGuardOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Assign First Guard
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Previous Guards */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <History className="h-5 w-5 text-gray-500" />
                          Previous Guards ({previousGuardsList.length})
                        </h3>
                        {previousGuardsList.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl"
                          >
                            View All
                          </Button>
                        )}
                      </div>

                      {previousGuardsList.length > 0 ? (
                        <div className="space-y-3">
                          {previousGuardsList.slice(0, 5).map((guard) => (
                            <div
                              key={guard.id}
                              className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                  <div className="font-medium text-foreground">
                                    {guard.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {guard.location} • {guard.experience}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                                  <span className="text-xs font-medium">
                                    {guard.rating}/5
                                  </span>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="rounded-full"
                                >
                                  {guard.status}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          {previousGuardsList.length > 5 && (
                            <div className="text-center pt-2">
                              <Button variant="ghost" size="sm">
                                Show {previousGuardsList.length - 5} more
                                previous guards
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 rounded-xl border border-dashed border-border/50">
                          <History className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            No previous guard assignments
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Guard Performance Stats */}
                    <Card className="rounded-2xl border-border/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          Guard Performance Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 rounded-xl bg-green-50 border border-green-200">
                            <div className="text-2xl font-bold text-green-600">
                              {
                                currentGuardsList.filter((g) => g.rating >= 4.5)
                                  .length
                              }
                            </div>
                            <div className="text-xs text-green-700">
                              Excellent
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600">
                              {
                                currentGuardsList.filter(
                                  (g) => g.rating >= 4.0 && g.rating < 4.5
                                ).length
                              }
                            </div>
                            <div className="text-xs text-blue-700">Good</div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                            <div className="text-2xl font-bold text-yellow-600">
                              {
                                currentGuardsList.filter(
                                  (g) => g.rating >= 3.0 && g.rating < 4.0
                                ).length
                              }
                            </div>
                            <div className="text-xs text-yellow-700">
                              Average
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-red-50 border border-red-200">
                            <div className="text-2xl font-bold text-red-600">
                              {
                                currentGuardsList.filter((g) => g.rating < 3.0)
                                  .length
                              }
                            </div>
                            <div className="text-xs text-red-700">
                              Needs Improvement
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <Card className="rounded-3xl border-border/70 shadow-xl">
                  <CardHeader className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Client Documents ({clientDocuments.length})
                        </CardTitle>
                        <CardDescription>
                          All documents specifically shared with {client?.name}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          className="rounded-xl"
                          onClick={() => setUploadDocumentOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={fetchClientDocuments}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {clientDocuments.length > 0 ? (
                      <div className="overflow-hidden rounded-b-3xl">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[300px]">
                                Document
                              </TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead className="hidden md:table-cell">
                                Category
                              </TableHead>
                              <TableHead className="hidden lg:table-cell">
                                Uploaded
                              </TableHead>
                              <TableHead className="hidden sm:table-cell">
                                Size
                              </TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {clientDocuments.map((doc, index) => (
                              <TableRow
                                key={doc._id || index}
                                className="hover:bg-muted/50"
                              >
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <div>
                                      <div className="font-medium text-foreground">
                                        {doc.name}
                                      </div>
                                      <div className="text-sm text-muted-foreground md:hidden">
                                        {formatDate(doc.uploaded)} • {doc.size}
                                      </div>
                                      {doc.fileUrl && (
                                        <div className="text-xs text-blue-600 mt-1">
                                          📎 File Attached
                                        </div>
                                      )}
                                    </div>
                                  </div>
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
                                    {doc.category || "Uncategorized"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                  {formatDate(doc.uploaded)}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-right text-sm text-muted-foreground">
                                  {doc.size}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    {doc.fileUrl && (
                                      <>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 hover:bg-blue-100"
                                          onClick={() =>
                                            window.open(doc.fileUrl, "_blank")
                                          }
                                        >
                                          <Eye className="h-4 w-4 text-blue-600" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 hover:bg-green-100"
                                          onClick={() => {
                                            const link =
                                              document.createElement("a");
                                            link.href = doc.fileUrl;
                                            link.download = doc.name;
                                            link.click();
                                          }}
                                        >
                                          <Download className="h-4 w-4 text-green-600" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 text-destructive hover:bg-red-100"
                                          onClick={async () => {
                                            if (
                                              confirm(`Delete "${doc.name}"?`)
                                            ) {
                                              try {
                                                const response = await fetch(
                                                  `/api/documents/${doc._id}`,
                                                  {
                                                    method: "DELETE",
                                                  }
                                                );

                                                if (response.ok) {
                                                  fetchClientDocuments();
                                                } else {
                                                  throw new Error(
                                                    "Delete failed"
                                                  );
                                                }
                                              } catch (error) {
                                                alert(
                                                  "Failed to delete document"
                                                );
                                              }
                                            }
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          No documents found
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                          Upload documents like agreements, invoices, and
                          reports specifically for this client
                        </p>
                        <Button onClick={() => setUploadDocumentOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Upload Your First Document
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Requests Tab */}
              <TabsContent value="requests" className="space-y-6">
                <Card className="rounded-3xl border-border/70 shadow-xl">
                  <CardHeader className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Client Requests ({clientRequests.length})
                        </CardTitle>
                        <CardDescription>
                          All service requests from {client.name}
                        </CardDescription>
                      </div>
                      <Button className="rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        New Request
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {clientRequests.length > 0 ? (
                      <div className="space-y-4">
                        {clientRequests.map((request) => (
                          <div
                            key={request.id}
                            className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-foreground">
                                    {request.type}
                                  </h4>
                                  {getStatusBadge(request.status)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {request.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
                                <Badge
                                  variant={
                                    request.priority === "High"
                                      ? "destructive"
                                      : request.priority === "Medium"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="rounded-full"
                                >
                                  {request.priority}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(request.date)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Created {formatDate(request.date)}
                                </div>
                                {request.assignedTo && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    Assigned to {request.assignedTo}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {request.status === "Pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="rounded-lg"
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-1" />
                                      Mark Complete
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="rounded-lg"
                                    >
                                      <Edit2 className="h-4 w-4 mr-1" />
                                      Edit
                                    </Button>
                                  </>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <MessageCircle className="h-4 w-4 mr-2" />
                                      Send Update
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Request
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Activity className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          No requests found
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                          {client.name} hasn't made any service requests yet.
                          All requests will appear here.
                        </p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Request
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-8">
                <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-background/80 shadow-xl">
                  <CardHeader className="p-6">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
                      <History className="h-5 w-5 text-primary" />
                      Activity Timeline
                    </CardTitle>
                    <CardDescription>
                      Complete chronological log of all activities and updates
                      for {client.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    {/* Recent Activity */}
                    <div className="space-y-6">
                      <h4 className="font-semibold text-foreground text-lg">
                        Recent Activity
                      </h4>
                      {clientActivity.length > 0 ? (
                        <div className="space-y-4">
                          {clientActivity.map((activity, index) => (
                            <div
                              key={activity.id || index}
                              className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border-l-4 border-primary/50 hover:shadow-md transition-all"
                            >
                              <div className="flex-shrink-0 rounded-full p-2 bg-primary/20 mt-0.5">
                                <Activity className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground truncate">
                                  {activity.type}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {activity.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(activity.date)}
                                  </span>
                                  {activity.user && (
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      By {activity.user}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Badge
                                variant={
                                  activity.status === "Completed"
                                    ? "default"
                                    : activity.status === "In Progress"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="flex-shrink-0 rounded-full"
                              >
                                {activity.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 rounded-2xl border border-dashed border-border/50">
                          <History className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-foreground mb-2">
                            No activity found
                          </h3>
                          <p className="text-muted-foreground">
                            No recent activity for this client
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Assignment History */}
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-muted/30 to-background/50 border border-border/30">
                      <h4 className="font-semibold text-foreground text-lg mb-6 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Assignment History
                      </h4>

                      {(client.assignmentHistory || []).length > 0 ? (
                        <div className="space-y-4">
                          {(client.assignmentHistory || []).map(
                            (assignment, index) => (
                              <div
                                key={assignment.id || index}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-background/50 border border-border/30 hover:shadow-sm transition-shadow"
                              >
                                <div className="flex-1 mb-3 sm:mb-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="font-medium text-foreground">
                                      {assignment.type}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="rounded-full text-xs"
                                    >
                                      {assignment.guards} Guards
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>
                                      {formatDate(assignment.startDate)} -{" "}
                                      {formatDate(assignment.endDate)}
                                    </span>
                                    <span>•</span>
                                    <span>{assignment.duration}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                                      <span className="font-medium">
                                        {assignment.rating}
                                      </span>
                                    </div>
                                    <div className="w-20">
                                      <Progress
                                        value={assignment.rating * 20}
                                        className="h-2 rounded-full bg-muted"
                                      />
                                    </div>
                                  </div>

                                  <Badge
                                    variant={
                                      assignment.status === "Active"
                                        ? "default"
                                        : assignment.status === "Completed"
                                        ? "secondary"
                                        : "outline"
                                    }
                                    className="rounded-full"
                                  >
                                    {assignment.status}
                                  </Badge>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 rounded-xl border border-dashed border-border/50">
                          <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            No assignment history available
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <Card className="rounded-2xl border-border/50">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {client.performance?.fulfilledRequests || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Requests Fulfilled
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl border-border/50">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {client.performance?.satisfactionRate || 0}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Satisfaction Rate
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl border-border/50">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {client.activeSince || "12 months"}
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
            </Tabs>
          </div>
        </main>
      </div>
      <AdminProfileDialog
        open={openAdminDialog}
        onOpenChange={setOpenAdminDialog}
      />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <AssignGuardDialog
        open={assignGuardOpen}
        onOpenChange={setAssignGuardOpen}
        clientId={clientId}
        onAssign={(guard) => {
          // Refresh client data
          fetchClientDetails();
        }}
      />

      <UploadDocumentDialog
        open={uploadDocumentOpen}
        onOpenChange={setUploadDocumentOpen}
        clientId={clientId} // ✅ Yeh important hai - isse document sirf is client ke liye upload hoga
        onUpload={async (documents) => {
          console.log("🔄 onUpload callback triggered with:", documents);

          // Refresh documents list
          await fetchClientDocuments();

          // Also update local state immediately
          if (documents && documents.length > 0) {
            setClientDocuments((prev) => [...prev, ...documents]);
          }
        }}
      />
    </div>
  );
}
 // File: src/app/admin-dashboard/page.jsx - CORRECTED
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/admin/Header";
import DesktopSidebar from "@/components/admin/DesktopSidebar";
import DashboardContent from "@/components/admin/DashboardContent";
import ClientManagement from "@/components/admin/ClientManagement";
import DocumentManagement from "@/components/admin/DocumentManagement";
import RequestReports from "@/components/admin/RequestReports";
import GuardManagement from "@/components/admin/GuardManagement";
import ContactManagement from "@/components/admin/ContactManagement";
import SettingsManagement from "@/components/admin/SettingsManagement";
import AdminProfileDialog from "@/components/admin/AdminProfileDialog";
import RoleManagement from "@/components/admin/RoleManagement";
import { useAuth } from "@/hooks/useAuth";

const dummyClients = [
  {
    id: 1,
    name: "John Smith",
    org: "ABC Corporation",
    email: "john@abc.com",
    phone: "(555) 123-4567",
    joined: "2024-01-15",
    lastLogin: "2025-01-15",
    status: "Active",
    services: ["Corporate Security", "Mobile Patrols"],
    plan: "Security Officer",
    duration: { from: "2025-01-01", to: "2025-12-31" },
    assignedGuards: [1, 2],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    org: "TechCorp Industries",
    email: "sarah@techcorp.com",
    phone: "(555) 987-6543",
    joined: "2024-03-22",
    lastLogin: "2025-01-14",
    status: "Active",
    services: ["Event Security", "CCTV Monitoring"],
    plan: "Security Supervisor",
    duration: { from: "2025-02-01", to: "2025-11-30" },
    assignedGuards: [2, 3],
  },
  {
    id: 3,
    name: "Mike Davis",
    org: "RetailPlus Stores",
    email: "mike@retailplus.com",
    phone: "(555) 456-7890",
    joined: "2025-01-10",
    lastLogin: "Never",
    status: "Pending",
    services: ["Residential Security"],
    plan: "Security Guard",
    duration: { from: "2025-01-10", to: "2025-06-10" },
    assignedGuards: [1],
  },
];

const dummyGuards = [
  {
    id: 1,
    name: "Guard A",
    email: "guardA@example.com",
    phone: "(555) 111-2222",
    status: "Assigned",
    documents: [{ name: "Cert1.pdf", size: "1MB" }],
    type: "Security Guard",
    gender: "Male",
  },
  {
    id: 2,
    name: "Guard B",
    email: "guardB@example.com",
    phone: "(555) 333-4444",
    status: "Not Assigned",
    documents: [
      { name: "Cert2.pdf", size: "2MB" },
      { name: "Doc2.pdf", size: "500KB" },
    ],
    type: "Personal Security Officer",
    gender: "Female",
  },
  {
    id: 3,
    name: "Guard C",
    email: "guardC@example.com",
    phone: "(555) 555-6666",
    status: "Not Active",
    documents: [],
    type: "Security Supervisor",
    gender: "Male",
  },
];

const dummyDocuments = [
  {
    id: 1,
    name: "Service Agreement Template",
    type: "agreement",
    uploaded: "2024-12-01",
    size: "2.1 MB",
    uploader: "Admin",
    access: "general",
    description: "Standard service agreement for new clients.",
    actions: true,
  },
  {
    id: 2,
    name: "Company Privacy Policy",
    type: "attendance",
    uploaded: "2024-11-15",
    size: "1.5 MB",
    uploader: "Legal Team",
    access: "general",
    description: "Updated privacy policy effective 2025.",
    actions: true,
  },
  {
    id: 3,
    name: "Insurance Certificate 2025",
    type: "bills",
    uploaded: "2024-12-20",
    size: "85 KB",
    uploader: "Admin",
    access: "specific",
    description: "Annual insurance coverage details.",
    actions: true,
  },
  {
    id: 4,
    name: "Monthly Operations Report",
    type: "salary-sheet",
    uploaded: "2025-01-01",
    size: "3.2 MB",
    uploader: "Operations Manager",
    access: "specific",
    description: "Q4 2024 operations summary.",
    actions: true,
  },
  {
    id: 5,
    name: "MSME Certificate",
    type: "msme",
    uploaded: "2025-01-05",
    size: "500 KB",
    uploader: "Admin",
    access: "general",
    description: "MSME registration document.",
    actions: true,
  },
];

const dummyRequests = [
  {
    id: 1,
    client: "John Smith",
    type: "Invoice",
    status: "Pending",
    date: "2025-01-15",
  },
  {
    id: 2,
    client: "Sarah Johnson",
    type: "Report",
    status: "Fulfilled",
    date: "2025-01-14",
  },
];

// Document Categories - Define once at top level
const initialDocumentCategories = [
  { id: "agreement", name: "Agreement" },
  { id: "attendance", name: "Attendance" },
  { id: "bills", name: "Bills" },
  { id: "salary-sheet", name: "Salary Sheet" },
  { id: "pay-slip", name: "Pay Slip" },
  { id: "esi", name: "ESI" },
  { id: "pf", name: "PF" },
  { id: "employee-details", name: "Employee Details" },
  { id: "training", name: "Training" },
  { id: "night-checking", name: "Night Checking" },
  { id: "paid-gst", name: "Paid GST" },
];

// Company Document Categories - Define once at top level
const initialCompanyDocumentCategories = [
  { id: "msme", name: "MSME" },
  { id: "gst", name: "GST" },
  { id: "pasara", name: "Pasara" },
  { id: "pan", name: "PAN" },
  { id: "profile", name: "Profile" },
  { id: "bank-details", name: "Bank Details" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [guardSearch, setGuardSearch] = useState("");
  const [docGuardSearch, setDocGuardSearch] = useState("");
  const [selectedGuards, setSelectedGuards] = useState([]);
  const [selectedDocGuards, setSelectedDocGuards] = useState([]);
  const [showSpecificClients, setShowSpecificClients] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [documentCategories, setDocumentCategories] = useState(
    initialDocumentCategories
  );
  const [companyDocumentCategories, setCompanyDocumentCategories] = useState(
    initialCompanyDocumentCategories
  );
  const [guardDocuments, setGuardDocuments] = useState([]);
  const [contactTab, setContactTab] = useState("inquiries");
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: 30,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
  });
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: 587,
  });
  const [frontendCategories, setFrontendCategories] = useState([
    { id: "services", name: "Services" },
    { id: "gallery", name: "Gallery" },
    { id: "clients", name: "Clients" },
    { id: "testimonials", name: "Testimonials" },
  ]);
  const router = useRouter();
  const { user, loading, hasPermission } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const mountedRef = useRef(false); // ✅ ADD: Ref for mounted to prevent loops

  // ✅ FIXED: Fetch all clients for document access control - with mounted check
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const fetchClients = async () => {
      try {
        const response = await fetch("/api/auth/client");
        const data = await response.json();
        if (data.clients) {
          setAllClients(data.clients);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        // Fallback to dummy clients
        setAllClients(dummyClients);
      }
    };
    fetchClients();
  }, []);

  const filteredClientGuards = useMemo(() => {
    return dummyGuards.filter((guard) =>
      guard.name.toLowerCase().includes(guardSearch.toLowerCase())
    );
  }, [guardSearch]);

  const filteredDocGuards = useMemo(() => {
    return allClients.filter((client) =>
      client.name.toLowerCase().includes(docGuardSearch.toLowerCase())
    );
  }, [docGuardSearch, allClients]);

  // ✅ FIXED: Use effect to fetch documents - with mounted ref and better deps to prevent loops
  useEffect(() => {
    if (!mountedRef.current || !user || loading) return;

    const fetchDocuments = async () => {
      try {
        console.log(
          "📥 Fetching documents. Admin: true ClientId: null isCompany:",
          activeTab.startsWith("company-documents")
        );

        let url = "/api/documents?admin=true";
        if (activeTab.startsWith("company-documents")) {
          url += "&isCompanyDocument=true";
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (activeTab.startsWith("company-documents")) {
          setCompanyDocuments(data.documents || []);
          console.log(
            "✅ Admin fetched",
            data.documents?.length || 0,
            "company documents"
          );
        } else {
          setDocuments(data.documents || []);
          console.log(
            "✅ Admin fetched",
            data.documents?.length || 0,
            "documents"
          );
        }
      } catch (error) {
        console.error("❌ Failed to fetch documents:", error);
        if (activeTab.startsWith("company-documents")) {
          setCompanyDocuments([]);
        } else {
          setDocuments([]);
        }
      }
    };

    fetchDocuments();
  }, [activeTab, user, loading]); // ✅ FIXED: Deps include activeTab to fetch only on tab change

  // Auth protection useEffect
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!hasPermission("dashboard-read")) {
      console.log("No admin permission, redirecting to login");
      localStorage.removeItem("authToken");
      router.push("/login");
      return;
    }
  }, [user, loading, router, hasPermission]);

  // Helper functions for document categories
  const getCurrentCategory = () => {
    if (activeTab.startsWith("documents-")) {
      const categoryId = activeTab.replace("documents-", "");
      return documentCategories.find((cat) => cat.id === categoryId) || null;
    }
    return null;
  };

  const getCurrentCompanyCategory = () => {
    if (activeTab.startsWith("company-documents-")) {
      const categoryId = activeTab.replace("company-documents-", "");
      return (
        companyDocumentCategories.find((cat) => cat.id === categoryId) || null
      );
    }
    return null;
  };

  const addNewCompanyCategory = (name) => {
    addNewCategory(name, true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !hasPermission("dashboard-read")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleGuardSearch = (e, type) => {
    if (type === "client") {
      setGuardSearch(e.target.value);
    } else if (type === "doc") {
      setDocGuardSearch(e.target.value);
    }
  };

  const toggleGuardSelection = (guardId, type) => {
    if (type === "client") {
      setSelectedGuards((prev) =>
        prev.includes(guardId)
          ? prev.filter((id) => id !== guardId)
          : [...prev, guardId]
      );
    } else if (type === "doc") {
      setSelectedDocGuards((prev) =>
        prev.includes(guardId)
          ? prev.filter((id) => id !== guardId)
          : [...prev, guardId]
      );
    }
  };

  const handleClientRowClick = (clientId) => {
    router.push(`/admin-dashboard/client-details/${clientId}`);
  };

  const handleGuardRowClick = (guardId) => {
    router.push(`/admin-dashboard/guard-details/${guardId}`);
  };

  const handleAddGuardDocuments = (e) => {
    const files = Array.from(e.target.files);
    setGuardDocuments((prev) => [
      ...prev,
      ...files.map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(0) + "KB",
      })),
    ]);
  };

  const addNewCategory = (newCategoryName, isCompany = false) => {
    if (isCompany) {
      setCompanyDocumentCategories((prev) => [
        ...prev,
        { id: `company-${Date.now()}`, name: newCategoryName },
      ]);
    } else {
      setDocumentCategories((prev) => [
        ...prev,
        { id: `doc-${Date.now()}`, name: newCategoryName },
      ]);
    }
  };

  const renderTabContent = () => {
    switch (true) {
      case activeTab.startsWith("documents"):
        return (
          <DocumentManagement
            dummyDocuments={documents} // ✅ Real data pass karen
            showSpecificClients={showSpecificClients}
            setShowSpecificClients={setShowSpecificClients}
            docGuardSearch={docGuardSearch}
            handleGuardSearch={handleGuardSearch}
            selectedDocGuards={selectedDocGuards}
            toggleGuardSelection={toggleGuardSelection}
            filteredDocGuards={filteredDocGuards} // ✅ FIXED: filteredDocGuards use karen
            currentCategory={getCurrentCategory()}
            addNewCategory={addNewCategory}
            documentCategories={documentCategories}
            companyDocumentCategories={companyDocumentCategories}
            isCompanyDocuments={false}
          />
        );
      case activeTab.startsWith("company-documents"):
        return (
          <DocumentManagement
            dummyDocuments={companyDocuments} // ✅ Real company data pass karen
            showSpecificClients={showSpecificClients}
            setShowSpecificClients={setShowSpecificClients}
            docGuardSearch={docGuardSearch}
            handleGuardSearch={handleGuardSearch}
            selectedDocGuards={selectedDocGuards}
            toggleGuardSelection={toggleGuardSelection}
            filteredDocGuards={filteredDocGuards} // ✅ FIXED: filteredDocGuards use karen
            currentCategory={getCurrentCompanyCategory()}
            addNewCategory={addNewCompanyCategory}
            documentCategories={documentCategories}
            companyDocumentCategories={companyDocumentCategories}
            isCompanyDocuments={true}
          />
        );
      case activeTab === "roles":
        return <RoleManagement />;
      case activeTab === "dashboard":
        return (
          <DashboardContent
            dummyClients={dummyClients}
            dummyDocuments={dummyDocuments}
          />
        );
      case activeTab === "clients":
        return (
          <ClientManagement
            dummyClients={dummyClients}
            guardSearch={guardSearch}
            handleGuardSearch={handleGuardSearch}
            selectedGuards={selectedGuards}
            toggleGuardSelection={toggleGuardSelection}
            filteredClientGuards={filteredClientGuards}
            handleClientRowClick={handleClientRowClick}
          />
        );
      case activeTab === "requests":
        return <RequestReports dummyRequests={dummyRequests} />;
      case activeTab === "guards":
        return (
          <GuardManagement
            dummyGuards={dummyGuards}
            guardDocuments={guardDocuments}
            handleAddGuardDocuments={handleAddGuardDocuments}
            handleGuardRowClick={handleGuardRowClick}
          />
        );
      case activeTab === "contact":
        return (
          <ContactManagement
            contactTab={contactTab}
            setContactTab={setContactTab}
            dummyContactSubmissions={dummyContactSubmissions}
          />
        );
      case activeTab === "settings":
        return (
          <SettingsManagement
            companyInfo={companyInfo}
            securitySettings={securitySettings}
            notificationSettings={notificationSettings}
            emailSettings={emailSettings}
            frontendCategories={frontendCategories}
            dummyWeProvideServices={dummyWeProvideServices}
            dummyGalleryItems={dummyGalleryItems}
            dummyFrontendClients={dummyFrontendClients}
            dummyTestimonials={dummyTestimonials}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        openAdminDialog={openAdminDialog}
        setOpenAdminDialog={setOpenAdminDialog}
        documentCategories={documentCategories}
        companyDocumentCategories={companyDocumentCategories}
      />

      <div className="flex flex-1">
        <DesktopSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documentCategories={documentCategories}
          companyDocumentCategories={companyDocumentCategories}
          setDocumentCategories={setDocumentCategories}
        />

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {renderTabContent()}
            </Tabs>
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
// File: src/components/admin/DocumentManagement.jsx
"use client";

import { useState, useEffect } from "react";
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
  SelectGroup,
  SelectLabel,
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
  Download,
  Trash2,
  Plus,
  Search,
  FileText,
  Shield,
  Calendar,
  Eye,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function DocumentManagement({
  showSpecificClients,
  setShowSpecificClients,
  docGuardSearch,
  handleGuardSearch,
  selectedDocGuards,
  toggleGuardSelection,
  filteredDocGuards,
  currentCategory,
  addNewCategory,
  documentCategories = [],
  companyDocumentCategories = [],
  isCompanyDocuments = false,
}) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [accessLevel, setAccessLevel] = useState("general");
  const [docName, setDocName] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [allClients, setAllClients] = useState([]);

  // ✅ REAL DATA FROM API
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // ✅ Fetch documents from API
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/documents");
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all clients for access control
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/auth/users");
        const data = await response.json();
        const clientUsers =
          data.users?.filter((u) => u.role === "client") || [];
        setAllClients(clientUsers);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  // ✅ Filter documents based on current category and search
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      !searchQuery ||
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !currentCategory ||
      currentCategory === "add-tab" ||
      doc.category === currentCategory?.name?.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const getPageTitle = () => {
    if (currentCategory === "add-tab") {
      return "Create New Document Category";
    }
    if (currentCategory) {
      return currentCategory.child
        ? `${currentCategory.name} - ${currentCategory.child} Repository`
        : `${currentCategory.name} Repository`;
    }
    return isCompanyDocuments
      ? "Company Document Repository"
      : "Secure Document Repository";
  };

  const getPageDescription = () => {
    if (currentCategory === "add-tab") {
      return "Organize your documents with custom categories for optimal security and accessibility.";
    }
    if (currentCategory) {
      const categoryName = currentCategory.name?.toLowerCase() || "";
      return `Manage encrypted ${categoryName} documents with role-based access.`;
    }
    return isCompanyDocuments
      ? "All company documents across categories, with audit logs and secure sharing."
      : "All documents across categories, with audit logs and secure sharing.";
  };

  // ✅ Handle multiple file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    if (files.length > 0) {
      setUploadProgress(50); // Quick visual feedback
    }
  };

  // ✅ Handle document upload with multiple files
  const handleDocumentUpload = async () => {
    if (!docName || selectedFiles.length === 0 || !selectedType) {
      toast.error("Please fill all required fields and select file(s)");
      return;
    }

    if (accessLevel === "specific" && selectedDocGuards.length === 0) {
      toast.error("Please select at least one client for specific access");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Upload files to Cloudinary
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      setUploadProgress(25);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || "Upload failed");
      }

      setUploadProgress(50);

      // Step 2: Save documents to database
      const documentsToSave = uploadData.files.map((file, index) => ({
        title:
          selectedFiles.length === 1 ? docName : `${docName} - ${index + 1}`,
        description: docDescription,
        fileUrl: file.fileUrl,
        publicId: file.publicId,
        fileType: file.fileType,
        fileSize: file.fileSize,
        category: accessLevel === "general" ? "company" : "client-specific",
        accessibleTo: accessLevel === "specific" ? selectedDocGuards : [],
      }));

      setUploadProgress(75);
      const saveRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents: documentsToSave }),
      });

      const saveData = await saveRes.json();
      if (!saveData.success) {
        throw new Error(saveData.error || "Failed to save documents");
      }

      setUploadProgress(100);
      toast.success(
        `${selectedFiles.length} document(s) uploaded successfully!`
      );

      setAddDialogOpen(false);
      resetUploadForm();
      fetchDocuments(); // Refresh list
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload documents");
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setDocName("");
    setDocDescription("");
    setSelectedFiles([]);
    setSelectedType("");
    setAccessLevel("general");
    setShowSpecificClients(false);
    setUploadProgress(0);
  };

  const [uploading, setUploading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getAccessBadge = (doc) => {
    if (doc.category === "company") {
      return (
        <Badge className="bg-green-500 text-white rounded-full">
          General Access
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-500 text-white rounded-full">
        Specific Access
      </Badge>
    );
  };

  const handleDownload = async (doc) => {
    try {
      const response = await fetch(doc.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.title || "document";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  const handleView = (doc) => {
    window.open(doc.fileUrl, "_blank");
  };

  const handleDelete = async (doc) => {
    if (!confirm(`Are you sure you want to delete "${doc.title}"?`)) return;

    try {
      const response = await fetch(`/api/documents/${doc._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Document deleted successfully!");
        fetchDocuments();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    }
  };

  const showAccessDialog = (doc) => {
    setSelectedDoc(doc);
    setAccessDialogOpen(true);
  };

  const renderAccessList = (doc) => {
    if (doc.category === "company") {
      return <Badge variant="secondary">All Users</Badge>;
    }

    const accessList = doc.accessibleTo || [];
    if (accessList.length === 0) {
      return <Badge variant="outline">No Access</Badge>;
    }

    if (accessList.length <= 2) {
      return (
        <div className="flex flex-wrap gap-1">
          {accessList.map((user) => (
            <Badge key={user._id} variant="secondary">
              {user.name}
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{accessList[0].name}</Badge>
        <Badge variant="secondary">{accessList[1].name}</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => showAccessDialog(doc)}
          className="h-6 px-2"
        >
          <Users className="w-3 h-3 mr-1" />+{accessList.length - 2} more
        </Button>
      </div>
    );
  };

  const getAvailableCategories = () => {
    return isCompanyDocuments ? companyDocumentCategories : documentCategories;
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      addNewCategory(newCategoryName);
      setNewCategoryName("");
      toast.success(`Category "${newCategoryName}" added!`);
    }
  };

  const setActiveTab = (tab) => {
    console.log("Setting active tab to:", tab);
  };

  // Render Add New Tab page
  if (currentCategory === "add-tab") {
    return (
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-primary">
              {getPageTitle()}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {getPageDescription()}
            </p>
          </div>
          <Button
            onClick={() =>
              setActiveTab(
                isCompanyDocuments ? "company-documents-all" : "documents-all"
              )
            }
            className="rounded-2xl px-6"
          >
            Back to Documents
          </Button>
        </div>

        <Card className="rounded-3xl border-border/70 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Category
            </CardTitle>
            <CardDescription>
              Create a custom category to better organize your documents
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="newCategory" className="text-sm font-medium">
                  Category Name
                </Label>
                <Input
                  id="newCategory"
                  placeholder="e.g., Contracts, Invoices"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-2 rounded-2xl"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="rounded-2xl flex-1"
                  onClick={() => setNewCategoryName("")}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-2xl flex-1 bg-primary"
                  onClick={handleAddNewCategory}
                  disabled={!newCategoryName.trim()}
                >
                  Create Category
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h2 className="text-3xl font-bold text-foreground">
            {getPageTitle()}
          </h2>
          <p className="text-muted-foreground">{getPageDescription()}</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl px-6 bg-primary shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-2xl p-0">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="text-xl font-bold">
                Upload Secure Document
              </DialogTitle>
              <DialogDescription>
                All files are automatically encrypted and access-controlled
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="docName" className="text-sm font-semibold">
                    Document Name *
                  </Label>
                  <Input
                    id="docName"
                    placeholder="e.g., Q4 Financial Report"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="mt-2 rounded-2xl"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold">
                    Description (Optional)
                  </Label>
                  <Input
                    placeholder="Brief description"
                    value={docDescription}
                    onChange={(e) => setDocDescription(e.target.value)}
                    className="mt-2 rounded-2xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="docType" className="text-sm font-semibold">
                      Document Type *
                    </Label>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger className="mt-2 rounded-2xl">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          {getAvailableCategories().map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="accessLevel"
                      className="text-sm font-semibold"
                    >
                      Access Level *
                    </Label>
                    <Select
                      value={accessLevel}
                      onValueChange={(value) => {
                        setAccessLevel(value);
                        if (value === "general") setShowSpecificClients(false);
                      }}
                    >
                      <SelectTrigger className="mt-2 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="general">
                          General Access (All Clients)
                        </SelectItem>
                        <SelectItem value="specific">
                          Specific Clients
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {accessLevel === "specific" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Select Clients (Specific Access)
                    </Label>
                    <div className="max-h-40 overflow-y-auto border rounded-xl p-3 space-y-2">
                      {filteredDocGuards.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No clients available
                        </p>
                      ) : (
                        filteredDocGuards.map((client) => (
                          <div
                            key={client._id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
                          >
                            <Checkbox
                              id={`doc-client-${client._id}`}
                              checked={selectedDocGuards.includes(client._id)}
                              onCheckedChange={() =>
                                toggleGuardSelection(client._id, "doc")
                              }
                            />
                            <Label
                              htmlFor={`doc-client-${client._id}`}
                              className="text-sm cursor-pointer flex-1"
                            >
                              <div className="font-medium">{client.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {client.email}
                              </div>
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Upload Files * (Multiple files supported)
                  </Label>
                  <div
                    className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-1">
                      {selectedFiles.length > 0
                        ? `${selectedFiles.length} file(s) selected`
                        : "Drop files or click to browse"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOCX, XLSX • Max 10MB each • Auto-encrypted
                    </p>
                    {selectedFiles.length > 0 && (
                      <div className="mt-3 text-left space-y-1">
                        {selectedFiles.map((file, idx) => (
                          <p
                            key={idx}
                            className="text-xs text-muted-foreground"
                          >
                            {idx + 1}. {file.name} ({formatFileSize(file.size)})
                          </p>
                        ))}
                      </div>
                    )}
                    <Progress
                      value={uploadProgress}
                      className="mt-4 h-2 rounded-full"
                    />
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 border-t space-x-2">
              <Button
                variant="outline"
                className="rounded-2xl px-6"
                onClick={() => {
                  setAddDialogOpen(false);
                  resetUploadForm();
                }}
              >
                Cancel
              </Button>
              <Button
                className="rounded-2xl bg-primary shadow-lg px-8 text-white"
                onClick={handleDocumentUpload}
                disabled={
                  uploading ||
                  !docName ||
                  !selectedType ||
                  selectedFiles.length === 0
                }
              >
                {uploading
                  ? `Uploading... ${uploadProgress}%`
                  : `Upload ${
                      selectedFiles.length > 0
                        ? `(${selectedFiles.length})`
                        : ""
                    }`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-background/80 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-3 text-foreground">
                <FileText className="h-7 w-7 text-primary" />
                {isCompanyDocuments
                  ? "Company Document Library"
                  : "Document Library"}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                {filteredDocuments.length} items • Last audit:{" "}
                {formatDate(new Date().toISOString())}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-2xl h-10 w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-border/50">
                <TableRow>
                  <TableHead className="font-semibold text-primary">
                    Document Name
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    Category
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    Access
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    Uploaded
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    Size
                  </TableHead>
                  <TableHead className="text-right font-semibold text-primary">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading documents...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">
                        No documents in this repository
                      </p>
                      <p className="text-sm">
                        Upload your first secure document to begin.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc._id}
                      className="hover:bg-muted/20 transition-colors border-b border-border/20"
                    >
                      <TableCell className="font-semibold flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          {doc.title}
                          {doc.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            doc.category === "company" ? "default" : "secondary"
                          }
                          className="rounded-full capitalize"
                        >
                          {doc.category === "company" ? "Company" : "Client"}
                        </Badge>
                      </TableCell>
                      <TableCell>{renderAccessList(doc)}</TableCell>
                      <TableCell className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(doc.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatFileSize(doc.fileSize)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0"
                            onClick={() => handleView(doc)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0"
                            onClick={() => handleDownload(doc)}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0 text-destructive"
                            onClick={() => handleDelete(doc)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Access List Dialog */}
      <Dialog open={accessDialogOpen} onOpenChange={setAccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Access</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Users who can access "{selectedDoc?.title}":
            </p>
            <div className="space-y-2">
              {selectedDoc?.accessibleTo?.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Badge variant="secondary">{user.role}</Badge>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// File: src/components/client/ClientDocuments.jsx
"use client";

import { useState, useEffect } from "react";
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
import {
  FileText,
  Eye,
  Download,
  Calendar,
  Search,
  Folder,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ClientDocuments({
  currentCategory,
  clientId,
  onDocumentsUpdate,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // ✅ ADD: Mounted flag to prevent multiple fetches

  // ✅ FIXED: Better clientId validation and fetch logic with mounted check
  useEffect(() => {
    console.log("🔄 ClientDocuments useEffect - clientId:", clientId);

    if (!mounted) {
      setMounted(true);
      return;
    }

    // Wait a bit for clientId to be available from parent
    const timer = setTimeout(() => {
      if (clientId && isValidObjectId(clientId)) {
        console.log("✅ Valid clientId found, fetching documents");
        fetchDocuments();
      } else {
        console.warn("⚠️ Invalid clientId, will retry:", clientId);
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [clientId, currentCategory, mounted]); // ✅ FIXED: Added mounted to deps

  // ✅ ADD: ObjectId validation function
  const isValidObjectId = (id) => {
    if (!id || id === "undefined" || id === "null" || id === "admin") {
      return false;
    }
    // Check if it's a valid MongoDB ObjectId (24 character hex string)
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const fetchDocuments = async () => {
    // ✅ DOUBLE CHECK clientId before fetch
    if (!isValidObjectId(clientId)) {
      console.error("❌ Invalid clientId for fetch:", clientId);
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Fetching documents for client:", clientId);

      const response = await fetch(`/api/documents?clientId=${clientId}`);
      const data = await response.json();

      if (response.ok) {
        console.log(
          "✅ Documents fetched successfully:",
          data.documents?.length || 0
        );
        setDocuments(data.documents || []);
      } else {
        console.error("❌ API Error:", data.error);
        setDocuments([]);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Add event listener for document updates with mounted check
  useEffect(() => {
    if (!mounted) return;

    const handleDocumentsUpdated = () => {
      console.log("📢 Documents updated event received");
      if (isValidObjectId(clientId)) {
        fetchDocuments();
      }
    };

    window.addEventListener("documentsUpdated", handleDocumentsUpdated);

    return () => {
      window.removeEventListener("documentsUpdated", handleDocumentsUpdated);
    };
  }, [clientId, mounted]); // ✅ FIXED: Added mounted

  const refreshDocuments = () => {
    console.log("🔄 Manual refresh called");
    if (isValidObjectId(clientId)) {
      fetchDocuments();
    } else {
      console.error("❌ Cannot refresh - invalid clientId:", clientId);
    }
  };

  // ✅ FIXED: Pass refresh function to parent
  useEffect(() => {
    if (onDocumentsUpdate && isValidObjectId(clientId)) {
      onDocumentsUpdate(refreshDocuments);
    }
  }, [onDocumentsUpdate, clientId]);

  // ✅ Filter documents based on search and category
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description &&
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ✅ Determine page title and description - Company Documents Style
  const getPageTitle = () => {
    if (currentCategory && currentCategory !== "documents") {
      return `${currentCategory.name} Documents`;
    }
    return "Client Document Repository";
  };

  const getPageDescription = () => {
    if (currentCategory && currentCategory !== "documents") {
      return `Access your ${currentCategory.name.toLowerCase()} documents with secure viewing and download options.`;
    }
    return "All your personal documents, agreements, and important files organized for easy access.";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getAccessBadge = (accessLevel) => {
    const variants = {
      general: {
        variant: "default",
        className: "bg-green-500 text-white rounded-full",
        label: "General Access",
      },
      specific: {
        variant: "secondary",
        className: "bg-blue-500 text-white rounded-full",
        label: "Specific Access",
      },
    };
    const config = variants[accessLevel] || {
      variant: "secondary",
      label: accessLevel,
    };
    return <Badge {...config}>{config.label}</Badge>;
  };

  // ✅ Handle document download
  const handleDownload = (doc) => {
    const link = document.createElement("a");
    link.href = doc.fileUrl;
    link.download = doc.name;
    link.click();
  };

  // ✅ Handle document view - NEW: Open in new tab without download
  const handleView = (doc) => {
    window.open(doc.fileUrl, "_blank");
  };

  const handleRefresh = () => {
    refreshDocuments();
    if (onDocumentsUpdate) {
      onDocumentsUpdate();
    }
  };

  // ✅ FIXED: Show loading state while waiting for valid clientId
  if (!isValidObjectId(clientId) && loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16 text-muted-foreground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl font-medium">Loading documents...</p>
          <p className="text-sm">
            Please wait while we authenticate your session
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ Header Section - Company Documents Style */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground">
            {getPageTitle()}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
            {getPageDescription()}
          </p>
        </div>
      </div>

      {/* ✅ Search Section - Company Documents Style */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 gap-3">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-2xl h-10 pl-10 w-full"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || !isValidObjectId(clientId)}
            className="rounded-2xl h-10 px-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* ✅ Stats Bar - Company Documents Style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-primary">
              {loading ? "-" : filteredDocuments.length}
            </div>
            <div className="text-xs text-muted-foreground">Documents</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-green-500/5 to-green-500/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-green-600">
              {loading
                ? "-"
                : filteredDocuments.filter((d) => d.accessLevel === "general")
                    .length}
            </div>
            <div className="text-xs text-muted-foreground">Public</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-blue-600">
              {loading
                ? "-"
                : filteredDocuments.filter((d) => d.accessLevel === "specific")
                    .length}
            </div>
            <div className="text-xs text-muted-foreground">Restricted</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-purple-600">
              {loading
                ? "-"
                : new Set(filteredDocuments.map((d) => d.type)).size}
            </div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Content Section - Company Documents Style */}
      <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-background/80 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Folder className="h-6 w-6 sm:h-7 sm:w-7 text-primary flex-shrink-0" />
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  Client Document Library
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                  {currentCategory && currentCategory !== "documents"
                    ? `${currentCategory.name} • `
                    : "All Documents • "}
                  {loading ? "Loading..." : `${filteredDocuments.length} items`}{" "}
                  • Last updated:{" "}
                  {formatDate(new Date().toISOString().split("T")[0])}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-border/50">
                <TableRow>
                  <TableHead className="font-semibold text-primary w-[300px]">
                    Document Name
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-semibold text-primary">
                    Description
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    Access
                  </TableHead>
                  <TableHead className="hidden sm:table-cell font-semibold text-primary">
                    Uploaded
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-semibold text-primary">
                    Size
                  </TableHead>
                  <TableHead className="text-right font-semibold text-primary">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">
                        Loading documents...
                      </p>
                    </TableCell>
                  </TableRow>
                ) : filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">No documents found</p>
                      <p className="text-sm">
                        {searchQuery
                          ? "Try adjusting your search criteria."
                          : currentCategory && currentCategory !== "documents"
                          ? `No ${currentCategory.name.toLowerCase()} documents available yet.`
                          : `No documents available yet.`}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc._id}
                      className="hover:bg-muted/20 transition-colors border-b border-border/20"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-primary/10 flex-shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">
                              {doc.name}
                            </div>
                            <Badge
                              variant="outline"
                              className="mt-1 text-xs rounded-full"
                            >
                              {doc.type}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                        {doc.description || "No description"}
                      </TableCell>
                      <TableCell>{getAccessBadge(doc.accessLevel)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(doc.uploaded)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {doc.size}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0"
                            onClick={() => handleView(doc)} // ✅ FIXED: Added view handler
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
// New File: src/components/client/CompanyDocuments.jsx
"use client";

import { useState } from "react";
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
import {
  FileText,
  Eye,
  Download,
  Calendar,
  Search,
  Building,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CompanyDocuments({
  dummyDocuments,
  currentCategory,
  clientId,
}) {
  // ✅ FIXED: Added clientId prop
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ FIXED: Use dummyDocuments and clientId - Filter for general or specific to this client
  const filteredDocuments = (
    currentCategory && currentCategory !== "company-documents"
      ? dummyDocuments.filter(
          (doc) =>
            (doc.accessLevel === "general" ||
              (doc.specificClients &&
                doc.specificClients.includes(clientId))) && // ✅ FIXED: Check access with safe array
            doc.type === currentCategory.id // Assuming type is category id
        )
      : dummyDocuments.filter(
          (doc) =>
            doc.accessLevel === "general" ||
            (doc.specificClients && doc.specificClients.includes(clientId)) // ✅ General or specific to this client - safe check
        )
  ).filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description || "").toLowerCase().includes(searchQuery.toLowerCase()) // ✅ FIXED: Safe description access
  );

  // Determine page title and description
  const getPageTitle = () => {
    if (currentCategory && currentCategory !== "company-documents") {
      return `${currentCategory.name} Documents`;
    }
    return "Company Document Repository";
  };

  const getPageDescription = () => {
    if (currentCategory && currentCategory !== "company-documents") {
      return `Access your ${currentCategory.name.toLowerCase()} documents with secure viewing and download options.`;
    }
    return "All company documents, certificates, and important files organized for easy access.";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getAccessBadge = (access) => {
    const variants = {
      general: {
        variant: "default",
        className: "bg-green-500 text-white rounded-full",
        label: "General Access",
      },
      specific: {
        variant: "secondary",
        className: "bg-blue-500 text-white rounded-full",
        label: "Specific Access",
      },
    };
    const config = variants[access] || { variant: "secondary", label: access };
    return <Badge {...config}>{config.label}</Badge>;
  };

  // ✅ Handle document download
  const handleDownload = (doc) => {
    const link = document.createElement("a");
    link.href = doc.fileUrl;
    link.download = doc.name;
    link.click();
  };

  // ✅ Handle document view - NEW: Open in new tab
  const handleView = (doc) => {
    window.open(doc.fileUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-foreground">
            {getPageTitle()}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
            {getPageDescription()}
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 gap-3">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search company documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-2xl h-10 pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-primary">
              {filteredDocuments.length}
            </div>
            <div className="text-xs text-muted-foreground">Documents</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-green-500/5 to-green-500/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-green-600">
              {
                filteredDocuments.filter((d) => d.accessLevel === "general")
                  .length
              }
            </div>
            <div className="text-xs text-muted-foreground">Public</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-blue-600">
              {
                filteredDocuments.filter((d) => d.accessLevel === "specific")
                  .length
              }
            </div>
            <div className="text-xs text-muted-foreground">Restricted</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/30 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
          <CardContent className="p-3">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(filteredDocuments.map((d) => d.type)).size}
            </div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Section */}
      <Card className="rounded-3xl border-border/70 bg-gradient-to-br from-card to-background/80 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Building className="h-6 w-6 sm:h-7 sm:w-7 text-primary flex-shrink-0" />
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  Company Document Library
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                  {currentCategory && currentCategory !== "company-documents"
                    ? `${currentCategory.name} • `
                    : "All Company Documents • "}
                  {filteredDocuments.length} items • Last updated:{" "}
                  {formatDate(new Date().toISOString().split("T")[0])}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-border/50">
                <TableRow>
                  <TableHead className="font-semibold text-primary w-[300px]">
                    Document Name
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-semibold text-primary">
                    Description
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    Access
                  </TableHead>
                  <TableHead className="hidden sm:table-cell font-semibold text-primary">
                    Uploaded
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-semibold text-primary">
                    Size
                  </TableHead>
                  <TableHead className="text-right font-semibold text-primary">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">No documents found</p>
                      <p className="text-sm">
                        {searchQuery
                          ? "Try adjusting your search criteria."
                          : currentCategory &&
                            currentCategory !== "company-documents"
                          ? `No ${currentCategory.name.toLowerCase()} documents available yet.`
                          : `No company documents available yet.`}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc.id}
                      className="hover:bg-muted/20 transition-colors border-b border-border/20"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-primary/10 flex-shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">
                              {doc.name}
                            </div>
                            <Badge
                              variant="outline"
                              className="mt-1 text-xs rounded-full"
                            >
                              {doc.type}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                        {doc.description || "No description"}{" "}
                        {/* ✅ FIXED: Safe access */}
                      </TableCell>
                      <TableCell>{getAccessBadge(doc.accessLevel)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(doc.uploaded)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {doc.size}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0"
                            onClick={() => handleView(doc)} // ✅ NEW: View button
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-9 w-9 p-0"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
