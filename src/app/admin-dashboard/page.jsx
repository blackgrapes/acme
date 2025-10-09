"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Shield,
  Users,
  FileText,
  Settings,
  BarChart3,
  AlertCircle,
  Download,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Clock,
  Mail,
  MapPin,
  Phone,
  Upload,
  Filter,
  Search,
  LogOut,
  User,
  Menu,
} from "lucide-react";

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
  },
];

const dummyDocuments = [
  {
    id: 1,
    name: "Service Agreement Template",
    type: "template",
    uploaded: "2024-12-01",
    size: "2.1 MB",
    uploader: "Admin",
    access: "All",
    actions: true,
  },
  {
    id: 2,
    name: "Company Privacy Policy",
    type: "policy",
    uploaded: "2024-11-15",
    size: "1.5 MB",
    uploader: "Legal Team",
    access: "All",
    actions: true,
  },
  {
    id: 3,
    name: "Insurance Certificate 2025",
    type: "certificate",
    uploaded: "2024-12-20",
    size: "85 KB",
    uploader: "Admin",
    access: "All",
    actions: true,
  },
  {
    id: 4,
    name: "Monthly Operations Report",
    type: "report",
    uploaded: "2025-01-01",
    size: "3.2 MB",
    uploader: "Operations Manager",
    access: "Specific",
    actions: true,
  },
];

const dummyReports = [
  {
    id: 1,
    name: "Monthly Client Activity Report",
    status: "Ready",
    period: "January 2025",
    size: "2.4 MB",
    type: "Client Activity",
    actions: true,
  },
  {
    id: 2,
    name: "Security Incident Summary",
    status: "Ready",
    period: "Q4 2024",
    size: "1.8 MB",
    type: "Incident Report",
    actions: true,
  },
  {
    id: 3,
    name: "Service Performance Analytics",
    status: "Generating",
    period: "December 2024",
    size: "N/A",
    type: "Performance",
    actions: false,
  },
  {
    id: 4,
    name: "Financial Summary Report",
    status: "Ready",
    period: "2024 Annual",
    size: "3.1 MB",
    type: "Financial",
    actions: true,
  },
];

const companyInfo = {
  name: "Elite Security",
  email: "info@elitesecurity.com",
  phone: "(555) 123-4567",
  address: "123 Security Blvd, City, ST 2345",
};

const securitySettings = {
  twoFactor: true,
  sessionTimeout: 60,
  loginAlerts: true,
};

const notificationSettings = {
  newClient: true,
  incidentReports: true,
  maintenance: true,
  adminEmail: "admin@elitesecurity.com",
};

const emailSettings = {
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  username: "noreply@elitesecurity.com",
  useSSL: true,
};

const systemMaintenance = {
  lastBackup: "January 15, 2025 at 3:00 AM",
  nextBackup: "January 16, 2025 at 3:00 AM",
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-64 p-0 bg-card border-r border-border shadow-sm"
                >
                  <nav className="p-4 space-y-1 flex flex-col h-full">
                    <div className="space-y-1 mb-8">
                      <Button
                        variant={
                          activeTab === "dashboard" ? "default" : "ghost"
                        }
                        className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
                        onClick={() => setActiveTab("dashboard")}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                      <Button
                        variant={activeTab === "clients" ? "default" : "ghost"}
                        className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
                        onClick={() => setActiveTab("clients")}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Client Management
                      </Button>
                      <Button
                        variant={
                          activeTab === "documents" ? "default" : "ghost"
                        }
                        className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
                        onClick={() => setActiveTab("documents")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Document Management
                      </Button>
                      <Button
                        variant={activeTab === "reports" ? "default" : "ghost"}
                        className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
                        onClick={() => setActiveTab("reports")}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        System Reports
                      </Button>
                      <Button
                        variant={activeTab === "settings" ? "default" : "ghost"}
                        className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
                        onClick={() => setActiveTab("settings")}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                    {/* User Profile in Mobile Sheet */}
                    <div className="mt-auto pt-4 border-t border-border">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">
                            Sarah Johnson
                          </p>
                          <p className="text-xs text-secondary">
                            Administrator
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full justify-start">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">
                  Admin Panel
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="w-64 border-r border-border bg-card shadow-sm hidden md:block">
          <nav className="p-4 space-y-1 flex flex-col h-full">
            <div className="space-y-1">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm ${
                  activeTab === "dashboard"
                    ? "bg-primary text-white"
                    : "text-primary-foreground"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <Shield className="h-4 w-4 mr-2" />
                Dashboard
              </Button>

              <Button
                variant={activeTab === "clients" ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm ${
                  activeTab === "clients"
                    ? "bg-primary text-white"
                    : "text-primary-foreground"
                }`}
                onClick={() => setActiveTab("clients")}
              >
                <Users className="h-4 w-4 mr-2" />
                Client Management
              </Button>

              <Button
                variant={activeTab === "documents" ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm ${
                  activeTab === "documents"
                    ? "bg-primary text-white"
                    : "text-primary-foreground"
                }`}
                onClick={() => setActiveTab("documents")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Document Management
              </Button>

              <Button
                variant={activeTab === "reports" ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm ${
                  activeTab === "reports"
                    ? "bg-primary text-white"
                    : "text-primary-foreground"
                }`}
                onClick={() => setActiveTab("reports")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                System Reports
              </Button>

              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm ${
                  activeTab === "settings"
                    ? "bg-primary text-white"
                    : "text-primary-foreground"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>

            {/* User Profile - Desktop */}
            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">
                    Sarah Johnson
                  </p>
                  <p className="text-xs text-secondary">Administrator</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
            {/* Mobile Tabs for Navigation - Wrapped in Tabs */}
            {/* <div className="md:hidden mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto p-1 rounded-lg bg-card shadow-sm border">
                  <TabsTrigger
                    value="dashboard"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
                  >
                    <Shield className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="clients"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
                  >
                    <Users className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">Clients</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
                  >
                    <FileText className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">Documents</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="reports"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
                  >
                    <BarChart3 className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">Reports</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
                  >
                    <Settings className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">Settings</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div> */}

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Dashboard */}
              <TabsContent value="dashboard" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Admin Dashboard
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <Card className="shadow-md border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Clients
                        </CardTitle>
                        <Shield className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          2
                        </div>
                        <p className="text-xs text-secondary">
                          Currently active
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Pending Approvals
                        </CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          1
                        </div>
                        <p className="text-xs text-secondary">
                          Awaiting approval
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Documents
                        </CardTitle>
                        <FileText className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          4
                        </div>
                        <p className="text-xs text-secondary">In system</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Services
                        </CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          15
                        </div>
                        <p className="text-xs text-secondary">
                          Currently running
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="shadow-md border-0">
                      <CardHeader>
                        <CardTitle>Recent Clients</CardTitle>
                        <CardDescription>
                          Latest client registrations and updates
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {dummyClients.slice(0, 3).map((client) => (
                          <div
                            key={client.id}
                            className="flex items-center space-x-3 py-3"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-4 w-4 text-primary" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium leading-none text-foreground">
                                {client.name}
                              </p>
                              <p className="text-xs text-secondary truncate">
                                {client.org}
                              </p>
                            </div>
                            <div className="ml-auto text-xs">
                              <Badge
                                variant={
                                  client.status === "Active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {client.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader>
                        <CardTitle>Recent Documents</CardTitle>
                        <CardDescription>
                          Latest document uploads and updates
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {dummyDocuments.slice(0, 3).map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center space-x-3 py-3"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium leading-none text-foreground truncate">
                                {doc.name}
                              </p>
                              <p className="text-xs text-secondary">
                                {doc.type}
                              </p>
                            </div>
                            <div className="ml-auto text-xs">
                              <Badge variant="secondary">{doc.access}</Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader>
                        <CardTitle>System Alerts</CardTitle>
                        <CardDescription>
                          Important notifications and system status
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start p-3 bg-primary/5 rounded-md shadow-sm">
                          <AlertCircle className="h-4 w-4 text-primary mt-0.5 mr-3 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              1 client pending approval
                            </p>
                            <p className="text-xs text-secondary">
                              Review and approve new client registrations
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start p-3 bg-secondary/10 rounded-md shadow-sm">
                          <Shield className="h-4 w-4 text-secondary mt-0.5 mr-3 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              System running smoothly
                            </p>
                            <p className="text-xs text-secondary">
                              All services operational, no issues detected
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Client Management */}
              <TabsContent value="clients" className="mt-0">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Client Management
                    </h2>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="shadow-sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Client
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Client</DialogTitle>
                          <DialogDescription>
                            Enter client details to create an account.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="John Smith" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" placeholder="(555) 123-4567" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="shadow-sm">
                            Create Client
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Card className="shadow-md border-0">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <CardTitle>Filters</CardTitle>
                      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                          <Search className="h-4 w-4 text-primary flex-shrink-0" />
                          <Input
                            placeholder="Search clients..."
                            className="h-8 flex-1"
                          />
                        </div>
                        <Select>
                          <SelectTrigger className="w-[120px] sm:w-[180px]">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <div className="block md:table md:w-full">
                        <div className="md:hidden">
                          {dummyClients.map((client) => (
                            <div
                              key={client.id}
                              className="flex flex-col space-y-2 p-4 border-b border-border last:border-b-0"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-foreground font-medium">
                                    {client.name}
                                  </span>
                                  <Badge
                                    variant={
                                      client.status === "Active"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="ml-2"
                                  >
                                    {client.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-secondary">
                                    Organization:
                                  </span>
                                  <span className="text-foreground font-medium truncate">
                                    {client.org}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-secondary">Email:</span>
                                  <span className="text-foreground font-medium truncate">
                                    {client.email}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-secondary">Phone:</span>
                                  <span className="text-foreground">
                                    {client.phone}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-secondary">
                                    Joined:
                                  </span>
                                  <span className="text-foreground">
                                    {client.joined}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-secondary">
                                    Last Login:
                                  </span>
                                  <span className="text-foreground">
                                    {client.lastLogin}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-secondary">
                                    Account Status:
                                  </span>
                                  <Badge
                                    variant="default"
                                    className="bg-primary text-primary-foreground"
                                  >
                                    Active
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex space-x-1 pt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="shadow-sm flex-1"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="shadow-sm flex-1"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="shadow-sm flex-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Table className="hidden md:table">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[150px]">
                                Client
                              </TableHead>
                              <TableHead className="min-w-[120px]">
                                Organization
                              </TableHead>
                              <TableHead className="min-w-[150px]">
                                Email
                              </TableHead>
                              <TableHead className="min-w-[100px]">
                                Phone
                              </TableHead>
                              <TableHead className="min-w-[100px]">
                                Joined
                              </TableHead>
                              <TableHead className="min-w-[100px]">
                                Last Login
                              </TableHead>
                              <TableHead className="min-w-[100px]">
                                Account Status
                              </TableHead>
                              <TableHead className="min-w-[120px]">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {dummyClients.map((client) => (
                              <TableRow key={client.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="text-foreground block sm:inline">
                                        {client.name}
                                      </span>
                                      <Badge
                                        variant={
                                          client.status === "Active"
                                            ? "default"
                                            : "secondary"
                                        }
                                        className="ml-2 mt-1 block sm:inline"
                                      >
                                        {client.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-foreground truncate">
                                  {client.org}
                                </TableCell>
                                <TableCell className="text-foreground truncate">
                                  {client.email}
                                </TableCell>
                                <TableCell className="text-foreground">
                                  {client.phone}
                                </TableCell>
                                <TableCell className="text-foreground">
                                  {client.joined}
                                </TableCell>
                                <TableCell className="text-foreground">
                                  {client.lastLogin}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="default"
                                    className="bg-primary text-primary-foreground"
                                  >
                                    Active
                                  </Badge>
                                </TableCell>
                                <TableCell className="space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shadow-sm"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shadow-sm"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shadow-sm"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Document Management */}
              <TabsContent value="documents" className="mt-0">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Document Management
                    </h2>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="shadow-sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Upload Document</DialogTitle>
                          <DialogDescription>
                            Select file and category.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <Input type="file" />
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Document Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="template">Template</SelectItem>
                              <SelectItem value="policy">Policy</SelectItem>
                              <SelectItem value="certificate">
                                Certificate
                              </SelectItem>
                              <SelectItem value="report">Report</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="shadow-sm">
                            Upload
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Card className="shadow-md border-0">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <CardTitle>Filters</CardTitle>
                      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                          <Search className="h-4 w-4 text-primary flex-shrink-0" />
                          <Input
                            placeholder="Search documents..."
                            className="h-8 flex-1"
                          />
                        </div>
                        <Select>
                          <SelectTrigger className="w-[120px] sm:w-[180px]">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="template">Template</SelectItem>
                            <SelectItem value="policy">Policy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <div className="block md:table md:w-full">
                        <div className="md:hidden">
                          {dummyDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex flex-col space-y-2 p-4 border-b border-border last:border-b-0"
                            >
                              <div className="flex items-center space-x-3">
                                <FileText className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <span className="text-foreground font-medium">
                                    {doc.name}
                                  </span>
                                  <Badge variant="secondary" className="ml-2">
                                    {doc.type}
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-secondary">Type:</span>
                                  <span className="text-foreground font-medium">
                                    {doc.type}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-secondary">
                                    Uploaded:
                                  </span>
                                  <span className="text-foreground">
                                    {doc.uploaded}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-secondary">Size:</span>
                                  <span className="text-foreground">
                                    {doc.size}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-secondary">
                                    Uploader:
                                  </span>
                                  <span className="text-foreground font-medium truncate">
                                    {doc.uploader}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-secondary">
                                    Client Access:
                                  </span>
                                  <Badge variant="outline">{doc.access}</Badge>
                                </div>
                              </div>
                              <div className="flex space-x-1 pt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="shadow-sm flex-1"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="shadow-sm flex-1"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="shadow-sm flex-1"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="shadow-sm flex-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Table className="hidden md:table">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[200px]">
                                Document
                              </TableHead>
                              <TableHead className="min-w-[80px]">
                                Type
                              </TableHead>
                              <TableHead className="min-w-[100px]">
                                Uploaded
                              </TableHead>
                              <TableHead className="min-w-[80px]">
                                Size
                              </TableHead>
                              <TableHead className="min-w-[100px]">
                                Uploader
                              </TableHead>
                              <TableHead className="min-w-[100px]">
                                Client Access
                              </TableHead>
                              <TableHead className="min-w-[120px]">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {dummyDocuments.map((doc) => (
                              <TableRow key={doc.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center space-x-3">
                                    <FileText className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <span className="text-foreground block sm:inline">
                                        {doc.name}
                                      </span>
                                      <Badge
                                        variant="secondary"
                                        className="ml-2 mt-1 block sm:inline"
                                      >
                                        {doc.type}
                                      </Badge>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-foreground">
                                  {doc.type}
                                </TableCell>
                                <TableCell className="text-foreground">
                                  {doc.uploaded}
                                </TableCell>
                                <TableCell className="text-foreground">
                                  {doc.size}
                                </TableCell>
                                <TableCell className="text-foreground">
                                  {doc.uploader}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{doc.access}</Badge>
                                </TableCell>
                                <TableCell className="space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shadow-sm"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shadow-sm"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shadow-sm"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shadow-sm"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* System Reports */}
              <TabsContent value="reports" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      System Reports
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                    <Card className="shadow-md border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Reports
                        </CardTitle>
                        <FileText className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          24
                        </div>
                        <p className="text-xs text-secondary">
                          Generated this month
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Service Reports Issued
                        </CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          156
                        </div>
                        <p className="text-xs text-secondary">This month</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Incident Reports
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          8
                        </div>
                        <p className="text-xs text-secondary">This month</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          System Uptime
                        </CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          99.9%
                        </div>
                        <p className="text-xs text-secondary">Last 30 days</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="shadow-md border-0">
                      <CardHeader>
                        <CardTitle>Available Reports & Analytics</CardTitle>
                        <CardDescription>
                          System-generated reports and analytics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {dummyReports.map((report) => (
                          <div
                            key={report.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-border last:border-b-0"
                          >
                            <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium text-foreground">
                                  {report.name}
                                </p>
                                <p className="text-sm text-secondary">
                                  {report.period} • {report.size}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!report.actions}
                                className="shadow-sm"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!report.actions}
                                className="shadow-sm"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Badge
                                variant={
                                  report.status === "Ready"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {report.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader>
                        <CardTitle>Generate New Report</CardTitle>
                        <CardDescription>
                          Create custom reports based on specific criteria
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Report Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">
                              Client Activity Report
                            </SelectItem>
                            <SelectItem value="security">
                              Security Summary
                            </SelectItem>
                            <SelectItem value="performance">
                              Performance Analytics
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button className="w-full shadow-sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    System Settings
                  </h2>
                  <Tabs defaultValue="company" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto p-1 rounded-lg bg-card shadow-sm border">
                      <TabsTrigger
                        value="company"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
                      >
                        Company Info
                      </TabsTrigger>
                      <TabsTrigger
                        value="security"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
                      >
                        Security
                      </TabsTrigger>
                      <TabsTrigger
                        value="notifications"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
                      >
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger
                        value="email"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
                      >
                        Email
                      </TabsTrigger>
                      <TabsTrigger
                        value="maintenance"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
                      >
                        Maintenance
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="company" className="mt-0">
                      <Card className="shadow-md border-0">
                        <CardHeader>
                          <CardTitle>Company Information</CardTitle>
                          <CardDescription>
                            Update your company details and contact information
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                              id="companyName"
                              defaultValue={companyInfo.name}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="companyEmail">Email Address</Label>
                            <Input
                              id="companyEmail"
                              defaultValue={companyInfo.email}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="companyPhone">Phone Number</Label>
                            <Input
                              id="companyPhone"
                              defaultValue={companyInfo.phone}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="companyAddress">Address</Label>
                            <Input
                              id="companyAddress"
                              defaultValue={companyInfo.address}
                            />
                          </div>
                          <Button className="bg-primary text-white hover:bg-primary/90 shadow-sm">
                            Save Changes
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="security" className="mt-0">
                      <Card className="shadow-md border-0">
                        <CardHeader>
                          <CardTitle>Security Settings</CardTitle>
                          <CardDescription>
                            Configure security policies and access controls
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="items-top flex space-x-2 space-y-2">
                            <div className="flex h-6 items-center space-x-2">
                              <input
                                type="checkbox"
                                id="twoFactor"
                                defaultChecked={securitySettings.twoFactor}
                                className="w-5 h-5 rounded accent-primary"
                              />
                            </div>
                            <div className="grid gap-1 leading-none">
                              <label
                                htmlFor="twoFactor"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Two-Factor for All Admin Accounts
                              </label>
                            </div>
                          </div>
                          <div className="items-top flex space-x-2 space-y-2">
                            <div className="flex h-6 items-center space-x-2">
                              <input
                                type="checkbox"
                                id="loginAlerts"
                                defaultChecked={securitySettings.loginAlerts}
                                className="w-5 h-5 rounded accent-primary"
                              />
                            </div>
                            <div className="grid gap-1 leading-none">
                              <label
                                htmlFor="loginAlerts"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Email Alerts for Admin Logins
                              </label>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sessionTimeout">
                              Session Duration (minutes)
                            </Label>
                            <Input
                              id="sessionTimeout"
                              type="number"
                              defaultValue={securitySettings.sessionTimeout}
                              className="w-24"
                            />
                          </div>
                          <Button className="bg-primary text-white hover:bg-primary/90 shadow-sm">
                            Save Changes
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="notifications" className="mt-0">
                      <Card className="shadow-md border-0">
                        <CardHeader>
                          <CardTitle>Notification Settings</CardTitle>
                          <CardDescription>
                            Configure system notifications and alerts
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="items-top flex space-x-2 space-y-2">
                            <div className="flex h-6 items-center space-x-2">
                              <input
                                type="checkbox"
                                id="newClient"
                                defaultChecked={notificationSettings.newClient}
                                className="w-5 h-5 rounded accent-primary"
                              />
                            </div>
                            <div className="grid gap-1 leading-none">
                              <label
                                htmlFor="newClient"
                                className="text-sm font-medium leading-none"
                              >
                                Email when new clients register
                              </label>
                            </div>
                          </div>
                          <div className="items-top flex space-x-2 space-y-2">
                            <div className="flex h-6 items-center space-x-2">
                              <input
                                type="checkbox"
                                id="incidentReports"
                                defaultChecked={
                                  notificationSettings.incidentReports
                                }
                                className="w-5 h-5 rounded accent-primary"
                              />
                            </div>
                            <div className="grid gap-1 leading-none">
                              <label
                                htmlFor="incidentReports"
                                className="text-sm font-medium leading-none"
                              >
                                Incident Reports for new incidents
                              </label>
                            </div>
                          </div>
                          <div className="items-top flex space-x-2 space-y-2">
                            <div className="flex h-6 items-center space-x-2">
                              <input
                                type="checkbox"
                                id="maintenance"
                                defaultChecked={
                                  notificationSettings.maintenance
                                }
                                className="w-5 h-5 rounded accent-primary"
                              />
                            </div>
                            <div className="grid gap-1 leading-none">
                              <label
                                htmlFor="maintenance"
                                className="text-sm font-medium leading-none"
                              >
                                System Maintenance Notifications
                              </label>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="adminEmail">Admin Email</Label>
                            <Input
                              id="adminEmail"
                              defaultValue={notificationSettings.adminEmail}
                            />
                          </div>
                          <Button className="bg-primary text-white hover:bg-primary/90 shadow-sm">
                            Save Changes
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="email" className="mt-0">
                      <Card className="shadow-md border-0">
                        <CardHeader>
                          <CardTitle>Email Settings</CardTitle>
                          <CardDescription>
                            Configure SMTP settings for system emails
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="smtpHost">SMTP Host</Label>
                              <Input
                                id="smtpHost"
                                defaultValue={emailSettings.smtpHost}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="smtpPort">SMTP Port</Label>
                              <Input
                                id="smtpPort"
                                type="number"
                                defaultValue={emailSettings.smtpPort}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              defaultValue={emailSettings.username}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="items-top flex space-x-2 space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="useSSL"
                                defaultChecked={emailSettings.useSSL}
                                className="w-5 h-5 rounded accent-primary"
                              />
                            </div>
                            <div className="grid gap-1 leading-none">
                              <label
                                htmlFor="useSSL"
                                className="text-sm font-medium leading-none"
                              >
                                Use SSL/TLS
                              </label>
                            </div>
                          </div>
                          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                            Save Email Settings
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="maintenance" className="mt-0">
                      <Card className="shadow-md border-0">
                        <CardHeader>
                          <CardTitle>System Maintenance</CardTitle>
                          <CardDescription>
                            System maintenance and backup operations
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-muted rounded-md shadow-sm gap-4">
                            <div className="text-center sm:text-left">
                              <p className="font-medium text-foreground">
                                Last Backup
                              </p>
                              <p className="text-sm text-secondary">
                                {systemMaintenance.lastBackup}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="shadow-sm"
                            >
                              Backup Database
                            </Button>
                          </div>
                          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-muted rounded-md shadow-sm gap-4">
                            <div className="text-center sm:text-left">
                              <p className="font-medium text-foreground">
                                Next Scheduled Backup
                              </p>
                              <p className="text-sm text-secondary">
                                {systemMaintenance.nextBackup}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                              variant="outline"
                              className="shadow-sm flex-1"
                            >
                              <Clock className="h-4 w-4 mr-2" /> Clear Cache
                            </Button>
                            <Button
                              variant="outline"
                              className="shadow-sm flex-1"
                            >
                              <Shield className="h-4 w-4 mr-2" /> Security Scan
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
