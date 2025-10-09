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
  Home,
  AlertTriangle,
  Folder,
} from "lucide-react";

const dummyServiceReports = [
  {
    id: 1,
    code: "SR-001",
    date: "2025-01-15",
    hours: "8 hours",
    location: "ABC Corporation - Main Building",
    officer: "Officer Johnson",
    status: "completed",
    details:
      "Regular security patrol and building monitoring. Conducted hourly perimeter checks, monitored CCTV systems, and ensured all access points were secure. No incidents reported during shift.",
  },
  {
    id: 2,
    code: "SR-002",
    date: "2025-01-14",
    hours: "12 hours",
    location: "ABC Corporation - Parking Garage",
    officer: "Officer Smith",
    status: "completed",
    details:
      "Overnight security coverage for parking facility. Monitored parking garage overnight, conducted vehicle patrols, and assisted with late-night employee access. All vehicles accounted for.",
  },
  {
    id: 3,
    code: "SR-003",
    date: "2025-01-16",
    hours: "8 hours",
    location: "ABC Corporation - Main Building",
    officer: "Officer Davis",
    status: "in-progress",
    details:
      "Daytime security and reception duties. Currently providing front desk security, visitor management, and access control for main building entrance.",
  },
];

const dummyIncidentReports = [
  {
    id: 1,
    code: "IR-001",
    date: "2025-01-12",
    time: "14:30",
    type: "Security Breach",
    location: "ABC Corporation - Loading Dock",
    officer: "Officer Johnson",
    severity: "Medium",
    status: "resolved",
    description:
      "Unauthorized individual attempted to enter through loading dock area.",
    actions:
      "Individual was approached and escorted off premises. Incident logged and management notified.",
  },
  {
    id: 2,
    code: "IR-002",
    date: "2025-01-10",
    time: "09:15",
    type: "Vandalism",
    location: "ABC Corporation - Parking Lot B",
    officer: "Officer Smith",
    severity: "Low",
    status: "closed",
    description: "Minor graffiti discovered on exterior wall of building.",
    actions:
      "Area photographed, maintenance team notified for cleanup. Police report filed.",
  },
];

const dummyDocuments = [
  {
    id: 1,
    name: "Service Agreement 2025",
    type: "Contract",
    uploaded: "2025-01-01",
    size: "2.4 MB",
    category: "Contracts",
  },
  {
    id: 2,
    name: "Monthly Security Report - December",
    type: "Report",
    uploaded: "2024-12-31",
    size: "1.8 MB",
    category: "Reports",
  },
  {
    id: 3,
    name: "Insurance Certificate",
    type: "Certificate",
    uploaded: "2024-12-15",
    size: "85 KB",
    category: "Certificates",
  },
  {
    id: 4,
    name: "Invoice - January 2025",
    type: "Invoice",
    uploaded: "2025-01-01",
    size: "3.4 MB",
    category: "Invoices",
  },
];

const userInfo = {
  name: "John Smith",
  email: "client@example.com",
};

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState("overview");

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
                  <nav className="p-4 space-y-1 flex flex-col h-full m-2">
                    <div className="space-y-1 mb-8">
                      <Button
                        variant={activeTab === "overview" ? "default" : "ghost"}
                        className={`w-full justify-start shadow-sm ${
                          activeTab === "overview"
                            ? "bg-primary text-white"
                            : "text-white"
                        }`}
                        onClick={() => setActiveTab("overview")}
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Overview
                      </Button>
                      <Button
                        variant={
                          activeTab === "service-reports" ? "default" : "ghost"
                        }
                        className={`w-full justify-start shadow-sm ${
                          activeTab === "service-reports"
                            ? "bg-primary text-white"
                            : "text-white"
                        }`}
                        onClick={() => setActiveTab("service-reports")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Service Reports
                      </Button>
                      <Button
                        variant={
                          activeTab === "incident-reports" ? "default" : "ghost"
                        }
                        className={`w-full justify-start shadow-sm ${
                          activeTab === "incident-reports"
                            ? "bg-primary text-white"
                            : "text-white"
                        }`}
                        onClick={() => setActiveTab("incident-reports")}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Incident Reports
                      </Button>
                      <Button
                        variant={
                          activeTab === "documents" ? "default" : "ghost"
                        }
                        className={`w-full justify-start shadow-sm ${
                          activeTab === "documents"
                            ? "bg-primary text-white"
                            : "text-white"
                        }`}
                        onClick={() => setActiveTab("documents")}
                      >
                        <Folder className="h-4 w-4 mr-2" />
                        Documents
                      </Button>
                    </div>
                    {/* User Profile in Mobile Sheet */}
                    <div className="mt-auto pt-4 border-t border-border">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white">
                            {userInfo.name}
                          </p>
                          <p className="text-xs text-white">
                            {userInfo.email}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full justify-start text-white">
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
                  Client Panel
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
                variant={activeTab === "overview" ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm ${
                  activeTab === "overview"
                    ? "bg-primary text-white"
                    : "text-primary-foreground"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <Home className="h-4 w-4 mr-2" />
                Overview
              </Button>

              <Button
                variant={activeTab === "service-reports" ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm ${
                  activeTab === "service-reports"
                    ? "bg-primary text-white"
                    : "text-primary-foreground"
                }`}
                onClick={() => setActiveTab("service-reports")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Service Reports
              </Button>

              <Button
                variant={activeTab === "incident-reports" ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm ${
                  activeTab === "incident-reports"
                    ? "bg-primary text-white"
                    : "text-primary-foreground"
                }`}
                onClick={() => setActiveTab("incident-reports")}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Incident Reports
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
                <Folder className="h-4 w-4 mr-2" />
                Documents
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
                    {userInfo.name}
                  </p>
                  <p className="text-xs text-secondary">{userInfo.email}</p>
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
            {/* Mobile Tabs for Navigation */}

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Overview Dashboard */}
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Dashboard Overview
                    </h2>
                  </div>
                  <p className="text-secondary">
                    Welcome to your security portal. Here's your latest
                    activity.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <Card className="shadow-md border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Services
                        </CardTitle>
                        <Shield className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          3
                        </div>
                        <p className="text-xs text-secondary">
                          Currently running
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          This Month
                        </CardTitle>
                        <FileText className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          12
                        </div>
                        <p className="text-xs text-secondary">
                          Service reports
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Incidents
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          2
                        </div>
                        <p className="text-xs text-secondary">This month</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Documents
                        </CardTitle>
                        <Folder className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          8
                        </div>
                        <p className="text-xs text-secondary">Available</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="shadow-md border-0">
                      <CardHeader>
                        <CardTitle>Recent Service Reports</CardTitle>
                        <CardDescription>
                          Latest security service activity
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {dummyServiceReports.slice(0, 3).map((report) => (
                          <div
                            key={report.id}
                            className="flex items-start space-x-3 py-2"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <Badge
                                variant={
                                  report.status === "completed"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  report.status === "completed"
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                                }
                              >
                                {report.status === "completed" ? "✓" : "⟳"}
                              </Badge>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-foreground">
                                {report.code}
                              </p>
                              <p className="text-sm text-secondary">
                                {report.location}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {report.date} - {report.officer}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    <Card className="shadow-md border-0">
                      <CardHeader>
                        <CardTitle>Recent Incidents</CardTitle>
                        <CardDescription>
                          Security incidents and responses
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {dummyIncidentReports.slice(0, 2).map((incident) => (
                          <div
                            key={incident.id}
                            className="flex items-start space-x-3 py-2"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <Badge
                                variant="default"
                                className="bg-yellow-500"
                              >
                                !
                              </Badge>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-foreground">
                                {incident.code} {incident.type}
                              </p>
                              <p className="text-sm text-secondary">
                                {incident.location}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {incident.date} - {incident.officer}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant="default"
                                className={
                                  incident.status === "resolved"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                                }
                              >
                                {incident.status}
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
                          Latest documents and reports
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {dummyDocuments.slice(0, 3).map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-4 w-4 text-primary" />
                              <div>
                                <p className="font-medium text-foreground">
                                  {doc.name}
                                </p>
                                <p className="text-xs text-secondary">
                                  {doc.type} • {doc.size}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
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
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Service Reports */}
              <TabsContent value="service-reports" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Service Reports
                    </h2>
                  </div>
                  <p className="text-secondary">
                    Detailed reports of security services provided at your
                    location.
                  </p>
                  <div className="space-y-4">
                    {dummyServiceReports.map((report) => (
                      <Card key={report.id} className="shadow-md border-0">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="default">{report.code}</Badge>
                              <span className="font-medium text-foreground">
                                {report.hours}
                              </span>
                            </div>
                            <p className="text-sm text-secondary mt-1">
                              {report.date} - {report.location}
                            </p>
                          </div>
                          <Badge
                            variant="default"
                            className={
                              report.status === "completed"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }
                          >
                            {report.status}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm font-medium mb-1 text-foreground">
                              Officer
                            </p>
                            <p className="text-secondary">{report.officer}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1 text-foreground">
                              Details
                            </p>
                            <p className="text-secondary text-sm">
                              {report.details}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="shadow-sm"
                            >
                              <Eye className="h-4 w-4 mr-2" /> View Full Report
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="shadow-sm"
                            >
                              <Download className="h-4 w-4 mr-2" /> Download PDF
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Incident Reports */}
              <TabsContent value="incident-reports" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Incident Reports
                    </h2>
                  </div>
                  <p className="text-secondary">
                    Security incidents, responses, and resolution details.
                  </p>
                  <div className="space-y-4">
                    {dummyIncidentReports.map((incident) => (
                      <Card key={incident.id} className="shadow-md border-0">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="default">{incident.code}</Badge>
                              <span className="font-medium text-foreground">
                                {incident.time} {incident.date}
                              </span>
                            </div>
                            <p className="text-sm text-secondary mt-1">
                              {incident.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant="default"
                              className="mb-1 block bg-orange-500"
                            >
                              {incident.severity}
                            </Badge>
                            <Badge
                              variant="default"
                              className={
                                incident.status === "resolved"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                              }
                            >
                              {incident.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm font-medium mb-1 text-foreground">
                              Type
                            </p>
                            <p className="text-secondary">{incident.type}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1 text-foreground">
                              Responding Officer
                            </p>
                            <p className="text-secondary">{incident.officer}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1 text-foreground">
                              Description
                            </p>
                            <p className="text-secondary text-sm">
                              {incident.description}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1 text-foreground">
                              Actions Taken
                            </p>
                            <p className="text-secondary text-sm">
                              {incident.actions}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="shadow-sm"
                            >
                              <Eye className="h-4 w-4 mr-2" /> View Full Report
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="shadow-sm"
                            >
                              <Download className="h-4 w-4 mr-2" /> Download PDF
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Documents */}
              <TabsContent value="documents" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Documents
                    </h2>
                  </div>
                  <p className="text-secondary">
                    Access your contracts, reports, certificates, and other
                    important documents.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {dummyDocuments.map((doc) => (
                      <Card key={doc.id} className="shadow-md border-0">
                        <CardHeader>
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <Badge variant="default">{doc.type}</Badge>
                          </div>
                          <CardTitle className="text-foreground">
                            {doc.name}
                          </CardTitle>
                          <CardDescription className="text-secondary">
                            {doc.uploaded} • {doc.size}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex space-x-2 pt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 shadow-sm"
                          >
                            <Eye className="h-4 w-4 mr-2" /> View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 shadow-sm"
                          >
                            <Download className="h-4 w-4 mr-2" /> Download
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Card className="shadow-md border-0">
                    <CardContent className="py-6 text-center">
                      <p className="text-secondary mb-4">
                        Need additional documents? If you need access to
                        additional documents or have questions about your files,
                        please contact our support team.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="outline" className="shadow-sm">
                          Contact Support
                        </Button>
                        <Button variant="outline" className="shadow-sm">
                          Request Documents
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
