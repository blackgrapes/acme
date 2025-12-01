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
  RefreshCw,
  FileText,
  Users,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Download,
  UserPlus,
  Building,
  Mail,
  Inbox,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useMemo } from "react";

export default function DashboardContent() {
  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [guards, setGuards] = useState([]);
  const [emailData, setEmailData] = useState({ usage: 0, requests: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Fetch all real data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch clients
      const clientsResponse = await fetch("/api/auth/client");
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        const clientUsers = clientsData.clients?.filter(
          (user) => user.role && (user.role.name === "Client" || user.role === "Client")
        ) || [];
        setClients(clientUsers);
      }

      // Fetch documents
      const docsResponse = await fetch("/api/documents");
      if (docsResponse.ok) {
        const docsData = await docsResponse.json();
        setDocuments(docsData.documents || []);
      }

      // Fetch guards
      const guardsResponse = await fetch("/api/guards");
      if (guardsResponse.ok) {
        const guardsData = await guardsResponse.json();
        setGuards(guardsData.guards || []);
      }

      // Fetch email data
      const emailResponse = await fetch("/api/email-usage");
      if (emailResponse.ok) {
        const emailData = await emailResponse.json();
        setEmailData(emailData);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Handle export report
  const handleExportReport = async () => {
    try {
      setExporting(true);
      
      // Create report data
      const reportData = {
        timestamp: new Date().toISOString(),
        clients: clients.length,
        activeClients: clients.filter(client => client.status === "Active").length,
        guards: guards.length,
        activeGuards: guards.filter(guard => guard.status === "Active").length,
        documents: documents.length,
        emailUsage: emailData.usage,
        emailRequests: emailData.requests,
        clientList: clients.map(client => ({
          name: client.name || client.email,
          email: client.email,
          status: client.status,
          lastActive: client.lastActive
        }))
      };

      // Convert to CSV
      const csvContent = convertToCSV(reportData);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `acme-dashboard-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error exporting report:", error);
    } finally {
      setExporting(false);
    }
  };

  // Convert data to CSV
  const convertToCSV = (data) => {
    const headers = ['Metric', 'Value', 'Details'];
    const rows = [
      ['Report Generated', new Date().toLocaleString(), 'ACME Security Dashboard'],
      ['', '', ''],
      ['Total Clients', data.clients, 'All registered clients'],
      ['Active Clients', data.activeClients, 'Currently active clients'],
      ['Security Guards', data.guards, 'Total security personnel'],
      ['Active Guards', data.activeGuards, 'Currently active guards'],
      ['Total Documents', data.documents, 'Documents in system'],
      ['Email Usage', data.emailUsage, 'Emails sent today'],
      ['Email Requests', data.emailRequests, 'Pending email requests'],
      ['', '', ''],
      ['Client Details', '', '']
    ];

    // Add client details
    data.clientList.forEach(client => {
      rows.push([client.name, client.email, client.status]);
    });

    return rows.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  };

  // Memoized calculations for better performance
  const dashboardStats = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(client => client.status === "Active").length;
    const pendingClients = clients.filter(client => client.status === "Pending").length;
    const totalDocuments = documents.length;
    const totalGuards = guards.length;
    const activeGuards = guards.filter(guard => guard.status === "Active").length;

    return {
      totalClients,
      activeClients,
      pendingClients,
      totalDocuments,
      totalGuards,
      activeGuards,
      emailUsage: emailData.usage || 0,
      emailRequests: emailData.requests || 0
    };
  }, [clients, documents, guards, emailData]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-muted rounded w-24"></div>
            <div className="h-9 bg-muted rounded w-32"></div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse border-border">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="w-8 h-8 bg-muted rounded-lg"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-muted rounded w-16 mb-2"></div>
                <div className="h-2 bg-muted rounded w-full mb-1"></div>
                <div className="h-2 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <Card key={i} className="animate-pulse border-border">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="h-5 bg-muted rounded w-32 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-48"></div>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5].map(j => (
                  <div key={j} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="w-16 h-6 bg-muted rounded-full"></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <Card className="animate-pulse border-border">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-32 mb-1"></div>
            <div className="h-3 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Admin Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time overview of ACME Security Management System
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:bg-accent"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleExportReport}
            disabled={exporting}
          >
            <Download className={`h-4 w-4 mr-2 ${exporting ? 'animate-spin' : ''}`} />
            {exporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clients Card */}
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Clients
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {dashboardStats.totalClients}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Active</span>
                  <span className="font-medium text-foreground">{dashboardStats.activeClients}</span>
                </div>
                <Progress 
                  value={(dashboardStats.activeClients / dashboardStats.totalClients) * 100} 
                  className="h-1 bg-primary/20" 
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-medium text-foreground">{dashboardStats.pendingClients}</span>
                </div>
                <Progress 
                  value={(dashboardStats.pendingClients / dashboardStats.totalClients) * 100} 
                  className="h-1 bg-amber-200" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Guards Card */}
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Security Guards
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {dashboardStats.totalGuards}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardStats.activeGuards} currently active
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Active Rate</span>
                <span>{Math.round((dashboardStats.activeGuards / dashboardStats.totalGuards) * 100)}%</span>
              </div>
              <Progress 
                value={(dashboardStats.activeGuards / dashboardStats.totalGuards) * 100} 
                className="h-1 mt-1 bg-primary/20" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Usage Card */}
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Email Usage
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {dashboardStats.emailUsage}
            </div>
            <p className="text-xs text-muted-foreground">Emails sent today</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Daily Limit</span>
                <span>{dashboardStats.emailUsage} / 500</span>
              </div>
              <Progress 
                value={(dashboardStats.emailUsage / 500) * 100} 
                className="h-1 mt-1 bg-primary/20" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Requests Card */}
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Email Requests
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Inbox className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {dashboardStats.emailRequests}
            </div>
            <p className="text-xs text-muted-foreground">Pending requests</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
              <p className="text-xs text-amber-600 font-medium">Requires attention</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Email Activities */}
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Recent Email Activities
              </CardTitle>
              <CardDescription>
                Latest email sending activities and status
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
            {[
              { type: 'success', message: 'Welcome email sent to new client', time: '5 min ago' },
              { type: 'success', message: 'Password reset email delivered', time: '15 min ago' },
              { type: 'warning', message: 'Email limit at 80% - 400/500 used', time: '1 hour ago' },
              { type: 'success', message: 'Monthly report sent to all clients', time: '2 hours ago' },
              { type: 'info', message: 'System notification email queued', time: '3 hours ago' },
            ].map((activity, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-4 ${
                  index < 4 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'success' ? 'bg-green-100 text-green-600' :
                    activity.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> :
                     activity.type === 'warning' ? <AlertCircle className="h-5 w-5" /> :
                     <Clock className="h-5 w-5" />}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge
                    variant={
                      activity.type === 'success' ? 'default' :
                      activity.type === 'warning' ? 'secondary' : 'outline'
                    }
                    className={`text-xs ${
                      activity.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' :
                      activity.type === 'warning' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      'bg-blue-100 text-blue-800 border-blue-200'
                    }`}
                  >
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full text-sm text-primary hover:bg-primary/5"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                View all email activities
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-foreground flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                System Alerts
              </CardTitle>
              <CardDescription>
                Important system notifications and alerts
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
            {[
              { severity: 'medium', title: 'Email Usage High', description: '80% of daily email limit used', time: '1 hour ago' },
              { severity: 'low', title: 'Backup Completed', description: 'System backup completed successfully', time: '2 hours ago' },
              { severity: 'high', title: 'Security Alert', description: 'Multiple failed login attempts detected', time: '3 hours ago' },
              { severity: 'low', title: 'System Update', description: 'New security patches available', time: '5 hours ago' },
              { severity: 'medium', title: 'Storage Warning', description: 'Document storage at 75% capacity', time: '1 day ago' },
            ].map((alert, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 p-4 ${
                  index < 4 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                    alert.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <AlertCircle className="h-4 w-4" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {alert.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.time}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge
                    variant={
                      alert.severity === 'high' ? 'destructive' :
                      alert.severity === 'medium' ? 'secondary' : 'default'
                    }
                    className={`text-xs ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                      alert.severity === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      'bg-green-100 text-green-800 border-green-200'
                    }`}
                  >
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full text-sm text-primary hover:bg-primary/5"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                View all alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Frequently used administrative actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="flex flex-col h-auto p-4 cursor-pointer gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20">
              <UserPlus className="h-6 w-6 text-primary" />
              <span className="font-medium">Add Guard</span>
              <span className="text-xs text-muted-foreground">Register new security personnel</span>
            </Button>
            
            <Button className="flex flex-col h-auto p-4 cursor-pointer gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20">
              <Users className="h-6 w-6 text-primary" />
              <span className="font-medium">Add Client</span>
              <span className="text-xs text-muted-foreground">Create new client account</span>
            </Button>
            
            <Button className="flex flex-col h-auto p-4 cursor-pointer gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-medium">Upload Docs</span>
              <span className="text-xs text-muted-foreground">Add new documents</span>
            </Button>
            
            <Button className="flex flex-col h-auto p-4 cursor-pointer gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20">
              <Mail className="h-6 w-6 text-primary" />
              <span className="font-medium">Email Management</span>
              <span className="text-xs text-muted-foreground">Manage email settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}