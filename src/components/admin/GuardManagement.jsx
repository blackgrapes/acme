// File: src/components/admin/GuardManagement.jsx
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
  FileText,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function GuardManagement({ handleGuardRowClick }) {
  const [openAddGuardDialog, setOpenAddGuardDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    type: "",
    experience: "",
    salary: "",
    location: "",
    specialization: "",
    certifications: "",
  });

  // Fetch guards on component mount
  useEffect(() => {
    fetchGuards();
  }, []);

  const fetchGuards = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/guard");
      const result = await response.json();

      if (response.ok) {
        setGuards(result.guards || []);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch guards",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching guards:", error);
      toast({
        title: "Error",
        description: "Failed to fetch guards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Process specialization and certifications into arrays
      const submissionData = {
        ...formData,
        specialization: formData.specialization
          ? formData.specialization
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : [],
        certifications: formData.certifications
          ? formData.certifications
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : [],
      };

      const response = await fetch("/api/auth/guard/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: result.message || "Guard registered successfully!",
        });
        setOpenAddGuardDialog(false);
        resetForm();
        fetchGuards(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to register guard",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error registering guard:", error);
      toast({
        title: "Error",
        description: "Failed to register guard",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      emergencyContact: "",
      gender: "",
      dateOfBirth: "",
      address: "",
      type: "",
      experience: "",
      salary: "",
      location: "",
      specialization: "",
      certifications: "",
    });
  };

  // Filter guards based on search and filters
  const filteredGuards = guards.filter((guard) => {
    const matchesSearch =
      guard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guard.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guard.guardId.toLowerCase().includes(searchQuery.toLowerCase());

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
      case "Active":
        return "default";
      case "Inactive":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Assigned":
      case "Active":
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
    total: guards.length,
    assigned: guards.filter((g) => g.status === "Assigned").length,
    available: guards.filter((g) => g.status === "Available").length,
    onLeave: guards.filter((g) => g.status === "On Leave").length,
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
            onClick={fetchGuards}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
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
                  Create a new guard profile with complete details.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
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
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
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
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="guardPhone" className="text-sm font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="guardPhone"
                      placeholder="+91 98765 43210"
                      className="border-primary/20 focus:border-primary"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      required
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
                      placeholder="+91 87654 32109"
                      className="border-primary/20 focus:border-primary"
                      value={formData.emergencyContact}
                      onChange={(e) =>
                        handleInputChange("emergencyContact", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="guardGender"
                      className="text-sm font-medium"
                    >
                      Gender *
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                    >
                      <SelectTrigger className="border-primary/20 focus:border-primary">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="guardDob" className="text-sm font-medium">
                      Date of Birth *
                    </Label>
                    <Input
                      id="guardDob"
                      type="date"
                      className="border-primary/20 focus:border-primary"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      required
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
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleInputChange("type", value)
                      }
                    >
                      <SelectTrigger className="border-primary/20 focus:border-primary">
                        <SelectValue placeholder="Select Guard Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Security Guard">
                          Security Guard
                        </SelectItem>
                        <SelectItem value="Security Officer">
                          Security Officer
                        </SelectItem>
                        <SelectItem value="Personal Security Officer">
                          Personal Security Officer
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
                    <Label
                      htmlFor="guardExperience"
                      className="text-sm font-medium"
                    >
                      Experience (Years) *
                    </Label>
                    <Input
                      id="guardExperience"
                      type="number"
                      placeholder="5"
                      className="border-primary/20 focus:border-primary"
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="guardSalary"
                      className="text-sm font-medium"
                    >
                      Monthly Salary *
                    </Label>
                    <Input
                      id="guardSalary"
                      placeholder="₹35,000"
                      className="border-primary/20 focus:border-primary"
                      value={formData.salary}
                      onChange={(e) =>
                        handleInputChange("salary", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="guardLocation"
                      className="text-sm font-medium"
                    >
                      Location *
                    </Label>
                    <Input
                      id="guardLocation"
                      placeholder="Mumbai"
                      className="border-primary/20 focus:border-primary"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label
                      htmlFor="guardAddress"
                      className="text-sm font-medium"
                    >
                      Address *
                    </Label>
                    <Textarea
                      id="guardAddress"
                      placeholder="Complete residential address..."
                      className="border-primary/20 focus:border-primary min-h-[80px]"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Specialization Input */}
                  <div className="space-y-3 md:col-span-2">
                    <Label
                      htmlFor="guardSpecialization"
                      className="text-sm font-medium"
                    >
                      Specializations (comma separated)
                    </Label>
                    <Input
                      id="guardSpecialization"
                      placeholder="Crowd Control, Executive Protection, Emergency Response"
                      className="border-primary/20 focus:border-primary"
                      value={formData.specialization}
                      onChange={(e) =>
                        handleInputChange("specialization", e.target.value)
                      }
                    />
                  </div>

                  {/* Certifications Input */}
                  <div className="space-y-3 md:col-span-2">
                    <Label
                      htmlFor="guardCertifications"
                      className="text-sm font-medium"
                    >
                      Certifications (comma separated)
                    </Label>
                    <Input
                      id="guardCertifications"
                      placeholder="CPR Certified, Security License, Firearms Permit"
                      className="border-primary/20 focus:border-primary"
                      value={formData.certifications}
                      onChange={(e) =>
                        handleInputChange("certifications", e.target.value)
                      }
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenAddGuardDialog(false)}
                    className="border-primary/20 hover:bg-primary/5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {submitting ? "Adding..." : "Add Guard"}
                  </Button>
                </DialogFooter>
              </form>
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
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
                <SelectItem value="Lady Security Guard">
                  Lady Security
                </SelectItem>
                <SelectItem value="Security Gunmen">Security Gunmen</SelectItem>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading guards...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredGuards.length > 0 ? (
                  filteredGuards.map((guard) => (
                    <TableRow
                      key={guard._id}
                      className="cursor-pointer hover:bg-primary/5 transition-colors group border-b border-border/20"
                      onClick={() => handleGuardRowClick(guard._id)}
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
                              ID: {guard.guardId}
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
                              guard.status === "Assigned" ||
                              guard.status === "Active"
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGuardRowClick(guard._id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Shield className="h-16 w-16 mx-auto mb-4 text-primary/30" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No guards found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ||
                        statusFilter !== "all" ||
                        typeFilter !== "all"
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
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
