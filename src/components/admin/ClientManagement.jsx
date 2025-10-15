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
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function ClientManagement({
  dummyClients,
  guardSearch,
  handleGuardSearch,
  selectedGuards,
  toggleGuardSelection,
  filteredClientGuards,
  handleClientRowClick,
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  // Filter clients based on search and filters
  const filteredClients = dummyClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.org.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    const matchesPlan = planFilter === "all" || client.plan === planFilter;

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
          >
            <Download className="h-4 w-4 mr-2 text-primary" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
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
              <div className="grid gap-6 py-4 grid-cols-1 md:grid-cols-2">
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
                    placeholder="John Smith"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="org" className="text-sm font-medium">
                    Organization
                  </Label>
                  <Input
                    id="org"
                    placeholder="Company Name"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Enter full address..."
                    className="border-primary/20 focus:border-primary min-h-[80px]"
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
                  <Select>
                    <SelectTrigger className="border-primary/20 focus:border-primary">
                      <SelectValue placeholder="Select Security Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">
                        Personal Security Officer
                      </SelectItem>
                      <SelectItem value="guard">Security Guard</SelectItem>
                      <SelectItem value="officer">Security Officer</SelectItem>
                      <SelectItem value="supervisor">
                        Security Supervisor
                      </SelectItem>
                      <SelectItem value="lady">Lady Security Guard</SelectItem>
                      <SelectItem value="gunmen">Security Gunmen</SelectItem>
                      <SelectItem value="exmen">
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
                        type="date"
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="endDate" className="text-xs">
                        End Date
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Account Settings
                  </Label>
                  <div className="space-y-3 p-3 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="active" className="text-sm">
                        Active Account
                      </Label>
                      <Switch id="active" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications" className="text-sm">
                        Email Notifications
                      </Label>
                      <Switch id="notifications" defaultChecked />
                    </div>
                  </div>
                </div>

                {/* Guard Assignment */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Assign Security Personnel
                  </h3>
                  <div className="space-y-4 p-4 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-primary" />
                      <Input
                        placeholder="Search guards by name, email, or specialty..."
                        value={guardSearch}
                        onChange={(e) => handleGuardSearch(e, "client")}
                        className="flex-1 border-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
                      {filteredClientGuards.map((guard) => (
                        <div
                          key={guard.id}
                          className="flex items-center space-x-3 p-3 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          <input
                            type="checkbox"
                            id={`guard-${guard.id}`}
                            checked={selectedGuards.includes(guard.id)}
                            onChange={() =>
                              toggleGuardSelection(guard.id, "client")
                            }
                            className="text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor={`guard-${guard.id}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            <div className="font-medium text-foreground">
                              {guard.name}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {guard.email}
                            </div>
                            <div className="text-xs text-primary font-medium mt-1">
                              {guard.specialty || "Security Guard"}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                    {selectedGuards.length > 0 && (
                      <div className="text-sm text-primary font-medium">
                        {selectedGuards.length} guard
                        {selectedGuards.length > 1 ? "s" : ""} selected
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Client Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Total Clients
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {dummyClients.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Active</p>
                <p className="text-2xl font-bold text-foreground">
                  {dummyClients.filter((c) => c.status === "Active").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">
                  {dummyClients.filter((c) => c.status === "Pending").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Assigned Guards
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {selectedGuards.length}
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
                    key={client.id}
                    className="cursor-pointer hover:bg-primary/5 transition-colors group"
                    onClick={() => handleClientRowClick(client.id)}
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
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-primary" />
                        <span className="text-sm">{client.org}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge
                          variant={getStatusVariant(client.status)}
                          className={`flex items-center gap-1 ${
                            client.status === "Active"
                              ? "bg-primary text-primary-foreground"
                              : client.status === "Pending"
                              ? "bg-primary/20 text-primary"
                              : ""
                          }`}
                        >
                          {getStatusIcon(client.status)}
                          {client.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="text-sm text-foreground font-medium">
                        {client.plan}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                        >
                          <MoreVertical className="h-4 w-4" />
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
                No clients found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
