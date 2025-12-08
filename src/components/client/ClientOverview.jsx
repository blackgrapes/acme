// File: src/components/client/ClientOverview.jsx - FIXED VERSION
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
  FileText,
  Folder,
  Users,
  Clock,
  AlertCircle,
  TrendingUp,
  Download,
  Eye,
  BarChart3,
  UserCheck,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  FileQuestion,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Upload,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import DocumentRequestModal from "./DocumentRequestModal";

export default function ClientOverview() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    documents: [],
    clientInfo: null,
    stats: {
      totalDocuments: 0,
      viewedDocuments: 0,
      recentDocuments: 0,
      pendingRequests: 0,
      totalRequests: 0,
    },
  });

  const { user } = useAuth();

  const fetchDashboardData = async () => {
    try {
      if (!refreshing) setLoading(true);

      // Get auth token
      const getToken = () => {
        if (typeof window === "undefined") return null;
        return (
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken")
        );
      };

      const token = getToken();

      if (!token) {
        console.warn("No auth token found");
        return;
      }

      // Fetch client's documents
      const documentsResponse = await fetch("/api/client/my-documents", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      let documents = [];
      let clientInfo = null;

      if (documentsResponse.ok) {
        const data = await documentsResponse.json();
        if (data.success) {
          documents = data.documents || [];
          clientInfo = data.clientInfo;
        }
      }

      // ✅ FIXED: Calculate ALL stats dynamically
      const totalDocuments = documents.length;
      const viewedDocuments = documents.filter((doc) => doc.viewed).length;

      // Get documents from last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recentDocuments = documents.filter((doc) => {
        const uploadDate = doc.uploaded || doc.uploadDate;
        if (!uploadDate) return false;
        return new Date(uploadDate) > oneWeekAgo;
      }).length;

      // ✅ NEW: Calculate today's uploaded documents
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayDocuments = documents.filter((doc) => {
        const uploadDate = doc.uploaded || doc.uploadDate;
        if (!uploadDate) return false;
        const docDate = new Date(uploadDate);
        docDate.setHours(0, 0, 0, 0);
        return docDate.getTime() === today.getTime();
      }).length;

      // ✅ NEW: Calculate company documents count
      const companyDocuments = documents.filter(
        (doc) => doc.isCompanyDocument === true
      ).length;

      // ✅ NEW: Calculate client personal documents count
      const clientDocuments = documents.filter(
        (doc) => doc.isCompanyDocument === false
      ).length;

      setDashboardData({
        documents: documents.slice(0, 5), // Show only 5 recent docs
        clientInfo,
        stats: {
          totalDocuments,
          viewedDocuments,
          recentDocuments,
          todayDocuments, 
          companyDocuments, 
          clientDocuments, 
          documentAccessPercentage:
            totalDocuments > 0
              ? Math.round((viewedDocuments / totalDocuments) * 100)
              : 0,
          pendingRequests: 0,
          totalRequests: 0, 
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ FIXED: Initial data fetch on component mount
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // ✅ FIXED: Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const statsCards = useMemo(
    () => [
      {
        title: "Total Documents",
        value: dashboardData.stats.totalDocuments.toString(),
        changeLabel: "In your portal",
        changeValue: `${dashboardData.stats.clientDocuments} personal, ${dashboardData.stats.companyDocuments} company`,
        trend: "neutral",
        icon: FileText,
        color: "bg-blue-500",
      },
      {
        title: "Today's Uploads",
        value: dashboardData?.stats?.todayDocuments?.toString(),
        changeLabel: "Uploaded today",
        changeValue:
          dashboardData?.stats?.todayDocuments > 0
            ? `${dashboardData?.stats?.todayDocuments} new today`
            : "No new uploads",
        trend: dashboardData?.stats?.todayDocuments > 0 ? "up" : "neutral",
        icon: Calendar,
        color: "bg-green-500",
      },
      {
        title: "Company Documents",
        value: dashboardData?.stats?.companyDocuments?.toString(),
        changeLabel: "Shared by company",
        changeValue: `${dashboardData.stats.companyDocuments} available`,
        trend: "neutral",
        icon: Building,
        color: "bg-purple-500",
      },
      {
        title: "Service Status",
        value: "Active",
        changeLabel: "Last updated",
        changeValue: "Today",
        trend: "up",
        icon: Shield,
        color: "bg-amber-500",
      },
    ],
    [dashboardData.stats]
  );
  // Document status colors
  const documentTypeColors = {
    agreement: "bg-blue-100 text-blue-700",
    attendance: "bg-green-100 text-green-700",
    bills: "bg-purple-100 text-purple-700",
    "salary-sheet": "bg-amber-100 text-amber-700",
    "pay-slip": "bg-green-100 text-green-700",
    esi: "bg-red-100 text-red-700",
    pf: "bg-indigo-100 text-indigo-700",
    "employee-details": "bg-pink-100 text-pink-700",
    training: "bg-cyan-100 text-cyan-700",
    "night-checking": "bg-gray-100 text-gray-700",
    "paid-gst": "bg-emerald-100 text-emerald-700",
    msme: "bg-orange-100 text-orange-700",
    gst: "bg-teal-100 text-teal-700",
    pasara: "bg-rose-100 text-rose-700",
    pan: "bg-yellow-100 text-yellow-700",
    profile: "bg-sky-100 text-sky-700",
    "bank-details": "bg-violet-100 text-violet-700",
  };

  // ✅ FIXED: Format document type name
  const formatDocumentType = (type) => {
    if (!type) return "Unknown";
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Loading skeleton
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
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
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
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {user?.name || "Client"}
          </h1>
          <p className="text-muted-foreground">
            Overview of your documents and services
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="cursor-pointer rounded-lg"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
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
              : stat.trend === "warning"
              ? AlertCircle
              : TrendingUp;

          return (
            <Card
              key={stat.title}
              className="rounded-3xl border-border/70 bg-card/95 "
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
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                      stat.trend === "up"
                        ? "bg-green-100 text-green-700"
                        : stat.trend === "down"
                        ? "bg-red-100 text-red-700"
                        : stat.trend === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
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
          {/* Recent Documents Table */}
          <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" /> Recent Documents
                </CardTitle>
                <CardDescription className="text-sm">
                  Top 6 recently uploaded documents
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Link href="/client-dashboard/documents">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-lg cursor-pointer"
                  >
                    <Filter className="h-4 w-4" /> View All
                  </Button>
                </Link>
                <Button 
  size="sm" 
  className="gap-2 cursor-pointer rounded-lg bg-primary"
  onClick={() => setRequestModalOpen(true)}
>
  <Upload className="h-4 w-4" /> Request New
</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.documents.length > 0 ? (
                  dashboardData.documents.slice(0, 6).map((doc, index) => {
                    // ✅ Changed to 6 documents
                    const documentType = doc.type || "other";
                    const uploadedDate = doc.uploaded || doc.uploadDate;

                    // ✅ Better time formatting
                    const formatTimeAgo = (dateString) => {
                      if (!dateString) return "Recently";
                      const now = new Date();
                      const docDate = new Date(dateString);
                      const diffMs = now - docDate;
                      const diffMins = Math.floor(diffMs / (1000 * 60));
                      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                      const diffDays = Math.floor(
                        diffMs / (1000 * 60 * 60 * 24)
                      );

                      if (diffMins < 60) {
                        return `${diffMins}m ago`;
                      } else if (diffHours < 24) {
                        return `${diffHours}h ago`;
                      } else if (diffDays < 7) {
                        return `${diffDays}d ago`;
                      } else {
                        return docDate.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        });
                      }
                    };

                    const timeAgo = formatTimeAgo(uploadedDate);

                    // ✅ Check if document was uploaded today
                    const isToday = () => {
                      if (!uploadedDate) return false;
                      const today = new Date();
                      const docDate = new Date(uploadedDate);
                      return today.toDateString() === docDate.toDateString();
                    };

                    const isNewToday = isToday();

                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 p-4 transition-all hover:border-primary/30 hover:bg-accent/50 hover:shadow-md ${
                          isNewToday ? "border-green-200 bg-green-50/30" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl relative ${
                              documentTypeColors[documentType] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {isNewToday && (
                              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="max-w-[250px]">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground truncate">
                                {doc.name || "Unnamed Document"}
                              </h4>
                              {isNewToday && (
                                <Badge className="rounded-full bg-green-100 text-green-700 text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                              <span
                                className={`inline-flex items-center gap-1 ${
                                  doc.isCompanyDocument
                                    ? "text-blue-600"
                                    : "text-purple-600"
                                }`}
                              >
                                {doc.isCompanyDocument ? (
                                  <>
                                    <Building className="h-3 w-3" />
                                    Company
                                  </>
                                ) : (
                                  <>
                                    <User className="h-3 w-3" />
                                    Personal
                                  </>
                                )}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {timeAgo}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            className={`rounded-full ${
                              documentTypeColors[documentType] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {formatDocumentType(documentType)}
                          </Badge>
                          <div className="flex gap-1">
                            {doc.fileUrl && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 cursor-pointer hover:bg-blue-100"
                                onClick={() =>
                                  window.open(doc.fileUrl, "_blank")
                                }
                                title="View Document"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {doc.fileUrl && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 cursor-pointer hover:bg-green-100"
                                onClick={() => {
                                  const link = document.createElement("a");
                                  link.href = doc.fileUrl;
                                  link.download = doc.name || "document";
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                                title="Download Document"
                              >
                                <Download className="h-4 w-4" />
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
                      Documents will appear here when shared by admin
                    </p>
                    <Link href="/client-dashboard/documents">
                      <Button variant="outline" className="mt-4">
                        <Folder className="h-4 w-4 mr-2" />
                        Browse Documents
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* ✅ Show count of displayed documents */}
              {dashboardData.documents.length > 0 && (
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>
                      Showing {Math.min(dashboardData.documents.length, 6)} of{" "}
                      {dashboardData.stats.totalDocuments} documents
                    </span>
                  </div>
                  {dashboardData.documents.length > 6 && (
                    <Link href="/client-dashboard/documents">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary"
                      >
                        View more
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-sm">
                Common actions for your portal
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link href="/client-dashboard/documents">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full cursor-pointer rounded-lg"
                >
                  <Folder className="mr-2 h-4 w-4" /> View All Documents
                </Button>
              </Link>
              <Link href="/client-dashboard/company-documents">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full cursor-pointer rounded-lg"
                >
                  <Building className="mr-2 h-4 w-4" /> Company Documents
                </Button>
              </Link>
              <Link href="/client-dashboard/management">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full cursor-pointer rounded-lg"
                >
                  <Shield className="mr-2 h-4 w-4" /> Service Overview
                </Button>
              </Link>
              <Link href="mailto:protection.acme@gmail.com">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full cursor-pointer rounded-lg"
                >
                  <Mail className="mr-2 h-4 w-4" /> Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Your Information
                </CardTitle>
                <CardDescription className="text-sm">
                  Account details and status
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-700 rounded-full">
                Verified
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 p-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UserCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || "Client User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "client@example.com"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                  <p className="text-xs text-muted-foreground">Account Type</p>
                  <p className="text-sm font-semibold text-foreground">
                    Client
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="text-sm font-semibold text-foreground">
                    {user?.joinDate
                      ? new Date(user.joinDate).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })
                      : "Jan 2025"}
                  </p>
                </div>
              </div>

              {user?.companyName && (
                <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Company</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {user.companyName}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ======== System Overview ======== */}
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Portal Overview
            </CardTitle>
            <CardDescription className="text-sm">
              Document security, access metrics, and compliance
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer rounded-lg border-border/80"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
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
              icon: FileText,
              label: "Available Documents",
              sublabel: "Total in your portal",
              trend: `${dashboardData.stats.totalDocuments} Docs`,
              status: "info",
            },
            {
              icon: CheckCircle,
              label: "Service Status",
              sublabel: "Active services",
              trend: "All Active",
              status: "success",
            },
            {
              icon: Clock,
              label: "Response Time",
              sublabel: "Average support response",
              trend: "Under 2 hours",
              status: "info",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 transition-colors hover:border-primary/30 hover:bg-accent/50"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    item.status === "success"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
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
                  <p
                    className={`mt-1 text-xs font-semibold ${
                      item.status === "success"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {item.trend}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <DocumentRequestModal
  open={requestModalOpen}
  onOpenChange={setRequestModalOpen}
  clientId={user?._id}
  clientName={user?.name}
  clientEmail={user?.email}
  clientCompany={user?.companyName}
/>
    </div>
  );
}
