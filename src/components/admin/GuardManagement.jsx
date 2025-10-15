"use client";

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
  Search,
  Plus,
  Eye,
  Edit2,
  Filter,
  MoreVertical,
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

export default function GuardManagement({
  dummyGuards,
  guardDocuments,
  handleAddGuardDocuments,
  handleGuardRowClick,
}) {
  const [openAddGuardDialog, setOpenAddGuardDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Filter guards based on search and filters
  const filteredGuards = dummyGuards.filter((guard) => {
    const matchesSearch =
      guard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guard.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guard.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || guard.status === statusFilter;
    const matchesType = typeFilter === "all" || guard.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case "Assigned":
        return "default";
      case "Available":
        return "secondary";
      case "On Leave":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Assigned":
        return <CheckCircle className="h-3 w-3" />;
      case "Available":
        return <Clock className="h-3 w-3" />;
      case "On Leave":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  // Statistics
  const stats = {
    total: dummyGuards.length,
    assigned: dummyGuards.filter((g) => g.status === "Assigned").length,
    available: dummyGuards.filter((g) => g.status === "Available").length,
    onLeave: dummyGuards.filter((g) => g.status === "On Leave").length,
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Guard Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage security personnel, assignments, and availability
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
          <Dialog
            open={openAddGuardDialog}
            onOpenChange={setOpenAddGuardDialog}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Guard
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Add New Security Guard
                </DialogTitle>
                <DialogDescription>
                  Create a new guard profile with complete details and
                  documents.
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
                  <Label htmlFor="guardName" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="guardName"
                    placeholder="John Smith"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="guardEmail" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="guardEmail"
                    type="email"
                    placeholder="guard@example.com"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="guardPhone" className="text-sm font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="guardPhone"
                    placeholder="(555) 123-4567"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="guardEmergencyContact"
                    className="text-sm font-medium"
                  >
                    Emergency Contact
                  </Label>
                  <Input
                    id="guardEmergencyContact"
                    placeholder="(555) 987-6543"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="guardGender" className="text-sm font-medium">
                    Gender *
                  </Label>
                  <Select>
                    <SelectTrigger className="border-primary/20 focus:border-primary">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="guardDob" className="text-sm font-medium">
                    Date of Birth
                  </Label>
                  <Input
                    id="guardDob"
                    type="date"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                {/* Professional Details */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Professional Details
                  </h3>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="guardType" className="text-sm font-medium">
                    Guard Type *
                  </Label>
                  <Select>
                    <SelectTrigger className="border-primary/20 focus:border-primary">
                      <SelectValue placeholder="Select Guard Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pso">
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
                  <Label htmlFor="guardId" className="text-sm font-medium">
                    Guard ID *
                  </Label>
                  <Input
                    id="guardId"
                    placeholder="GUA-001"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="guardExperience"
                    className="text-sm font-medium"
                  >
                    Experience (Years)
                  </Label>
                  <Input
                    id="guardExperience"
                    type="number"
                    placeholder="5"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="guardSalary" className="text-sm font-medium">
                    Monthly Salary
                  </Label>
                  <Input
                    id="guardSalary"
                    placeholder="$3,000"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Availability</Label>
                  <div className="space-y-3 p-3 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="guardActive" className="text-sm">
                        Active Status
                      </Label>
                      <Switch id="guardActive" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="guardAvailable" className="text-sm">
                        Available for Assignment
                      </Label>
                      <Switch id="guardAvailable" defaultChecked />
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Documents & Certifications
                  </h3>
                  <div className="space-y-4 p-4 border border-primary/20 rounded-lg">
                    <div className="space-y-3">
                      <Label
                        htmlFor="guardDocuments"
                        className="text-sm font-medium"
                      >
                        Upload Documents (Multiple)
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="guardDocuments"
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleAddGuardDocuments}
                          className="border-primary/20 focus:border-primary"
                        />
                        <Button
                          variant="outline"
                          className="border-primary/20 hover:bg-primary/5"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>

                    {guardDocuments.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Selected Documents:
                        </Label>
                        <div className="space-y-2 max-h-32 overflow-y-auto p-2 border border-primary/10 rounded-md">
                          {guardDocuments.map((doc, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 bg-primary/5 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-sm text-foreground">
                                  {doc.name}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {(doc.size / 1024 / 1024).toFixed(2)} MB
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="guardNotes" className="text-sm font-medium">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="guardNotes"
                    placeholder="Any additional information about the guard..."
                    className="border-primary/20 focus:border-primary min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setOpenAddGuardDialog(false)}
                  className="border-primary/20 hover:bg-primary/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guard
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Total Guards
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Assigned</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.assigned}
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
                <p className="text-sm font-medium text-foreground">Available</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.available}
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
                <p className="text-sm font-medium text-foreground">On Leave</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.onLeave}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guards Table */}
      <Card className="shadow-md border-0">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3">
          <CardTitle className="text-foreground">Security Personnel</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center space-x-2 w-full sm:w-64">
              <Search className="h-4 w-4 text-primary flex-shrink-0" />
              <Input
                placeholder="Search guards..."
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
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px] border-primary/20 focus:border-primary">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Security Guard">Security Guard</SelectItem>
                <SelectItem value="Security Officer">
                  Security Officer
                </SelectItem>
                <SelectItem value="Personal Security Officer">
                  Personal Security
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-primary/10">
                  <TableHead className="text-left font-semibold text-foreground">
                    Guard
                  </TableHead>
                  <TableHead className="text-left font-semibold text-foreground hidden lg:table-cell">
                    Contact
                  </TableHead>
                  <TableHead className="text-left font-semibold text-foreground hidden md:table-cell">
                    Type
                  </TableHead>
                  <TableHead className="text-center font-semibold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-left font-semibold text-foreground hidden xl:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="text-right font-semibold text-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuards.map((guard) => (
                  <TableRow
                    key={guard.id}
                    className="cursor-pointer hover:bg-primary/5 transition-colors group border-b border-border/20"
                    onClick={() => handleGuardRowClick(guard.id)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {guard.name}
                          </div>
                          <div className="text-sm text-muted-foreground hidden sm:block">
                            ID: {guard.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-primary" />
                          {guard.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-primary" />
                          {guard.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/20"
                      >
                        {guard.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge
                          variant={getStatusVariant(guard.status)}
                          className={`flex items-center gap-1 ${
                            guard.status === "Assigned"
                              ? "bg-primary text-primary-foreground"
                              : guard.status === "Available"
                              ? "bg-primary/20 text-primary"
                              : ""
                          }`}
                        >
                          {getStatusIcon(guard.status)}
                          <span className="hidden sm:inline">
                            {guard.status}
                          </span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {guard.location || "Main Office"}
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
                          <Edit2 className="h-4 w-4" />
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

            {filteredGuards.length === 0 && (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 mx-auto mb-4 text-primary/30" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No guards found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No guards have been added yet"}
                </p>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setOpenAddGuardDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Guard
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-4">
        {filteredGuards.map((guard) => (
          <Card
            key={guard.id}
            className="shadow-md border-0 cursor-pointer hover:bg-primary/5 transition-colors"
            onClick={() => handleGuardRowClick(guard.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {guard.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {guard.id}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {guard.email}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={getStatusVariant(guard.status)}
                  className={`flex items-center gap-1 ${
                    guard.status === "Assigned"
                      ? "bg-primary text-primary-foreground"
                      : guard.status === "Available"
                      ? "bg-primary/20 text-primary"
                      : ""
                  }`}
                >
                  {getStatusIcon(guard.status)}
                  {guard.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium text-foreground">
                    {guard.type}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Phone</div>
                  <div className="font-medium text-foreground">
                    {guard.phone}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Gender</div>
                  <div className="font-medium text-foreground">
                    {guard.gender}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Location</div>
                  <div className="font-medium text-foreground">
                    {guard.location || "Main Office"}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-primary/10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-primary hover:bg-primary/10"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-primary hover:bg-primary/10"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
