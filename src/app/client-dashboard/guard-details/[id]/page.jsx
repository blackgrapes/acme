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
  Shield as ShieldIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      setGuard({
        _id: "default-guard-id",
        name: "John Doe",
        email: "john@security.com",
        phone: "+91 9876543210",
        address: "Mumbai, India",
        status: "Active",
        joined: "15 Jan 2024",
        rating: 4.7,
        performance: {
          totalAssignments: 25,
          successRate: 95,
          clientSatisfaction: 92,
        },
        currentAssignment: {
          clientName: "Default Client",
          startDate: "2025-10-01",
          endDate: "2025-12-31",
        },
        assignmentHistory: [
          {
            clientName: "Client A",
            startDate: "2025-09-01",
            endDate: "2025-09-30",
            status: "Completed",
            rating: 4.8,
          },
          {
            clientName: "Client B",
            startDate: "2025-08-01",
            endDate: "2025-08-31",
            status: "Completed",
            rating: 4.5,
          },
        ],
        createdAt: new Date().toISOString(),
        lastActive: new Date(Date.now() - 86400000).toISOString(),
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading guard details...</p>
        </div>
      </div>
    );
  }

  if (!guard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
      case "Inactive":
        return (
          <Badge
            variant="secondary"
            className="rounded-full bg-destructive text-destructive-foreground"
          >
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Profile Header with Avatar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" alt={guard.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-background text-xl">
              {guard.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{guard.name}</h1>
            <p className="text-muted-foreground">Guard ID: {guardId}</p>
          </div>
        </div>
        {getStatusBadge(guard.status)}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Enhanced Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-6 w-6" />
                Guard Profile Overview
              </CardTitle>
              <CardDescription>
                Comprehensive profile and key metrics for {guard.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="h-12 w-12 text-background" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">{guard.name}</h2>
                    {getStatusBadge(guard.status)}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{guard.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{guard.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{guard.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <Card className="rounded-2xl border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Star className="h-6 w-6 text-primary mr-2" />
                      <div className="text-3xl font-bold text-primary">
                        {guard.rating}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Overall Rating
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      <span className="text-sm">/ 5</span>
                    </div>
                    <Progress value={guard.rating * 20} className="mt-2 h-1" />
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-success/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <ShieldIcon className="h-6 w-6 text-success mr-2" />
                      <div className="text-3xl font-bold text-success">
                        {guard.performance?.totalAssignments || 0}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Assignments
                    </p>
                    <Progress value={80} className="mt-2 h-1" />
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-secondary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <TrendingUp className="h-6 w-6 text-secondary mr-2" />
                      <div className="text-3xl font-bold text-secondary">
                        {guard.performance?.successRate || 0}%
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Success Rate
                    </p>
                    <Progress
                      value={guard.performance?.successRate || 0}
                      className="mt-2 h-1"
                    />
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-destructive/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Clock className="h-6 w-6 text-destructive mr-2" />
                      <div className="text-3xl font-bold text-destructive">
                        {guard.joined ? "1+ year" : "New"}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                  </CardContent>
                </Card>
              </div>

              {guard.currentAssignment && (
                <Card className="rounded-2xl border-border/50 hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Current Assignment
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Client</p>
                        <p className="font-medium text-foreground">
                          {guard.currentAssignment.clientName}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Duration
                        </p>
                        <p className="font-medium text-foreground">
                          {formatDate(guard.currentAssignment.startDate)} -{" "}
                          {formatDate(guard.currentAssignment.endDate)}
                        </p>
                      </div>
                    </div>
                    <Progress value={75} className="mt-4 h-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      75% Complete
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="rounded-2xl border-border/50 hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity Timeline
                  </h3>
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
                            Last Active Session
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
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6" />
                Performance Analytics
              </CardTitle>
              <CardDescription>
                Detailed performance tracking and trends for {guard.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="rounded-2xl border-success/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <ShieldIcon className="h-4 w-4" />
                          Assignment Success
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
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Star className="h-4 w-4" />
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
              </div>

              <Card className="rounded-2xl border-border/50 hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-secondary" />
                    Monthly Performance Trend
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        month: "Jan",
                        rating: guard.rating || 0,
                        assignments: guard.performance?.totalAssignments || 0,
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
                        assignments: guard.performance?.totalAssignments || 0,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all"
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
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Complete Activity History
              </CardTitle>
              <CardDescription>
                Timeline of key events and assignments for {guard.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:shadow-md transition-all">
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
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:shadow-md transition-all">
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
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:shadow-md transition-all">
                    <div className="p-2 bg-warning/10 rounded-full">
                      <Shield className="h-4 w-4 text-warning" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Current Assignment Started</p>
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

              {guard.assignmentHistory &&
                guard.assignmentHistory.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <History className="h-5 w-5" />
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
                        {guard.assignmentHistory.map((assignment, index) => (
                          <TableRow key={index} className="hover:bg-muted/30">
                            <TableCell className="font-medium">
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
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-current text-yellow-500" />
                                <span>{assignment.rating}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
