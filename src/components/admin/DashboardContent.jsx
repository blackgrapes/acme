"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Download,
  Upload,
  Eye,
  BarChart3,
  UserCheck,
  Building,
  Calendar,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock4,
  FileQuestion,
  MessageSquare,
  Send,
} from "lucide-react";

// Main Dashboard Component
export default function SecurityDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    clients: [],
    documents: [],
    guards: [],
    documentRequests: [],
    stats: {
      totalClients: 0,
      activeClients: 0,
      totalDocuments: 0,
      pendingDocuments: 0,
      approvedDocuments: 0,
      totalGuards: 0,
      activeGuards: 0,
      pendingRequests: 0,
      totalRequests: 0,
    },
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      console.log("DashboardContent: fetching data...");
      setLoading(true);

      // Get token for authenticated requests
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      // Fetch clients (only those with Client role)
      const clientsResponse = await fetch("/api/auth/client?limit=1000", {
        headers,
      });
      let clients = [];
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        clients = clientsData.clients || [];
      }

      // Fetch documents - Use the admin endpoint
      const docsResponse = await fetch("/api/admin/documents?limit=10", {
        headers,
      });
      let documents = [];
      if (docsResponse.ok) {
        const docsData = await docsResponse.json();
        documents = docsData.documents || [];
      }

      // Fetch guards
      const guardsResponse = await fetch("/api/auth/guard", { headers });
      let guards = [];
      if (guardsResponse.ok) {
        const guardsData = await guardsResponse.json();
        guards = guardsData.guards || [];
      }

      // CORRECTION: Tumhari API `/api/admin/requests` hai, `/api/admin/document-requests` nahi
      // Fetch document requests from clients
      const requestsResponse = await fetch("/api/admin/requests", {
        headers,
      });
      let documentRequests = [];
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        documentRequests = requestsData.requests || [];
      }

      // Calculate stats
      const totalClients = clients.length;
      const activeClients = clients.filter(
        (c) => c.status === "active" || c.isActive
      ).length;
      const totalDocuments = documents.length;
      const pendingDocuments = documents.filter(
        (d) => d.status === "pending"
      ).length;
      const approvedDocuments = documents.filter(
        (d) => d.status === "approved"
      ).length;
      const totalGuards = guards.length;
      const activeGuards = guards.filter(
        (g) => g.status === "active" || g.isActive
      ).length;

      // CORRECTION: Tumhari API se aaya data
      const totalRequests = documentRequests.length;
      const pendingRequests = documentRequests.filter(
        (r) => r.status === "pending"
      ).length;

      setDashboardData({
        clients,
        documents: documents.slice(0, 5),
        guards,
        // CORRECTION: Only show pending requests (latest 5)
        documentRequests: documentRequests
          .filter(req => req.status === "pending")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5),
        stats: {
          totalClients,
          activeClients,
          totalDocuments,
          pendingDocuments,
          approvedDocuments,
          totalGuards,
          activeGuards,
          pendingRequests,
          totalRequests,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      console.log("DashboardContent: fetch done");
      setLoading(false);
    }
  };

  // Function to update document request status
  const updateRequestStatus = async (requestId, status) => {
    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      // CORRECTION: Tumhari API `/api/admin/requests` hai
      const response = await fetch('/api/admin/requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          requestId, // Tumhari API expects requestId (not id)
          status
        })
      });

      if (response.ok) {
        // Refresh the dashboard data
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Tumhari API ke hisaab se fields
  // Request model: { clientName, clientEmail, documentName, documentType, description, status, createdAt }

  // Status badge colors for requests
  const requestStatusColors = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  };

  // Document type colors
  const documentTypeColors = {
    "Salary Slip": "bg-blue-100 text-blue-700",
    "Appointment Letter": "bg-purple-100 text-purple-700",
    "NDA": "bg-green-100 text-green-700",
    "Contract": "bg-orange-100 text-orange-700",
    "Other": "bg-gray-100 text-gray-700"
  };

  // Stats cards data - Updated with document requests
  const statsCards = [
    {
      title: "Total Clients",
      value: dashboardData.stats.totalClients.toString(),
      changeLabel: "Active clients",
      changeValue: dashboardData.stats.activeClients.toString(),
      trend: "up",
      icon: Building,
      color: "bg-blue-500",
    },
    {
      title: "Document Requests",
      value: dashboardData.stats.pendingRequests.toString(),
      changeLabel: "Pending requests",
      changeValue: `${dashboardData.stats.pendingRequests} pending`,
      trend: dashboardData.stats.pendingRequests > 0 ? "warning" : "up",
      icon: FileQuestion,
      color: "bg-amber-500",
    },
    {
      title: "Total Documents",
      value: dashboardData.stats.totalDocuments.toString(),
      changeLabel: "Approved",
      changeValue: dashboardData.stats.approvedDocuments.toString(),
      trend: "up",
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      title: "Security Guards",
      value: dashboardData.stats.totalGuards.toString(),
      changeLabel: "On duty",
      changeValue: dashboardData.stats.activeGuards.toString(),
      trend: "up",
      icon: Shield,
      color: "bg-green-500",
    },
  ];

  // Loading skeleton (same as before)
  if (loading) {
    return (
      <div className="space-y-7 animate-pulse">
        {/* Stats Grid Skeleton */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-border/70 bg-card/95 shadow-card p-5"
            >
              <div className="space-y-4">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </section>

        {/* Main Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Documents Table Skeleton */}
            <div className="rounded-3xl border border-border/70 bg-card/95 shadow-card p-6">
              <div className="space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-border/70 bg-card/95 shadow-card p-5">
                <div className="space-y-4">
                  <div className="h-6 w-40 bg-gray-200 rounded"></div>
                  <div className="h-40 bg-gray-200 rounded-2xl"></div>
                </div>
              </div>
              <div className="rounded-3xl border border-border/70 bg-card/95 shadow-card p-5">
                <div className="space-y-4">
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
                        <div className="h-2 w-full bg-gray-200 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            {/* Activity Feed Skeleton */}
            <div className="rounded-3xl border border-border/70 bg-card/95 shadow-card p-5">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2 p-3 border rounded-lg">
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-2 w-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="rounded-3xl border border-border/70 bg-card/95 shadow-card p-5">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="grid gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-full bg-gray-200 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* ======== Header with Refresh Button ======== */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your security management system
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchDashboardData}
          disabled={loading}
          className="cursor-pointer"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh Data
        </Button>
      </div>

      {/* ======== Key Metrics Grid ======== */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon =
            stat.trend === "up"
              ? ArrowUpRight
              : stat.trend === "down"
                ? ArrowDownRight
                : AlertCircle;

          return (
            <Card
              key={stat.title}
              className="rounded-3xl border-border/70 bg-card/95 shadow-card"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}/10`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.changeLabel}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${stat.trend === "up"
                      ? "bg-success/15 text-success"
                      : stat.trend === "down"
                        ? "bg-destructive/15 text-destructive"
                        : "bg-warning/15 text-warning"
                      }`}
                  >
                    <TrendIcon className="h-3.5 w-3.5" />
                    {stat.changeValue}
                  </span>
                </div>

              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* ======== Main Content Grid ======== */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Documents Table - LIMIT TO 5 DOCUMENTS */}
          <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" /> Recent Documents
                </CardTitle>
                <CardDescription className="text-sm">
                  Latest 6 documents shared with clients
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Link href="/admin-dashboard/documents">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-lg cursor-pointer"
                  >
                    <Filter className="h-4 w-4" /> View All
                  </Button>
                </Link>
                <Link href="/admin-dashboard/documents">
                  <Button size="sm" className="gap-2 cursor-pointer rounded-lg bg-primary">
                    <Upload className="h-4 w-4" /> Upload New
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.documents.length > 0 ? (

                  dashboardData.documents.slice(0, 6).map((doc, index) => {
                    const clientName =
                      doc.targetClient?.name ||
                      doc.specificClients?.[0]?.name ||
                      (doc.isCompanyDocument
                        ? "All Clients"
                        : "Unknown Client");

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 p-4 transition-colors hover:border-primary/30"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl ${doc.status === "approved"
                              ? "bg-green-100"
                              : doc.status === "pending"
                                ? "bg-amber-100"
                                : "bg-gray-100"
                              }`}
                          >
                            <FileText
                              className={`h-5 w-5 ${doc.status === "approved"
                                ? "text-green-600"
                                : doc.status === "pending"
                                  ? "text-amber-600"
                                  : "text-gray-600"
                                }`}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">
                              {doc.name || "Unnamed Document"}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {doc.isCompanyDocument
                                ? "Company Document • "
                                : "Client Document • "}
                              Shared with: {clientName} •{" "}
                              {new Date(
                                doc.uploadDate || doc.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            className={`rounded-full ${doc.status === "approved"
                              ? "bg-green-100 text-green-600"
                              : doc.status === "pending"
                                ? "bg-amber-100 text-amber-600"
                                : "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {doc.status?.charAt(0).toUpperCase() +
                              doc.status?.slice(1)}
                          </Badge>
                          <div className="flex gap-1">
                            {doc.fileUrl && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 cursor-pointer"
                                onClick={() =>
                                  window.open(doc.fileUrl, "_blank")
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No documents found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Upload your first document to get started
                    </p>
                  </div>
                )}

                {/* Additional message if there are more than 5 documents */}
                {dashboardData.documents.length > 5 && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground">
                      Showing 6 of {dashboardData.documents.length} documents •{" "}
                      <Link
                        href="/admin-dashboard/documents"
                        className="text-primary hover:underline cursor-pointer"
                      >
                        View all documents
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Document Requests & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Document Requests from Clients */}
          <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <FileQuestion className="h-5 w-5 text-amber-500" /> Recent Document Requests
                </CardTitle>
                <CardDescription className="text-sm">
                  Pending requests from clients
                </CardDescription>
              </div>
              <Badge className="bg-amber-500 hover:bg-amber-600">
                {dashboardData.stats.pendingRequests} Pending
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.documentRequests.length > 0 ? (
                dashboardData.documentRequests.map((request, index) => {
                  // Tumhari API ke fields:
                  // _id, clientName, clientEmail, documentName, documentType, description, status, createdAt
                  const timeAgo = new Date(request.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/80 p-3 transition-colors hover:border-primary/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {request.documentName}
                          </p>
                        </div>
                        <Badge className={`text-xs ${requestStatusColors[request.status] || "bg-gray-100 text-gray-700"}`}>
                          {request.status || "pending"}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground leading-snug">
                        {request.description || "No description provided"}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {request.clientName}
                          </p>
                          <p className="text-[0.7rem] text-muted-foreground">
                            {request.clientEmail}
                          </p>
                          <Badge variant="outline" className="mt-1 text-[0.65rem]">
                            {request.documentType || "Other"}
                          </Badge>
                        </div>
                        <p className="text-[0.7rem] text-muted-foreground">
                          {timeAgo}
                        </p>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="h-7 cursor-pointer text-xs bg-green-500 hover:bg-green-600"
                            onClick={() => updateRequestStatus(request._id, 'approved')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs cursor-pointer"
                            onClick={() => updateRequestStatus(request._id, 'rejected')}
                          >
                            <XCircle className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <FileQuestion className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No pending requests</p>
                  <p className="text-sm text-gray-400 mt-1">
                    All document requests have been processed
                  </p>
                </div>
              )}

              {/* CORRECTION: Link to correct page */}
              <Link href="/admin-dashboard/requests">
                <Button variant="outline" className="w-full gap-2 cursor-pointer">
                  <Eye className="h-4 w-4" />
                  View All Document Requests
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link href="/admin-dashboard/documents">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full cursor-pointer"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Document
                </Button>
              </Link>
              <Link href="/admin-dashboard/clients">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full cursor-pointer"
                >
                  <Users className="mr-2 h-4 w-4" /> Manage Clients
                </Button>
              </Link>
              {/* CORRECTION: Link to correct requests page */}
              <Link href="/admin-dashboard/requests">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full cursor-pointer"
                >
                  <FileQuestion className="mr-2 h-4 w-4" /> View Document Requests
                </Button>
              </Link>
              <Link href="/admin-dashboard/company-documents">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full cursor-pointer"
                >
                  <Building className="mr-2 h-4 w-4" /> Company Documents
                </Button>
              </Link>
              <Link href="/admin-dashboard/guards">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full cursor-pointer"
                >
                  <Shield className="mr-2 h-4 w-4" /> Manage Guards
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ======== Operational Highlights ======== */}
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              System Overview
            </CardTitle>
            <CardDescription className="text-sm">
              Document security, client access, and compliance metrics
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer rounded-lg border-border/80"
            onClick={fetchDashboardData}
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Shield,
              label: "Document Security",
              sublabel: "All documents encrypted",
              trend: "100% Secure",
              status: "success",
            },
            {
              icon: Users,
              label: "Client Access",
              sublabel: "Active client logins",
              trend: `${dashboardData.stats.activeClients} Active`,
              status: "info",
            },
            {
              icon: CheckCircle2,
              label: "Document Requests",
              sublabel: "Pending requests",
              trend: `${dashboardData.stats.pendingRequests} Pending`,
              status: dashboardData.stats.pendingRequests > 0 ? "warning" : "success",
            },
            {
              icon: Clock,
              label: "Document Count",
              sublabel: "Total documents in system",
              trend: `${dashboardData.stats.totalDocuments} Docs`,
              status: "info",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 transition-colors hover:border-primary/30"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.status === "success"
                    ? "bg-success/10 text-success"
                    : item.status === "warning"
                      ? "bg-warning/10 text-warning"
                      : "bg-primary/10 text-primary"
                    }`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.sublabel}
                  </p>
                  <p className={`mt-1 text-xs font-semibold ${item.status === "success"
                    ? "text-success"
                    : item.status === "warning"
                      ? "text-warning"
                      : "text-primary"
                    }`}>
                    {item.trend}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}