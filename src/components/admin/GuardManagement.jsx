"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import StatsCards from "./GuardComponents/StatsCards";
import CategoryTabs from "./CategoryTabs";
import ActionBar from "./GuardComponents/ActionBar";
import ContentTable from "./GuardComponents/ContentTable";
import { Loader2 } from "lucide-react"; 
import {
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Edit2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const GUARD_CATEGORIES = [
  {
    id: "all-guards",
    name: "All Guards",
    icon: Shield,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400",
  },
  {
    id: "assigned",
    name: "Assigned",
    icon: CheckCircle,
    color: "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400",
  },
  {
    id: "available",
    name: "Available",
    icon: Clock,
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400",
  },
  {
    id: "on-leave",
    name: "On Leave",
    icon: XCircle,
    color: "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400",
  },
];

export default function GuardManagement({ handleGuardRowClick }) {
  const [activeCategory, setActiveCategory] = useState(GUARD_CATEGORIES[0]);
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // ✅ SINGLE DIALOG STATE FOR BOTH ADD AND EDIT
  const [isGuardDialogOpen, setIsGuardDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [editingGuard, setEditingGuard] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ SINGLE FORM STATE
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

  // ✅ ADD GUARD HANDLER - RESET FORM ADD KARO
  const handleAddGuard = () => {
    setDialogMode('add');
    resetForm(); // ✅ YEH LINE ADD KARO - FORM EMPTY KAREGA
    setIsGuardDialogOpen(true);
  };

  // ✅ EDIT GUARD HANDLER
  const handleEditGuard = (guard) => {
    setDialogMode('edit');
    setEditingGuard(guard);
    
    // Form data ko guard ki current values se fill karo
    setFormData({
      name: guard.name || "",
      email: guard.email || "",
      phone: guard.phone || "",
      emergencyContact: guard.emergencyContact || "",
      gender: guard.gender || "",
      dateOfBirth: guard.dateOfBirth || "",
      address: guard.address || "",
      type: guard.type || "",
      experience: guard.experience || "",
      salary: guard.salary || "",
      location: guard.location || "",
      specialization: guard.specialization?.join(', ') || "",
      certifications: guard.certifications?.join(', ') || "",
    });
    
    setIsGuardDialogOpen(true);
  };

  // ✅ SINGLE FORM SUBMIT HANDLER FOR BOTH ADD AND EDIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Process specialization and certifications into arrays
      const submissionData = {
        ...formData,
        specialization: formData.specialization
          ? formData.specialization.split(',').map(s => s.trim()).filter(s => s)
          : [],
        certifications: formData.certifications
          ? formData.certifications.split(',').map(s => s.trim()).filter(s => s)
          : [],
      };

      let response;
      if (dialogMode === 'add') {
        // ADD GUARD API CALL
        response = await fetch("/api/auth/guard/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        });
      } else {
        // EDIT GUARD API CALL
        response = await fetch(`/api/auth/guard/${editingGuard._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        });
      }

      const result = await response.json();

      if (response.ok) {
        const successMessage = dialogMode === 'add' 
          ? "Guard registered successfully!" 
          : "Guard updated successfully!";
        
        showSuccess(result.message || successMessage);
        setIsGuardDialogOpen(false);
        resetForm();
        setEditingGuard(null);
        loadData(); // Refresh the list
      } else {
        const errorMessage = dialogMode === 'add'
          ? "Failed to register guard"
          : "Failed to update guard";
        showError(result.error || errorMessage);
      }
    } catch (error) {
      console.error(`Error ${dialogMode === 'add' ? 'registering' : 'updating'} guard:`, error);
      const errorMessage = dialogMode === 'add'
        ? "Failed to register guard"
        : "Failed to update guard";
      showError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ FORM INPUT CHANGE HANDLER
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ RESET FORM
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

  // ✅ DIALOG CLOSE HANDLER
  const handleDialogClose = () => {
    setIsGuardDialogOpen(false);
    setEditingGuard(null);
    resetForm();
  };

  // Refs
  const searchInputRef = useRef(null);

  // Effects
  useEffect(() => {
    if (document.activeElement !== searchInputRef.current && searchQuery !== "") {
      searchInputRef.current?.focus();
    }
  }, [searchQuery]);

  useEffect(() => {
    loadData();
  }, [activeCategory]);

  // Data Management
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/guard");
      const result = await response.json();

      if (response.ok) {
        setGuards(result.guards || []);
      } else {
        showError(result.error || "Failed to fetch guards");
      }
    } catch (error) {
      console.error("Error fetching guards:", error);
      showError("Failed to fetch guards");
    } finally {
      setLoading(false);
    }
  };

  // Filter guards based on active category
  const getFilteredGuards = () => {
    let filtered = guards;

    // Filter by category
    if (activeCategory.id === "assigned") {
      filtered = filtered.filter((guard) => guard.status === "Assigned");
    } else if (activeCategory.id === "available") {
      filtered = filtered.filter((guard) => guard.status === "Available");
    } else if (activeCategory.id === "on-leave") {
      filtered = filtered.filter((guard) => guard.status === "On Leave");
    }

    // Then apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (guard) =>
          guard.name?.toLowerCase().includes(searchLower) ||
          guard.email?.toLowerCase().includes(searchLower) ||
          guard.guardId?.toLowerCase().includes(searchLower) ||
          guard.type?.toLowerCase().includes(searchLower) ||
          guard.location?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const filteredItems = getFilteredGuards();

  const showError = (message) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const showSuccess = (message) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  // Stats calculation
  const getStatsData = () => {
    const totalGuards = guards.length;
    const assignedGuards = guards.filter((guard) => guard.status === "Assigned").length;
    const availableGuards = guards.filter((guard) => guard.status === "Available").length;
    const onLeaveGuards = guards.filter((guard) => guard.status === "On Leave").length;

    return {
      totalGuards,
      assignedGuards,
      availableGuards,
      onLeaveGuards,
    };
  };

  const statsData = getStatsData();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <HeaderSection />

        {/* Stats Cards */}
        <StatsCards
          activeCategory={activeCategory}
          statsData={statsData}
          loading={loading}
        />

        {/* Category Tabs */}
        <CategoryTabs
          categories={GUARD_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Action Bar */}
        <ActionBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          searchInputRef={searchInputRef}
          onRefresh={loadData}
          onAddGuard={handleAddGuard}
        />

        {/* Content Table */}
        <ContentTable
          activeCategory={activeCategory}
          filteredItems={filteredItems}
          loading={loading}
          onGuardClick={handleGuardRowClick}
          statsData={statsData}
          onEditGuard={handleEditGuard}
        />

        {/* ✅ SINGLE DIALOG FOR BOTH ADD AND EDIT */}
        <Dialog open={isGuardDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {dialogMode === 'add' ? 'Add New Security Guard' : `Edit Security Guard - ${editingGuard?.name}`}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === 'add' 
                  ? 'Create a new guard profile with complete details.' 
                  : 'Update guard profile details.'}
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
                    onChange={(e) => handleInputChange("name", e.target.value)}
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
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="guardEmergencyContact" className="text-sm font-medium">
                    Emergency Contact
                  </Label>
                  <Input
                    id="guardEmergencyContact"
                    placeholder="+91 87654 32109"
                    className="border-primary/20 focus:border-primary"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="guardGender" className="text-sm font-medium">
                    Gender *
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
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
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
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
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger className="border-primary/20 focus:border-primary">
                      <SelectValue placeholder="Select Guard Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Security Guard">Security Guard</SelectItem>
                      <SelectItem value="Security Officer">Security Officer</SelectItem>
                      <SelectItem value="Personal Security Officer">Personal Security Officer</SelectItem>
                      <SelectItem value="Security Supervisor">Security Supervisor</SelectItem>
                      <SelectItem value="Lady Security Guard">Lady Security Guard</SelectItem>
                      <SelectItem value="Security Gunmen">Security Gunmen</SelectItem>
                      <SelectItem value="Ex-men Security Guard & Bodyguards">Ex-men Security Guard & Bodyguards</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="guardExperience" className="text-sm font-medium">
                    Experience (Years) *
                  </Label>
                  <Input
                    id="guardExperience"
                    type="number"
                    placeholder="5"
                    className="border-primary/20 focus:border-primary"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="guardSalary" className="text-sm font-medium">
                    Monthly Salary *
                  </Label>
                  <Input
                    id="guardSalary"
                    placeholder="₹35,000"
                    className="border-primary/20 focus:border-primary"
                    value={formData.salary}
                    onChange={(e) => handleInputChange("salary", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="guardLocation" className="text-sm font-medium">
                    Location *
                  </Label>
                  <Input
                    id="guardLocation"
                    placeholder="Mumbai"
                    className="border-primary/20 focus:border-primary"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="guardAddress" className="text-sm font-medium">
                    Address *
                  </Label>
                  <Textarea
                    id="guardAddress"
                    placeholder="Complete residential address..."
                    className="border-primary/20 focus:border-primary min-h-[80px]"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>

                {/* Specialization Input */}
                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="guardSpecialization" className="text-sm font-medium">
                    Specializations (comma separated)
                  </Label>
                  <Input
                    id="guardSpecialization"
                    placeholder="Crowd Control, Executive Protection, Emergency Response"
                    className="border-primary/20 focus:border-primary"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange("specialization", e.target.value)}
                  />
                </div>

                {/* Certifications Input */}
                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="guardCertifications" className="text-sm font-medium">
                    Certifications (comma separated)
                  </Label>
                  <Input
                    id="guardCertifications"
                    placeholder="CPR Certified, Security License, Firearms Permit"
                    className="border-primary/20 focus:border-primary"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange("certifications", e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
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
                  ) : dialogMode === 'add' ? (
                    <Plus className="h-4 w-4 mr-2" />
                  ) : (
                    <Edit2 className="h-4 w-4 mr-2" />
                  )}
                  {submitting 
                    ? (dialogMode === 'add' ? "Adding..." : "Updating...") 
                    : (dialogMode === 'add' ? "Add Guard" : "Update Guard")
                  }
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Header Section Component
const HeaderSection = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
        Guard Management
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Manage security personnel, assignments, and availability
      </p>
    </div>
    <div className="p-3 bg-primary/10 rounded-lg self-start sm:self-auto">
      <Shield className="h-6 w-6 text-primary" />
    </div>
  </div>
);