// File: src/components/admin/ClientManagement.jsx - COMPLETELY FIXED VERSION
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
  Edit,
  User,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  Building,
  MapPin,
  Users,
  Loader2,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function ClientManagement({
  guardSearch,
  handleGuardSearch,
  selectedGuards,
  toggleGuardSelection,
  handleClientRowClick,
}) {
  const { hasPermission } = useAuth(); // Import auth hook
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientTypeFilter, setClientTypeFilter] = useState("all");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial form state - SIMPLIFIED AND FIXED
  const initialFormData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    alternatePhone: "",
    clientType: "Corporate",
    companyName: "",
    designation: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
    securityPlan: "Standard",
    serviceType: "",
    contractStartDate: "",
    contractEndDate: "",
    contractValue: "",
    sites: [
      {
        siteName: "",
        address: "",
        contactPerson: "",
        contactNumber: "",
      },
    ],
    emergencyContacts: [
      {
        name: "",
        relationship: "",
        phone: "",
      },
    ],
    requiredGuards: {
      male: 0,
      female: 0,
      total: 0,
    },
    equipmentRequired: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  // Add these states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const handleEditClick = async (client) => {
    try {
      setEditingClient(client);

      // Get address data safely
      const address = client.address || {};
      const sites = client.sites || [];
      const emergencyContacts = client.emergencyContacts || [];
      const serviceType = client.serviceType || [];
      const equipmentRequired = client.equipmentRequired || [];
      const requiredGuards = client.requiredGuards || {
        male: 0,
        female: 0,
        total: 0,
      };

      setEditFormData({
        // Basic Information
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        alternatePhone: client.alternatePhone || "",

        // Client Information
        clientType: client.clientType || "Corporate",
        companyName: client.companyName || "",
        designation: client.designation || "",

        // Address Information
        address: {
          street: address.street || "",
          city: address.city || "",
          state: address.state || "",
          postalCode: address.postalCode || "",
          country: address.country || "India",
        },

        // Service Information
        securityPlan: client.securityPlan || "Standard",
        serviceType: serviceType[0] || "",

        // Contract Information
        contractStartDate: client.contractStartDate
          ? new Date(client.contractStartDate).toISOString().split("T")[0]
          : "",
        contractEndDate: client.contractEndDate
          ? new Date(client.contractEndDate).toISOString().split("T")[0]
          : "",
        contractValue: client.contractValue || 0,

        // Site Information (ensure it's an array)
        sites:
          sites.length > 0
            ? sites
            : [
              {
                siteName: "",
                address: "",
                contactPerson: "",
                contactNumber: "",
              },
            ],

        // Security Requirements
        requiredGuards: requiredGuards,

        // Equipment
        equipmentRequired: equipmentRequired[0] || "",

        // Emergency Contact (ensure it's an array)
        emergencyContacts:
          emergencyContacts.length > 0
            ? emergencyContacts
            : [
              {
                name: "",
                relationship: "",
                phone: "",
              },
            ],

        // Notes
        notes: client.notes || "",
      });

      setEditDialogOpen(true);
    } catch (error) {
      console.error("Error preparing edit form:", error);
      toast.error("Error loading client data");
    }
  };

  // Function to update client
  const handleUpdateClient = async (event) => {
    event.preventDefault();

    if (!editingClient) return;

    setIsEditSubmitting(true);

    try {
      // Prepare update data (without password)
      const updateData = {
        name: editFormData.name,
        phone: editFormData.phone,
        alternatePhone: editFormData.alternatePhone,
        clientType: editFormData.clientType,
        companyName: editFormData.companyName,
        designation: editFormData.designation,
        address: editFormData.address,
        securityPlan: editFormData.securityPlan,
        serviceType: editFormData.serviceType ? [editFormData.serviceType] : [],
        contractStartDate: editFormData.contractStartDate,
        contractEndDate: editFormData.contractEndDate,
        contractValue: parseFloat(editFormData.contractValue) || 0,
        sites: [editFormData.sites],
        emergencyContacts: [editFormData.emergencyContacts],
        requiredGuards: editFormData.requiredGuards,
        equipmentRequired: editFormData.equipmentRequired
          ? [editFormData.equipmentRequired]
          : [],
        notes: editFormData.notes,
      };

      const response = await fetch(`/api/auth/client/${editingClient._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Client updated successfully!");
        await fetchClients(); // Refresh the list
        setEditDialogOpen(false);
        setEditingClient(null);
      } else {
        toast.error(result.error || "Failed to update client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Error updating client");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // ✅ DELETE CLIENT HANDLER
  const handleDeleteClient = async (client) => {
    if (!confirm(`Are you sure you want to delete ${client.name}? This will also unassign their guards.`)) return;

    try {
      const response = await fetch(`/api/auth/client/${client._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Client deleted successfully");
        fetchClients(); // Refresh list
      } else {
        toast.error(result.error || "Failed to delete client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Error deleting client");
    }
  };
  // Service types options
  const serviceTypeOptions = [
    { value: "Static Guarding", label: "Static Guarding" },
    { value: "Patrolling", label: "Patrolling" },
    { value: "CCTV Monitoring", label: "CCTV Monitoring" },
    { value: "Event Security", label: "Event Security" },
    { value: "VIP Protection", label: "VIP Protection" },
    { value: "Asset Protection", label: "Asset Protection" },
  ];

  // Equipment options
  const equipmentOptions = [
    { value: "Walkie Talkie", label: "Walkie Talkie" },
    { value: "CCTV", label: "CCTV" },
    { value: "Metal Detector", label: "Metal Detector" },
    { value: "Fire Extinguisher", label: "Fire Extinguisher" },
    { value: "First Aid", label: "First Aid Kit" },
    { value: "Vehicle", label: "Security Vehicle" },
  ];

  // Fetch clients from API
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/client");
      const data = await response.json();

      console.log("📋 API Response:", data);

      if (response.ok) {
        // The API already returns only clients, no need to filter
        setClients(data.clients || []);
        console.log(`✅ Loaded ${data.clients?.length || 0} clients`);
      } else {
        setClients([]);
        toast.error("Failed to load clients");
      }
    } catch (error) {
      console.error("❌ Error fetching clients:", error);
      setClients([]);
      toast.error("Error loading clients");
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
        client.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.address &&
        client.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;

    const matchesClientType =
      clientTypeFilter === "all" || client.clientType === clientTypeFilter;

    return matchesSearch && matchesStatus && matchesClientType;
  });

  // Get total required guards
  const getTotalRequiredGuards = () => {
    return clients.reduce((total, client) => {
      return total + (client.requiredGuards?.total || 0);
    }, 0);
  };

  // Get total assigned guards
  const getTotalAssignedGuards = () => {
    return clients.reduce((total, client) => {
      return total + (client.assignedGuards?.length || 0);
    }, 0);
  };

  // Get total contract value
  const getTotalContractValue = () => {
    return clients.reduce((total, client) => {
      return total + (client.contractValue || 0);
    }, 0);
  };

  // Status badge helpers
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

  // Handle form input changes - SIMPLIFIED VERSION
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Handle simple fields
    if (!name.includes(".")) {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseInt(value) || 0 : value,
      }));
      return;
    }

    // Handle nested fields with dot notation
    const keys = name.split(".");

    setFormData((prev) => {
      const newState = { ...prev };
      let current = newState;

      // Navigate to the nested level
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        // Handle array indices
        if (!isNaN(keys[i + 1])) {
          const index = parseInt(keys[i + 1]);
          if (!current[key] || !Array.isArray(current[key])) {
            current[key] = [];
          }
          if (!current[key][index]) {
            current[key][index] = {};
          }
          current = current[key][index];
          i++; // Skip the index key since we already handled it
        } else {
          if (!current[key] || typeof current[key] !== "object") {
            current[key] = {};
          }
          current = current[key];
        }
      }

      // Set the value
      const lastKey = keys[keys.length - 1];
      current[lastKey] = type === "number" ? parseInt(value) || 0 : value;

      return newState;
    });
  };

  // Alternative method for simpler cases
  const handleSimpleNestedChange = (fieldPath, value) => {
    const keys = fieldPath.split(".");

    setFormData((prev) => {
      if (keys.length === 1) {
        return { ...prev, [keys[0]]: value };
      }

      if (keys.length === 2) {
        if (keys[0] === "requiredGuards") {
          return {
            ...prev,
            requiredGuards: {
              ...prev.requiredGuards,
              [keys[1]]: parseInt(value) || 0,
            },
          };
        }

        if (keys[0] === "address") {
          return {
            ...prev,
            address: {
              ...prev.address,
              [keys[1]]: value,
            },
          };
        }
      }

      if (keys.length === 3 && keys[0] === "sites" && keys[1] === "0") {
        return {
          ...prev,
          sites: [
            {
              ...prev.sites[0],
              [keys[2]]: value,
            },
          ],
        };
      }

      if (
        keys.length === 3 &&
        keys[0] === "emergencyContacts" &&
        keys[1] === "0"
      ) {
        return {
          ...prev,
          emergencyContacts: [
            {
              ...prev.emergencyContacts[0],
              [keys[2]]: value,
            },
          ],
        };
      }

      return prev;
    });
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
  };

  // Submit client registration
  const handleClientSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Name, email and password are required");
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare client data
      const clientData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        clientType: formData.clientType,
        companyName: formData.companyName,
        designation: formData.designation,
        address: formData.address,
        securityPlan: formData.securityPlan,
        serviceType: formData.serviceType ? [formData.serviceType] : [],
        contractStartDate: formData.contractStartDate,
        contractEndDate: formData.contractEndDate,
        contractValue: formData.contractValue
          ? parseFloat(formData.contractValue)
          : 0,
        sites: formData.sites,
        emergencyContacts: formData.emergencyContacts,
        requiredGuards: formData.requiredGuards,
        equipmentRequired: formData.equipmentRequired
          ? [formData.equipmentRequired]
          : [],
        notes: formData.notes,
        roleName: "Client",
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Client registered successfully!");
        await fetchClients();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [loadingToggle, setLoadingToggle] = useState(null);

  // Update toggle function
  const toggleClientStatus = async (clientId, currentStatus) => {
    const action =
      currentStatus === "Disabled" || currentStatus === "Disabled"
        ? "enable"
        : "disable";
    const confirmMessage =
      action === "disable"
        ? "Are you sure you want to disable this client? They won't be able to login until enabled."
        : "Are you sure you want to enable this client?";

    if (!confirm(confirmMessage)) return;

    setLoadingToggle(clientId);

    try {
      const response = await fetch(
        `/api/auth/client/${clientId}/toggle-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        await fetchClients(); // Refresh list
      } else {
        toast.error(data.error || "Failed to update client status");
      }
    } catch (error) {
      console.error("Error toggling client status:", error);
      toast.error("Error updating client status");
    } finally {
      setLoadingToggle(null);
    }
  };

  // Add these functions for edit form

  // Handle simple input changes for edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle nested changes for edit form
  const handleEditNestedChange = (fieldPath, value) => {
    const keys = fieldPath.split(".");

    setEditFormData((prev) => {
      const newData = { ...prev };
      let current = newData;

      // Navigate to the nested level
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        // Check if next key is array index
        if (!isNaN(keys[i + 1])) {
          // Ensure current[key] is an array
          if (!current[key] || !Array.isArray(current[key])) {
            current[key] = [];
          }

          const index = parseInt(keys[i + 1]);
          // Ensure the index exists
          if (!current[key][index]) {
            current[key][index] = {};
          }

          current = current[key][index];
          i++; // Skip the index since we handled it
        } else {
          // Handle nested object
          if (!current[key] || typeof current[key] !== "object") {
            current[key] = {};
          }
          current = current[key];
        }
      }

      // Set the value
      const lastKey = keys[keys.length - 1];
      current[lastKey] = value;

      return newData;
    });
  };

  // Handle select changes for edit form
  const handleEditSelectChange = (name, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading clients...</p>
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
            Manage client accounts, security assignments, and contracts
          </p>
        </div>
        <div className="flex gap-2">
          {hasPermission("clients-create") && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription>
                    Create a new client account with complete security setup
                  </DialogDescription>
                </DialogHeader>

                {/* FORM START - USING SIMPLIFIED HANDLERS */}
                <form onSubmit={handleClientSubmit} className="grid gap-6 py-4">
                  {/* Basic Information */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Smith"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        required
                        minLength="6"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        required
                        minLength="6"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alternatePhone">Alternate Phone (Optional)</Label>
                      <Input
                        id="alternatePhone"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543211"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="grid gap-4">
                    <h3 className="text-lg font-semibold">Address Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address.street">Full Address *</Label>
                        <Textarea
                          id="address.street"
                          name="address.street"
                          value={formData.address.street}
                          onChange={(e) =>
                            handleSimpleNestedChange(
                              "address.street",
                              e.target.value
                            )
                          }
                          placeholder="Street, Building, Area..."
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address.city">City *</Label>
                        <Input
                          id="address.city"
                          name="address.city"
                          value={formData.address.city}
                          onChange={(e) =>
                            handleSimpleNestedChange(
                              "address.city",
                              e.target.value
                            )
                          }
                          placeholder="Mumbai"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address.postalCode">Pin Code (Optional)</Label>
                        <Input
                          id="address.postalCode"
                          name="address.postalCode"
                          value={formData.address.postalCode}
                          onChange={(e) =>
                            handleSimpleNestedChange(
                              "address.postalCode",
                              e.target.value
                            )
                          }
                          placeholder="400001"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                      className="cursor-pointer"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Client Account
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Client: {editingClient?.name}</DialogTitle>
              <DialogDescription>
                Update client information and security setup
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateClient} className="grid gap-6 py-4">
              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editFormData?.name || ""}
                    onChange={handleEditInputChange}
                    placeholder="John Smith"
                    required
                    disabled={isEditSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address *</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={editFormData?.email || ""}
                    onChange={handleEditInputChange}
                    placeholder="john@example.com"
                    required
                    disabled={isEditSubmitting}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number *</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    value={editFormData?.phone || ""}
                    onChange={handleEditInputChange}
                    placeholder="+91 9876543210"
                    required
                    disabled={isEditSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-alternatePhone">Alternate Phone (Optional)</Label>
                  <Input
                    id="edit-alternatePhone"
                    name="alternatePhone"
                    value={editFormData?.alternatePhone || ""}
                    onChange={handleEditInputChange}
                    placeholder="+91 9876543211"
                    disabled={isEditSubmitting}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Address Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-address.street">Full Address *</Label>
                    <Textarea
                      id="edit-address.street"
                      value={editFormData?.address?.street || ""}
                      onChange={(e) =>
                        handleEditNestedChange(
                          "address.street",
                          e.target.value
                        )
                      }
                      placeholder="Street, Building, Area..."
                      required
                      disabled={isEditSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-address.city">City *</Label>
                    <Input
                      id="edit-address.city"
                      value={editFormData?.address?.city || ""}
                      onChange={(e) =>
                        handleEditNestedChange(
                          "address.city",
                          e.target.value
                        )
                      }
                      placeholder="Mumbai"
                      required
                      disabled={isEditSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-address.postalCode">Pin Code (Optional)</Label>
                    <Input
                      id="edit-address.postalCode"
                      value={editFormData?.address?.postalCode || ""}
                      onChange={(e) =>
                        handleEditNestedChange(
                          "address.postalCode",
                          e.target.value
                        )
                      }
                      placeholder="400001"
                      disabled={isEditSubmitting}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setEditingClient(null);
                  }}
                  disabled={isEditSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={isEditSubmitting}
                >
                  {isEditSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Client"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Clients
                </p>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredClients.length} filtered
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Clients
                </p>
                <p className="text-2xl font-bold">
                  {clients.filter((c) => c.status === "Active").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {clients.filter((c) => c.status !== "Active").length} inactive
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Corporate Clients
                </p>
                <p className="text-2xl font-bold">
                  {clients.filter((c) => c.clientType === "Corporate").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {clients.filter((c) => c.clientType !== "Corporate").length}{" "}
                  other types
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Guards Required
                </p>
                <p className="text-2xl font-bold">{getTotalRequiredGuards()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getTotalAssignedGuards()} assigned
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <CardTitle>Client Directory</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center space-x-2 w-full sm:w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Client</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[180px]">
                    Contact
                  </TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[150px]">
                    Address
                  </TableHead>
                  <TableHead className="text-center min-w-[100px]">
                    Status
                  </TableHead>

                  <TableHead className="2xl:table-cell min-w-[100px]">
                    Login
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow
                    key={client._id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleClientRowClick(client._id)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {client.avatar ? (
                            <div className="text-primary font-medium">
                              {client.avatar}
                            </div>
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {client.name}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {client.companyName || "No company"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm truncate">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm truncate">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {client.phone || "N/A"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {client.address || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge
                          variant={getStatusVariant(client.status)}
                          className="flex items-center gap-1 px-2 py-1"
                        >
                          {getStatusIcon(client.status)}
                          <span className="truncate">{client.status}</span>
                        </Badge>
                      </div>
                    </TableCell>


                    <TableCell>
                      <div className="flex items-center justify-end">
                        <div className="relative">
                          <div
                            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-200 ${loadingToggle === client._id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                              } ${client.status === "Disabled" || !client.isActive
                                ? "bg-gray-300 hover:bg-gray-400"
                                : "bg-green-500 hover:bg-green-600"
                              }`}
                            onClick={(e) => {
                              if (loadingToggle === client._id) return;
                              e.stopPropagation();
                              toggleClientStatus(client._id, client.status);
                            }}
                            title={
                              client.status === "Disabled" || !client.isActive
                                ? "Enable Client Login"
                                : "Disable Client Login"
                            }
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${client.status === "Disabled" || !client.isActive
                                ? "translate-x-0.5"
                                : "translate-x-6"
                                } ${loadingToggle === client._id ? "opacity-70" : ""
                                }`}
                            />
                            {/* Loading indicator */}
                            {loadingToggle === client._id && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              </div>
                            )}
                          </div>
                          {/* Status text */}
                          <div className="mt-1 text-xs text-center text-muted-foreground">
                            {client.status === "Disabled" || !client.isActive
                              ? "Off"
                              : "On"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 cursor-pointer w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClientRowClick(client._id);
                          }}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 cursor-pointer w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(client);
                          }}
                          title="Edit Client"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 cursor-pointer w-8 p-0 text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client);
                          }}
                          title="Delete Client"
                        >
                          <Trash2 className="h-4 w-4" />
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
              {clients.length === 0 ? (
                <>
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No clients registered yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Add your first client using the button above.
                  </p>
                  <Button
                    className="cursor-pointer"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Client
                  </Button>
                </>
              ) : (
                <>
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No clients found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </>
              )}
            </div>
          )}

          {/* Total count footer */}
          {filteredClients.length > 0 && (
            <div className="border-t p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {filteredClients.length} of {clients.length} clients
                </span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <Shield className="h-3 w-3" />
                    {getTotalAssignedGuards()} guards assigned
                  </span>
                  <span className="flex items-center gap-2">
                    <Building className="h-3 w-3" />
                    {
                      clients.filter((c) => c.clientType === "Corporate").length
                    }{" "}
                    corporate
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div >
  );
}
