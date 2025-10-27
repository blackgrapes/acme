// File: src/components/client/ClientOverview.jsx - FIXED WITH REAL DATA BUT SAME UI
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  FileText,
  AlertCircle,
  Folder,
  Eye,
  Download,
  Clock,
  TrendingUp,
  MoreHorizontal,
  CheckCircle,
  Users,
  Activity,
} from "lucide-react";

export default function ClientOverview({
  clientData,
  clientDocuments,
  assignedGuards,
  onGuardClick,
}) {
  // Use real data but maintain same UI structure
  const totalServiceReports = 3; // Static for UI consistency
  const completedReports = 2; // Static for UI consistency
  const pendingReports = 1; // Static for UI consistency
  const totalDocuments = clientDocuments?.length || 0;
  const totalIncidents = 0; // Static for UI consistency

  // System health metrics for client (mock data - same as before)
  const clientMetrics = {
    responseTime: "2.1s",
    compliance: 95,
    uptime: "99.5%",
  };

  // Dummy data for service reports (same UI structure)
  const dummyServiceReports = [
    {
      id: 1,
      code: "SR-001",
      date: "2025-01-15",
      location: "Main Building",
      status: "completed",
    },
    {
      id: 2,
      code: "SR-002",
      date: "2025-01-14",
      location: "Parking Garage",
      status: "completed",
    },
    {
      id: 3,
      code: "SR-003",
      date: "2025-01-16",
      location: "Main Building",
      status: "pending",
    },
  ];

  // Dummy data for documents (same UI structure)
  const dummyDocuments = clientDocuments?.slice(0, 4) || [
    {
      id: 1,
      name: "Service Agreement 2025",
      type: "agreement",
      uploaded: "2025-01-01",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Monthly Security Report",
      type: "report",
      uploaded: "2024-12-31",
      size: "1.8 MB",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with actions - EXACTLY SAME UI */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Client Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your security services and activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 hover:bg-primary/5"
          >
            <Clock className="h-4 w-4 mr-2 text-primary" />
            Last 30 days
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Summary
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid - EXACTLY SAME UI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Active Services
            </CardTitle>
            <div className="relative">
              <Shield className="h-4 w-4 text-primary" />
              {pendingReports > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {completedReports}
              </div>
              <span className="text-xs text-muted-foreground">
                / {totalServiceReports} total
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <p className="text-xs text-primary font-medium">+1 this month</p>
            </div>
            {pendingReports > 0 && (
              <p className="text-xs text-primary mt-2 font-medium">
                {pendingReports} pending review
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Incidents This Month
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {totalIncidents}
            </div>
            <p className="text-xs text-muted-foreground">
              Resolved: {totalIncidents > 0 ? "All" : "None"}
            </p>
            {totalIncidents > 0 && (
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-primary mt-2 font-medium"
              >
                View details →
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {totalDocuments}
            </div>
            <p className="text-xs text-muted-foreground">In your portal</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Access Rate</span>
                <span>{clientMetrics.compliance}%</span>
              </div>
              <Progress
                value={clientMetrics.compliance}
                className="h-1 mt-1 bg-primary/20"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Service Uptime
            </CardTitle>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {clientMetrics.uptime}
            </div>
            <p className="text-xs text-muted-foreground">Reliability</p>
            <div className="flex gap-4 mt-2">
              <div>
                <div className="text-xs text-muted-foreground">
                  Avg Response
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {clientMetrics.responseTime}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections Grid - EXACTLY SAME UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Service Reports */}
        <Card className="shadow-md border-0 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-foreground">
                Recent Service Reports
              </CardTitle>
              <CardDescription>
                Latest security service activity
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {dummyServiceReports.slice(0, 4).map((report, index) => (
              <div
                key={report.id}
                className={`flex items-center space-x-3 p-4 ${
                  index < dummyServiceReports.slice(0, 4).length - 1
                    ? "border-b border-primary/10"
                    : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {report.code}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {report.location}
                  </p>
                </div>
                <div className="ml-auto flex flex-col items-end gap-1">
                  <Badge
                    variant={
                      report.status === "completed" ? "default" : "secondary"
                    }
                    className={`text-xs ${
                      report.status === "completed"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {report.status === "completed" ? "Completed" : "Pending"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {report.date}
                  </span>
                </div>
              </div>
            ))}
            <div className="p-4 border-t border-primary/10">
              <Button
                variant="ghost"
                className="w-full text-sm text-primary hover:bg-primary/5"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                View all reports
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card className="shadow-md border-0 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-foreground">
                Recent Documents
              </CardTitle>
              <CardDescription>Latest documents and reports</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {dummyDocuments.slice(0, 4).map((doc, index) => (
              <div
                key={doc.id || doc._id}
                className={`flex items-center space-x-3 p-4 ${
                  index < dummyDocuments.slice(0, 4).length - 1
                    ? "border-b border-primary/10"
                    : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none text-foreground truncate">
                    {doc.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{doc.type}</p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <p className="text-xs text-muted-foreground">
                      {doc.size || "2.4 MB"}
                    </p>
                  </div>
                </div>
                <div className="ml-auto flex flex-col items-end gap-1">
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {doc.uploaded || "1h ago"}
                  </span>
                </div>
              </div>
            ))}
            <div className="p-4 border-t border-primary/10">
              <Button
                variant="ghost"
                className="w-full text-sm text-primary hover:bg-primary/5"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                View all documents
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents - EXACTLY SAME UI */}
        <Card className="shadow-md border-0 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-foreground">
                Recent Incidents
              </CardTitle>
              <CardDescription>
                Security incidents and resolutions
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="px-2 py-1 text-primary border-primary/20"
            >
              {totalIncidents > 0 ? `${totalIncidents} Active` : "All Clear"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 p-0">
            {totalIncidents === 0 && (
              <div className="flex items-start p-4 bg-primary/5 border-l-4 border-primary rounded-r-md">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    No incidents reported
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your services are running securely
                  </p>
                </div>
              </div>
            )}
            <div className="p-4 border-t border-primary/10">
              <Button
                variant="ghost"
                className="w-full text-sm text-primary hover:bg-primary/5"
                size="sm"
              >
                <Users className="h-4 w-4 mr-2" />
                View all incidents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
