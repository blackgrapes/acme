"use client";

import { useRouter } from "next/navigation";
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
  Eye,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone,
  Building,
  Calendar,
  User,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function ClientManagement({
  guardSearch,
  handleGuardSearch,
  selectedGuards,
  toggleGuardSelection,
  filteredClientGuards,
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    org: "",
    address: "",
    plan: "",
    startDate: "",
    endDate: "",
  });

  // Real clients fetch करें
  useEffect(() => {
    fetchClients();
  }, []);

  // ClientManagement.jsx में fetchClients function update करें
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

  // Filter clients based on search and filters
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.companyName &&
        client.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    const matchesPlan =
      planFilter === "all" || client.securityPlan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-3 w-3" />;
      case "Pending":
        return <Clock className="h-3 w-3" />;
      case "Inactive":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Active":
        return "default";
      case "Pending":
        return "secondary";
      case "Inactive":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Form input handle करें
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Client registration form submission - SIMPLIFIED VERSION
  const handleClientSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      const clientData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        companyName: formData.org,
        address: formData.address,
        securityPlan: formData.plan,
        serviceDuration: {
          from: formData.startDate,
          to: formData.endDate,
        },
        roleName: "Client",
        documents: [],
      };

      console.log("📝 Sending client data:", clientData);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });

      const result = await response.json();

      // ClientManagement.jsx में handleClientSubmit में
      if (response.ok) {
        console.log("✅ Client registered successfully:", result.message);
        // Refresh clients list
        await fetchClients();
        // Close dialog and reset form
        setIsDialogOpen(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          org: "",
          address: "",
          plan: "",
          startDate: "",
          endDate: "",
        });
        // ✅ Simple success message
        alert("Client registered successfully!");
      } else {
        console.error("❌ Registration failed:", result.error);
        alert(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      console.error("💥 Registration error:", error);
      alert("Registration error. Please try again.");
    }
  };

  const handleClientRowClick = (clientId) => {
    router.push(`/admin-dashboard/client-details/${clientId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading clients...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Client Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage client accounts, assignments, and permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-primary/20 hover:bg-primary/5"
            permission="clients-read"
          >
            <Download className="h-4 w-4 mr-2 text-primary" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" permission="clients-create">
                <Plus className="h-4 w-4 mr-2" />
                Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Add New Client
                </DialogTitle>
                <DialogDescription>
                  Create a new client account with security assignments and
                  preferences.
                </DialogDescription>
              </DialogHeader>

              {/* FORM START */}
              <form
                onSubmit={handleClientSubmit}
                className="grid gap-6 py-4 grid-cols-1 md:grid-cols-2"
              >
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </h3>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Smith"
                    className="border-primary/20 focus:border-primary"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="border-primary/20 focus:border-primary"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(555) 123-4567"
                    className="border-primary/20 focus:border-primary"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="org" className="text-sm font-medium">
                    Organization
                  </Label>
                  <Input
                    id="org"
                    name="org"
                    placeholder="Company Name"
                    className="border-primary/20 focus:border-primary"
                    value={formData.org}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Enter full address..."
                    className="border-primary/20 focus:border-primary min-h-[80px]"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="border-primary/20 focus:border-primary"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="border-primary/20 focus:border-primary"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                  />
                </div>

                {/* Security Plan */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Security Plan
                  </h3>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="plan" className="text-sm font-medium">
                    Security Plan *
                  </Label>
                  <Select
                    name="plan"
                    required
                    value={formData.plan}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, plan: value }))
                    }
                  >
                    <SelectTrigger className="border-primary/20 focus:border-primary">
                      <SelectValue placeholder="Select Security Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal Security Officer">
                        Personal Security Officer
                      </SelectItem>
                      <SelectItem value="Security Guard">
                        Security Guard
                      </SelectItem>
                      <SelectItem value="Security Officer">
                        Security Officer
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
                        Ex-men Security Guard & Bodyguards
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Service Duration
                  </Label>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="startDate" className="text-xs">
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        className="border-primary/20 focus:border-primary"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="endDate" className="text-xs">
                        End Date
                      </Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        className="border-primary/20 focus:border-primary"
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 md:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/5"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setFormData({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        phone: "",
                        org: "",
                        address: "",
                        plan: "",
                        startDate: "",
                        endDate: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    permission="clients-create"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Client Account
                  </Button>
                </DialogFooter>
              </form>
              {/* FORM END */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md border-0 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Total Clients
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {clients.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Active</p>
                <p className="text-2xl font-bold text-foreground">
                  {clients.filter((c) => c.status === "Active").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">
                  {clients.filter((c) => c.status === "Pending").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{clients.length * 25000}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card className="shadow-md border-0">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <CardTitle className="text-foreground">Client Directory</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center space-x-2 w-full sm:w-64">
              <Search className="h-4 w-4 text-primary flex-shrink-0" />
              <Input
                placeholder="Search clients..."
                className="h-9 flex-1 border-primary/20 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] border-primary/20 focus:border-primary">
                <Filter className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[160px] border-primary/20 focus:border-primary">
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Personal Security Officer">
                  Personal
                </SelectItem>
                <SelectItem value="Security Guard">Guard</SelectItem>
                <SelectItem value="Security Officer">Officer</SelectItem>
                <SelectItem value="Security Supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[280px]">Client</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Contact
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Organization
                  </TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Plan</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow
                    key={client._id}
                    className="cursor-pointer hover:bg-primary/5 transition-colors group"
                    onClick={() => handleClientRowClick(client._id)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {client.name}
                          </div>
                          <div className="text-sm text-muted-foreground hidden sm:block">
                            {client.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-primary" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-primary" />
                          {client.phone || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                          {client.companyName || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge
                          variant={getStatusVariant(client.status)}
                          className={`flex items-center gap-1 ${
                            client.status === "Active"
                              ? "bg-green-500 text-white"
                              : client.status === "Pending"
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {getStatusIcon(client.status)}
                          {client.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="text-sm text-foreground font-medium">
                        {client.securityPlan || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClientRowClick(client._id);
                          }}
                          permission="clients-read"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          permission="clients-update"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-primary/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {clients.length === 0
                  ? "No clients registered yet"
                  : "No clients found"}
              </h3>
              <p className="text-muted-foreground">
                {clients.length === 0
                  ? "Add your first client using the button above."
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
