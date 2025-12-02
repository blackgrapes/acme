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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ClientManagement({
  guardSearch,
  handleGuardSearch,
  selectedGuards,
  toggleGuardSelection,
  handleClientRowClick,
}) {
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
      country: "India"
    },
    securityPlan: "Standard",
    serviceType: "",
    contractStartDate: "",
    contractEndDate: "",
    contractValue: "",
    sites: [{
      siteName: "",
      address: "",
      contactPerson: "",
      contactNumber: "",
    }],
    emergencyContacts: [{
      name: "",
      relationship: "",
      phone: "",
    }],
    requiredGuards: {
      male: 0,
      female: 0,
      total: 0
    },
    equipmentRequired: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // Service types options
  const serviceTypeOptions = [
    { value: "Static Guarding", label: "Static Guarding" },
    { value: "Patrolling", label: "Patrolling" },
    { value: "CCTV Monitoring", label: "CCTV Monitoring" },
    { value: "Event Security", label: "Event Security" },
    { value: "VIP Protection", label: "VIP Protection" },
    { value: "Asset Protection", label: "Asset Protection" }
  ];

  // Equipment options
  const equipmentOptions = [
    { value: "Walkie Talkie", label: "Walkie Talkie" },
    { value: "CCTV", label: "CCTV" },
    { value: "Metal Detector", label: "Metal Detector" },
    { value: "Fire Extinguisher", label: "Fire Extinguisher" },
    { value: "First Aid", label: "First Aid Kit" },
    { value: "Vehicle", label: "Security Vehicle" }
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

  // // Filter clients
  // const filteredClients = clients.filter((client) => {
  //   const matchesSearch =
  //     client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     (client.companyName &&
  //       client.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
  //     (client.address?.city &&
  //       client.address.city.toLowerCase().includes(searchQuery.toLowerCase()));

  //   const matchesStatus =
  //     statusFilter === "all" || client.status === statusFilter;
  //   const matchesClientType =
  //     clientTypeFilter === "all" || client.clientType === clientTypeFilter;

  //   return matchesSearch && matchesStatus && matchesClientType;
  // });

  // // Status badge helpers
  // const getStatusIcon = (status) => {
  //   switch (status) {
  //     case "Active":
  //       return <CheckCircle className="h-3 w-3" />;
  //     case "Pending":
  //       return <Clock className="h-3 w-3" />;
  //     case "Inactive":
  //       return <XCircle className="h-3 w-3" />;
  //     default:
  //       return <Shield className="h-3 w-3" />;
  //   }
  // };

  // const getStatusVariant = (status) => {
  //   switch (status) {
  //     case "Active":
  //       return "default";
  //     case "Pending":
  //       return "secondary";
  //     case "Inactive":
  //       return "outline";
  //     default:
  //       return "secondary";
  //   }
  // };

  // ✅ FIXED: Handle form input changes - SIMPLIFIED VERSION
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    // Handle simple fields
    if (!name.includes('.')) {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) || 0 : value
      }));
      return;
    }

    // Handle nested fields with dot notation
    const keys = name.split('.');
    
    setFormData(prev => {
      const newState = { ...prev };
      let current = newState;
      
      // Navigate to the nested level
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        
        // Handle array indices
        if (!isNaN(keys[i+1])) {
          const index = parseInt(keys[i+1]);
          if (!current[key] || !Array.isArray(current[key])) {
            current[key] = [];
          }
          if (!current[key][index]) {
            current[key][index] = {};
          }
          current = current[key][index];
          i++; // Skip the index key since we already handled it
        } else {
          if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
          }
          current = current[key];
        }
      }
      
      // Set the value
      const lastKey = keys[keys.length - 1];
      current[lastKey] = type === 'number' ? parseInt(value) || 0 : value;
      
      return newState;
    });
  };

  // ✅ FIXED: Alternative method for simpler cases
  const handleSimpleNestedChange = (fieldPath, value) => {
    const keys = fieldPath.split('.');
    
    setFormData(prev => {
      if (keys.length === 1) {
        return { ...prev, [keys[0]]: value };
      }
      
      if (keys.length === 2) {
        if (keys[0] === 'requiredGuards') {
          return {
            ...prev,
            requiredGuards: {
              ...prev.requiredGuards,
              [keys[1]]: parseInt(value) || 0
            }
          };
        }
        
        if (keys[0] === 'address') {
          return {
            ...prev,
            address: {
              ...prev.address,
              [keys[1]]: value
            }
          };
        }
      }
      
      if (keys.length === 3 && keys[0] === 'sites' && keys[1] === '0') {
        return {
          ...prev,
          sites: [{
            ...prev.sites[0],
            [keys[2]]: value
          }]
        };
      }
      
      if (keys.length === 3 && keys[0] === 'emergencyContacts' && keys[1] === '0') {
        return {
          ...prev,
          emergencyContacts: [{
            ...prev.emergencyContacts[0],
            [keys[2]]: value
          }]
        };
      }
      
      return prev;
    });
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        contractValue: formData.contractValue ? parseFloat(formData.contractValue) : 0,
        sites: formData.sites,
        emergencyContacts: formData.emergencyContacts,
        requiredGuards: formData.requiredGuards,
        equipmentRequired: formData.equipmentRequired ? [formData.equipmentRequired] : [],
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

  // // Get total required guards
  // const getTotalRequiredGuards = () => {
  //   return clients.reduce((total, client) => {
  //     return total + (client.requiredGuards?.total || 0);
  //   }, 0);
  // };

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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
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

                {/* Client Information */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="clientType">Client Type</Label>
                    <Select
                      value={formData.clientType}
                      onValueChange={(value) => handleSelectChange('clientType', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="ABC Corporation"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="Security Manager"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Address Information - FIXED */}
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Address Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="address.street">Street Address</Label>
                      <Input
                        id="address.street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={(e) => handleSimpleNestedChange('address.street', e.target.value)}
                        placeholder="123 Main Street"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address.city">City</Label>
                      <Input
                        id="address.city"
                        name="address.city"
                        value={formData.address.city}
                        onChange={(e) => handleSimpleNestedChange('address.city', e.target.value)}
                        placeholder="Mumbai"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address.state">State</Label>
                      <Input
                        id="address.state"
                        name="address.state"
                        value={formData.address.state}
                        onChange={(e) => handleSimpleNestedChange('address.state', e.target.value)}
                        placeholder="Maharashtra"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address.postalCode">Postal Code</Label>
                      <Input
                        id="address.postalCode"
                        name="address.postalCode"
                        value={formData.address.postalCode}
                        onChange={(e) => handleSimpleNestedChange('address.postalCode', e.target.value)}
                        placeholder="400001"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Service Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="securityPlan">Security Plan</Label>
                      <Select
                        value={formData.securityPlan}
                        onValueChange={(value) => handleSelectChange('securityPlan', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Basic">Basic</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                          <SelectItem value="Enterprise">Enterprise</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Service Type</Label>
                      <Select
                        value={formData.serviceType}
                        onValueChange={(value) => handleSelectChange('serviceType', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Contract Information */}
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Contract Information</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="contractStartDate">Start Date</Label>
                      <Input
                        id="contractStartDate"
                        name="contractStartDate"
                        type="date"
                        value={formData.contractStartDate}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contractEndDate">End Date</Label>
                      <Input
                        id="contractEndDate"
                        name="contractEndDate"
                        type="date"
                        value={formData.contractEndDate}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contractValue">Contract Value (₹)</Label>
                      <Input
                        id="contractValue"
                        name="contractValue"
                        type="number"
                        value={formData.contractValue}
                        onChange={handleInputChange}
                        placeholder="50000"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Site Information - FIXED */}
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Site Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        name="sites.0.siteName"
                        value={formData.sites[0]?.siteName || ""}
                        onChange={(e) => handleSimpleNestedChange('sites.0.siteName', e.target.value)}
                        placeholder="Head Office"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="siteAddress">Site Address</Label>
                      <Input
                        id="siteAddress"
                        name="sites.0.address"
                        value={formData.sites[0]?.address || ""}
                        onChange={(e) => handleSimpleNestedChange('sites.0.address', e.target.value)}
                        placeholder="Site full address"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="siteContactPerson">Contact Person</Label>
                      <Input
                        id="siteContactPerson"
                        name="sites.0.contactPerson"
                        value={formData.sites[0]?.contactPerson || ""}
                        onChange={(e) => handleSimpleNestedChange('sites.0.contactPerson', e.target.value)}
                        placeholder="Site Manager"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="siteContactNumber">Contact Number</Label>
                      <Input
                        id="siteContactNumber"
                        name="sites.0.contactNumber"
                        value={formData.sites[0]?.contactNumber || ""}
                        onChange={(e) => handleSimpleNestedChange('sites.0.contactNumber', e.target.value)}
                        placeholder="+91 9876543212"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Security Requirements - FIXED */}
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Security Requirements</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="maleGuards">Male Guards</Label>
                      <Input
                        id="maleGuards"
                        name="requiredGuards.male"
                        type="number"
                        min="0"
                        value={formData.requiredGuards.male}
                        onChange={(e) => handleSimpleNestedChange('requiredGuards.male', e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="femaleGuards">Female Guards</Label>
                      <Input
                        id="femaleGuards"
                        name="requiredGuards.female"
                        type="number"
                        min="0"
                        value={formData.requiredGuards.female}
                        onChange={(e) => handleSimpleNestedChange('requiredGuards.female', e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalGuards">Total Guards</Label>
                      <Input
                        id="totalGuards"
                        name="requiredGuards.total"
                        type="number"
                        min="0"
                        value={formData.requiredGuards.total}
                        onChange={(e) => handleSimpleNestedChange('requiredGuards.total', e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Equipment Required</Label>
                    <Select
                      value={formData.equipmentRequired}
                      onValueChange={(value) => handleSelectChange('equipmentRequired', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Emergency Contact - FIXED */}
                <div className="grid gap-4">
                  <h3 className="text-lg font-semibold">Emergency Contact</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input
                        id="emergencyName"
                        name="emergencyContacts.0.name"
                        value={formData.emergencyContacts[0]?.name || ""}
                        onChange={(e) => handleSimpleNestedChange('emergencyContacts.0.name', e.target.value)}
                        placeholder="Emergency Contact"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelationship">Relationship</Label>
                      <Input
                        id="emergencyRelationship"
                        name="emergencyContacts.0.relationship"
                        value={formData.emergencyContacts[0]?.relationship || ""}
                        onChange={(e) => handleSimpleNestedChange('emergencyContacts.0.relationship', e.target.value)}
                        placeholder="Spouse/Manager"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        name="emergencyContacts.0.phone"
                        value={formData.emergencyContacts[0]?.phone || ""}
                        onChange={(e) => handleSimpleNestedChange('emergencyContacts.0.phone', e.target.value)}
                        placeholder="+91 9876543213"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions or notes..."
                    rows={3}
                    disabled={isSubmitting}
                  />
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
                  <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
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
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
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
                <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
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
                <p className="text-sm font-medium text-muted-foreground">Corporate Clients</p>
                <p className="text-2xl font-bold">
                  {clients.filter((c) => c.clientType === "Corporate").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {clients.filter((c) => c.clientType !== "Corporate").length} other types
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
                <p className="text-sm font-medium text-muted-foreground">Guards Required</p>
                <p className="text-2xl font-bold">
                  {getTotalRequiredGuards()}
                </p>
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
            <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Client Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Corporate">Corporate</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
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
                  <TableHead className="hidden md:table-cell min-w-[180px]">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[150px]">Address</TableHead>
                  <TableHead className="text-center min-w-[100px]">Status</TableHead>
                  <TableHead className="hidden xl:table-cell min-w-[120px]">Type</TableHead>
                  <TableHead className="hidden 2xl:table-cell min-w-[100px]">Guards</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
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
                          <div className="font-medium truncate">{client.name}</div>
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
                          <span className="truncate">{client.phone || "N/A"}</span>
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
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex items-center gap-2">
                        {client.clientType === "Corporate" ? (
                          <Building className="h-3 w-3 text-muted-foreground" />
                        ) : client.clientType === "Individual" ? (
                          <User className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span className="text-sm truncate">
                          {client.clientType || "Corporate"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden 2xl:table-cell">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium truncate">
                            {client.assignedGuards?.length || 0} / {client.requiredGuards?.total || 0}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            Assigned / Required
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
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
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info("Edit functionality coming soon");
                          }}
                          title="Edit Client"
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
              {clients.length === 0 ? (
                <>
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No clients registered yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Add your first client using the button above.
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)}>
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
                    {clients.filter(c => c.clientType === "Corporate").length} corporate
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}