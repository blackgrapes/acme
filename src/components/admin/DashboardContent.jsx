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
import {
  Shield,
  Clock,
  FileText,
  Users,
  AlertCircle,
  TrendingUp,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Settings,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function DashboardContent({ dummyDocuments }) {

  const [clients, setClients] = useState([]);

 const fetchClients = async () => {
   try {
     console.log("🔄 Fetching clients...");
     const response = await fetch("/api/auth/client");
     const data = await response.json();

     if (response.ok) {
       console.log("✅ Clients fetched:", data.clients);
       // Only show users with role "Client"
       const clientUsers = data.clients.filter(
         (user) =>
           user.role && (user.role.name === "Client" || user.role === "Client")
       );
       setClients(clientUsers);
     } else {
       console.error("❌ Failed to fetch clients:", data.error);
       setClients([]);
     }
   } catch (error) {
     console.error("💥 Error fetching clients:", error);
     setClients([]);
   } finally {
     setLoading(false);
   }
  };
  
  const totalClients = clients.length;
  const activeClients = clients.filter(
    (client) => client.status === "Active"
  ).length;
  const pendingClients = clients.filter(
    (client) => client.status === "Pending"
  ).length;
  const totalDocuments = dummyDocuments.length;

  // System health metrics (mock data)
  const systemHealth = {
    uptime: "99.9%",
    storage: 65,
    performance: 92,
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Admin Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your system performance and activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 hover:bg-primary/5"
            permission="dashboard-read"
          >
            <Clock className="h-4 w-4 mr-2 text-primary" />
            Last 7 days
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            permission="dashboard-read"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Active Clients
            </CardTitle>
            <div className="relative">
              <Shield className="h-4 w-4 text-primary" />
              {pendingClients > 0 && (
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
                {activeClients}
              </div>
              <span className="text-xs text-muted-foreground">
                / {totalClients} total
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <p className="text-xs text-primary font-medium">+2 this week</p>
            </div>
            {pendingClients > 0 && (
              <p className="text-xs text-primary mt-2 font-medium">
                {pendingClients} pending approval
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {pendingClients}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
            {pendingClients > 0 && (
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-primary mt-2 font-medium"
                permission="clients-update"
              >
                Review now →
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
            <p className="text-xs text-muted-foreground">In system</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Storage</span>
                <span>{systemHealth.storage}%</span>
              </div>
              <Progress
                value={systemHealth.storage}
                className="h-1 mt-1 bg-primary/20"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              System Health
            </CardTitle>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {systemHealth.uptime}
            </div>
            <p className="text-xs text-muted-foreground">Uptime</p>
            <div className="flex gap-4 mt-2">
              <div>
                <div className="text-xs text-muted-foreground">Performance</div>
                <div className="text-sm font-semibold text-foreground">
                  {systemHealth.performance}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Clients */}
        <Card className="shadow-md border-0 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-foreground">Recent Clients</CardTitle>
              <CardDescription>
                Latest client registrations and updates
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
            {clients.slice(0, 4).map((client, index) => (
              <div
                key={client.id}
                className={`flex items-center space-x-3 p-4 ${
                  index < clients.slice(0, 4).length - 1
                    ? "border-b border-primary/10"
                    : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {client.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {client.org}
                  </p>
                </div>
                <div className="ml-auto flex flex-col items-end gap-1">
                  <Badge
                    variant={
                      client.status === "Active"
                        ? "default"
                        : client.status === "Pending"
                        ? "secondary"
                        : "outline"
                    }
                    className={`text-xs ${
                      client.status === "Active"
                        ? "bg-primary text-primary-foreground"
                        : client.status === "Pending"
                        ? "bg-primary/20 text-primary"
                        : ""
                    }`}
                  >
                    {client.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {client.lastActive || "2h ago"}
                  </span>
                </div>
              </div>
            ))}
            <div className="p-4 border-t border-primary/10">
              <Button
                variant="ghost"
                className="w-full text-sm text-primary hover:bg-primary/5"
                size="sm"
                permission="clients-read"
              >
                <Eye className="h-4 w-4 mr-2" />
                View all clients
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
              <CardDescription>
                Latest document uploads and updates
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
            {dummyDocuments.slice(0, 4).map((doc, index) => (
              <div
                key={doc.id}
                className={`flex items-center space-x-3 p-4 ${
                  index < dummyDocuments.slice(0, 4).length - 1
                    ? "border-b border-primary/10"
                    : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      doc.access === "Public"
                        ? "bg-primary/20 text-primary"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <FileText className="h-5 w-5" />
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
                  <Badge
                    variant={doc.access === "Public" ? "default" : "secondary"}
                    className={`text-xs ${
                      doc.access === "Public"
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    {doc.access}
                  </Badge>
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
                permission="documents-read"
              >
                <Eye className="h-4 w-4 mr-2" />
                View all documents
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="shadow-md border-0 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-foreground">System Alerts</CardTitle>
              <CardDescription>
                Important notifications and system status
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="px-2 py-1 text-primary border-primary/20"
            >
              {pendingClients > 0 ? "Attention" : "All Good"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 p-0">
            {pendingClients > 0 && (
              <div className="flex items-start p-4 bg-primary/5 border-l-4 border-primary rounded-r-md">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {pendingClients} client{pendingClients > 1 ? "s" : ""}{" "}
                    pending approval
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Review and approve new client registrations
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs text-primary mt-2 font-medium"
                    permission="clients-update"
                  >
                    Take action →
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-start p-4 bg-primary/5 border-l-4 border-primary rounded-r-md">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  System running smoothly
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  All services operational, no critical issues detected
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-primary/5 border-l-4 border-primary rounded-r-md">
              <Settings className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  Security scan completed
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Latest security audit passed all checks
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-primary/10">
              <Button
                variant="ghost"
                className="w-full text-sm text-primary hover:bg-primary/5"
                size="sm"
                permission="dashboard-read"
              >
                <Settings className="h-4 w-4 mr-2" />
                View all alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      {/* <Card className="shadow-md border-0 bg-gradient-primary">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
          <CardDescription>
            Frequently used administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 gap-2 border-primary/20 hover:bg-primary/5"
            >
              <Users className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Manage Clients</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 gap-2 border-primary/20 hover:bg-primary/5"
            >
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Documents</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 gap-2 border-primary/20 hover:bg-primary/5"
            >
              <Settings className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Settings</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-auto py-4 gap-2 border-primary/20 hover:bg-primary/5"
            >
              <Download className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
