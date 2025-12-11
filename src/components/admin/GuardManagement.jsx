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
    phone2: "",
    address: "",
    codeNumber: "",
    gender: "",
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
      phone2: guard.phone2 || "",
      codeNumber: guard.guardId || "", // Map guardId to codeNumber
      gender: guard.gender || "",
      address: guard.address || "",
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

  // ✅ DELETE GUARD HANDLER
  const handleDeleteGuard = async (guard) => {
    if (!confirm(`Are you sure you want to delete ${guard.name}?`)) return;

    try {
      const response = await fetch(`/api/auth/guard/${guard._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || "Guard deleted successfully");
        loadData(); // Refresh list
      } else {
        showError(result.error || "Failed to delete guard");
      }
    } catch (error) {
      console.error("Error deleting guard:", error);
      showError("Failed to delete guard");
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
      phone2: "",
      codeNumber: "",
      gender: "",
      address: "",
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
          onDeleteGuard={handleDeleteGuard} // ✅ Pass delete handler
        />

        {/* ✅ SINGLE DIALOG FOR BOTH ADD AND EDIT */}
        <Dialog open={isGuardDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {dialogMode === "add"
                  ? "Add New Security Guard"
                  : `Edit Security Guard - ${editingGuard?.name}`}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "add"
                  ? "Create a new guard profile with complete details."
                  : "Update guard profile details."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4 grid-cols-1 md:grid-cols-2">
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Basic Information
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
                    Phone Number 1 *
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
                    Phone Number 2 (Optional)
                  </Label>
                  <Input
                    id="guardPhone2"
                    placeholder="+91 87654 32109"
                    className="border-primary/20 focus:border-primary"
                    value={formData.phone2} // Fallback for transition
                    onChange={(e) =>
                      handleInputChange("phone2", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="guardGender" className="text-sm font-medium">
                    Gender (Optional)
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
                  <Label
                    htmlFor="guardCodeNumber"
                    className="text-sm font-medium"
                  >
                    Code Number *
                  </Label>
                  <Input
                    id="guardCodeNumber"
                    placeholder="e.g. 007"
                    className="border-primary/20 focus:border-primary"
                    value={formData.codeNumber}
                    onChange={(e) =>
                      handleInputChange("codeNumber", e.target.value)
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be used as the Guard ID.
                  </p>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="guardAddress" className="text-sm font-medium">
                    Address (Optional)
                  </Label>
                  <Textarea
                    id="guardAddress"
                    placeholder="Complete residential address..."
                    className="border-primary/20 focus:border-primary min-h-[80px]"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
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
                  permission={
                    dialogMode === "add" ? "guards-create" : "guards-update"
                  }
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : dialogMode === "add" ? (
                    <Plus className="h-4 w-4 mr-2" />
                  ) : (
                    <Edit2 className="h-4 w-4 mr-2" />
                  )}
                  {submitting
                    ? dialogMode === "add"
                      ? "Adding..."
                      : "Updating..."
                    : dialogMode === "add"
                      ? "Add Guard"
                      : "Update Guard"}
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