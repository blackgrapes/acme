// Updated File: src/app/admin-dashboard/guard-details/[id]/page.jsx
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
  Loader2,
} from "lucide-react";
import Header from "@/components/admin/Header";
import DesktopSidebar from "@/components/admin/DesktopSidebar";
import MobileMenu from "@/components/admin/MobileMenu";
import AdminProfileDialog from "@/components/admin/AdminProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { toast } from "@/hooks/use-toast";

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

export default function GuardDetails() {
  const params = useParams();
  const guardId = params.id;
  const [guard, setGuard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showSpecificAccess, setShowSpecificAccess] = useState(false);
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const router = useRouter();

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
        setEditFormData(result.guard);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch guard details",
          variant: "destructive",
        });
        router.push("/admin-dashboard");
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

  const handleUpdateGuard = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`/api/auth/guard/${guardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: result.message || "Guard updated successfully!",
        });
        setGuard(result.guard);
        setEditDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update guard",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating guard:", error);
      toast({
        title: "Error",
        description: "Failed to update guard",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeactivateGuard = async () => {
    if (!confirm("Are you sure you want to deactivate this guard?")) {
      return;
    }

    try {
      const response = await fetch(`/api/auth/guard/${guardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Inactive" }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: result.message || "Guard deactivated successfully!",
        });
        setGuard(result.guard);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to deactivate guard",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deactivating guard:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate guard",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
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
              <div className="text-center">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-destructive" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Guard Not Found
                </h2>
                <p className="text-muted-foreground mb-4">
                  The guard you're looking for doesn't exist.
                </p>
                <Button onClick={() => router.push("/admin-dashboard")}>
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
            {status}
          </Badge>
        );
      case "Available":
        return (
          <Badge
            variant="default"
            className="rounded-full bg-primary text-primary-foreground"
          >
            Available
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
      case "On Leave":
        return (
          <Badge
            variant="default"
            className="rounded-full bg-warning text-warning-foreground"
          >
            On Leave
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

                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Guard Profile</DialogTitle>
                      <DialogDescription>
                        Update the guard's information and details.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateGuard}>
                      <div className="grid gap-4 py-4 grid-cols-1 md:grid-cols-2">
                        <div className="space-y-3">
                          <Label
                            htmlFor="edit-name"
                            className="text-sm font-medium"
                          >
                            Full Name
                          </Label>
                          <Input
                            id="edit-name"
                            value={editFormData.name || ""}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="edit-email"
                            className="text-sm font-medium"
                          >
                            Email
                          </Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={editFormData.email || ""}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="edit-phone"
                            className="text-sm font-medium"
                          >
                            Phone
                          </Label>
                          <Input
                            id="edit-phone"
                            value={editFormData.phone || ""}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="edit-type"
                            className="text-sm font-medium"
                          >
                            Guard Type
                          </Label>
                          <Select
                            value={editFormData.type || ""}
                            onValueChange={(value) =>
                              handleInputChange("type", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Security Guard">
                                Security Guard
                              </SelectItem>
                              <SelectItem value="Security Officer">
                                Security Officer
                              </SelectItem>
                              <SelectItem value="Personal Security Officer">
                                Personal Security Officer
                              </SelectItem>
                              <SelectItem value="Security Supervisor">
                                Security Supervisor
                              </SelectItem>
                              <SelectItem value="Lady Security Guard">
                                Lady Security Guard
                              </SelectItem>
                              <SelectItem value="Security Gunmen">
                                Security Gunmen
                              </SelectItem>
                              <SelectItem value="Ex-men Security Guard & Bodyguards">
                                Ex-men Security Guard
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="edit-status"
                            className="text-sm font-medium"
                          >
                            Status
                          </Label>
                          <Select
                            value={editFormData.status || ""}
                            onValueChange={(value) =>
                              handleInputChange("status", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Available">
                                Available
                              </SelectItem>
                              <SelectItem value="Assigned">Assigned</SelectItem>
                              <SelectItem value="On Leave">On Leave</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="edit-location"
                            className="text-sm font-medium"
                          >
                            Location
                          </Label>
                          <Input
                            id="edit-location"
                            value={editFormData.location || ""}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                          <Label
                            htmlFor="edit-address"
                            className="text-sm font-medium"
                          >
                            Address
                          </Label>
                          <Input
                            id="edit-address"
                            value={editFormData.address || ""}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={updating}>
                          {updating && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          {updating ? "Updating..." : "Update Guard"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-xl"
                  onClick={handleDeactivateGuard}
                  disabled={guard.status === "Inactive"}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {guard.status === "Inactive" ? "Deactivated" : "Deactivate"}
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
                          <IdCard className="h-4 w-4" />
                          {guard.guardId}
                        </div>
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
                    {guard.emergencyContact && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                        <div className="p-2 bg-warning/10 rounded-lg">
                          <Phone className="h-4 w-4 text-warning" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            Emergency Contact
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {guard.emergencyContact}
                          </div>
                        </div>
                      </div>
                    )}
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
                        <Calendar className="h-4 w-4 text-info" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          Join Date
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(guard.joinDate)}
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
                          No specializations added
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
                          No certifications added
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
                        {guard.currentAssignment
                          ? `Active security deployment for ${guard.currentAssignment.clientName}`
                          : "No current assignment"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {guard.currentAssignment ? (
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
                                {formatDate(guard.currentAssignment.startDate)}{" "}
                                - {formatDate(guard.currentAssignment.endDate)}
                              </div>
                              <div className="text-xs text-success font-medium">
                                Active
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No current assignment
                          </p>
                        </div>
                      )}
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
                              {guard.rating || 0}/5
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              Overall
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-current text-warning" />
                              <span className="text-sm font-medium">
                                {guard.rating || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Progress
                          value={guard.performance?.successRate || 0}
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {guard.performance?.successRate || 0}% Success Rate •{" "}
                          {guard.performance?.completedAssignments || 0}/
                          {guard.performance?.totalAssignments || 0} Assignments
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
                    </div>
                    <CardDescription>
                      All documents associated with {guard.name} (
                      {guard.documents ? guard.documents.length : 0} total)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {guard.documents && guard.documents.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-b border-border/50">
                            <TableHead className="text-left">
                              Document
                            </TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Category
                            </TableHead>
                            <TableHead>Uploaded</TableHead>
                            <TableHead className="text-right">Size</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {guard.documents.map((doc, index) => (
                            <TableRow
                              key={index}
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
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          No documents found
                        </h3>
                        <p className="text-muted-foreground">
                          No documents have been uploaded for this guard.
                        </p>
                      </div>
                    )}
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
                    {guard.currentAssignment ? (
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
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No current assignment
                        </p>
                      </div>
                    )}

                    {/* Assignment History */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <History className="h-5 w-5 text-secondary" />
                        Assignment History (
                        {guard.assignmentHistory
                          ? guard.assignmentHistory.length
                          : 0}
                        )
                      </h3>
                      {guard.assignmentHistory &&
                      guard.assignmentHistory.length > 0 ? (
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
                      ) : (
                        <div className="text-center py-8">
                          <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No assignment history
                          </p>
                        </div>
                      )}
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
                            Profile Created
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Guard profile was created and added to the system
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatDate(guard.createdAt)}
                        </span>
                      </div>

                      {guard.lastActive && (
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border-l-4 border-primary/50 hover:shadow-md transition-all">
                          <div className="flex-shrink-0 rounded-full p-2 bg-primary/20 mt-0.5">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              Last Active
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Guard was last active in the system
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatDate(guard.lastActive)}
                          </span>
                        </div>
                      )}

                      {guard.status === "Inactive" && (
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border-l-4 border-destructive/50 hover:shadow-md transition-all">
                          <div className="flex-shrink-0 rounded-full p-2 bg-destructive/20 mt-0.5">
                            <XCircle className="h-4 w-4 text-destructive" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              Account Deactivated
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Guard account has been deactivated
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground ml-auto">
                            Recently
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Monthly Performance Chart - Responsive */}
                    <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-muted/30 to-background/50 border border-border/30">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-secondary" />
                        Monthly Performance Trend
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            month: "Jan",
                            rating: guard.rating || 0,
                            assignments:
                              guard.performance?.totalAssignments || 0,
                          },
                          {
                            month: "Feb",
                            rating: (guard.rating || 0) - 0.1,
                            assignments: Math.max(
                              0,
                              (guard.performance?.totalAssignments || 0) - 1
                            ),
                          },
                          {
                            month: "Mar",
                            rating: (guard.rating || 0) + 0.2,
                            assignments:
                              (guard.performance?.totalAssignments || 0) + 1,
                          },
                          {
                            month: "Apr",
                            rating: (guard.rating || 0) - 0.1,
                            assignments: Math.max(
                              0,
                              (guard.performance?.totalAssignments || 0) - 1
                            ),
                          },
                          {
                            month: "May",
                            rating: guard.rating || 0,
                            assignments:
                              guard.performance?.totalAssignments || 0,
                          },
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