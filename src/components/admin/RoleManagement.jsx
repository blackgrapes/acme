// Enhanced File: src/components/admin/RoleManagement.jsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit2,
  Trash2,
  Key,
  Users,
  Shield,
  UserPlus,
  RefreshCw,
  Search,
  Eye,
  Check,
  Download,
  BarChart3,
  X,
  ArrowLeft,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const tabPermissions = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Analytics and overview access",
    actions: [
      {
        id: "read",
        name: "View",
        icon: Eye,
        description: "Access dashboard analytics",
      },
    ],
  },
  {
    id: "clients",
    name: "Client Management",
    description: "Manage client records",
    actions: [
      {
        id: "create",
        name: "Create",
        icon: Plus,
        description: "Add new clients",
      },
      {
        id: "read",
        name: "Read",
        icon: Eye,
        description: "View client details",
      },
      {
        id: "update",
        name: "Update",
        icon: Edit2,
        description: "Edit client information",
      },
      {
        id: "delete",
        name: "Delete",
        icon: Trash2,
        description: "Remove clients",
      },
    ],
  },
  {
    id: "documents",
    name: "Document Management",
    description: "Handle documents",
    actions: [
      {
        id: "create",
        name: "Create",
        icon: Plus,
        description: "Upload documents",
      },
      { id: "read", name: "Read", icon: Eye, description: "View documents" },
      {
        id: "update",
        name: "Update",
        icon: Edit2,
        description: "Edit document metadata",
      },
      {
        id: "delete",
        name: "Delete",
        icon: Trash2,
        description: "Delete documents",
      },
    ],
  },
  {
    id: "frontend",
    name: "Frontend Management",
    description: "Manage content for Gallery, Services, Testimonials, etc.",
    actions: [
      { id: "create", name: "Create", icon: Plus, description: "Add frontend content" },
      { id: "read", name: "Read", icon: Eye, description: "View frontend content" },
      { id: "update", name: "Update", icon: Edit2, description: "Edit frontend content" },
      { id: "delete", name: "Delete", icon: Trash2, description: "Delete frontend content" },
    ],
  },
  {
    id: "support",
    name: "Support Management",
    description: "Manage support contacts",
    actions: [
      { id: "create", name: "Create", icon: Plus, description: "Add support contacts" },
      { id: "read", name: "Read", icon: Eye, description: "View support contacts" },
      { id: "update", name: "Update", icon: Edit2, description: "Edit support contacts" },
      { id: "delete", name: "Delete", icon: Trash2, description: "Delete support contacts" },
    ],
  },
  {
    id: "requests",
    name: "Request Reports",
    description: "Manage requests",
    actions: [
      {
        id: "create",
        name: "Create",
        icon: Plus,
        description: "Submit new requests",
      },
      { id: "read", name: "Read", icon: Eye, description: "View requests" },
      {
        id: "update",
        name: "Update",
        icon: Edit2,
        description: "Update request status",
      },
      {
        id: "delete",
        name: "Delete",
        icon: Trash2,
        description: "Cancel requests",
      },
    ],
  },
  {
    id: "guards",
    name: "Guard Management",
    description: "Manage guards",
    actions: [
      {
        id: "create",
        name: "Create",
        icon: Plus,
        description: "Add new guards",
      },
      {
        id: "read",
        name: "Read",
        icon: Eye,
        description: "View guard profiles",
      },
      {
        id: "update",
        name: "Update",
        icon: Edit2,
        description: "Edit guard details",
      },
      {
        id: "delete",
        name: "Delete",
        icon: Trash2,
        description: "Remove guards",
      },
    ],
  },
  // REMOVE FRONTEND MANAGEMENT FROM HERE - IT'S INSIDE SETTINGS
  {
    id: "roles",
    name: "Roles & Users",
    description: "Manage permissions",
    actions: [
      {
        id: "create",
        name: "Create",
        icon: Plus,
        description: "Create roles/users",
      },
      { id: "read", name: "Read", icon: Eye, description: "View roles/users" },
      {
        id: "update",
        name: "Update",
        icon: Edit2,
        description: "Edit roles/users",
      },
      {
        id: "delete",
        name: "Delete",
        icon: Trash2,
        description: "Delete roles/users",
      },
    ],
  },
  {
    id: "contact",
    name: "Contact Management",
    description: "Handle inquiries",
    actions: [
      {
        id: "create",
        name: "Create",
        icon: Plus,
        description: "Add contact notes",
      },
      { id: "read", name: "Read", icon: Eye, description: "View contacts" },
      {
        id: "update",
        name: "Update",
        icon: Edit2,
        description: "Update contact status",
      },
      {
        id: "delete",
        name: "Delete",
        icon: Trash2,
        description: "Archive contacts",
      },
    ],
  },
  {
    id: "settings", // KEEP ONLY SETTINGS - FRONTEND IS INSIDE THIS
    name: "Settings",
    description: "System configurations including Frontend Management",
    actions: [
      { id: "read", name: "Read", icon: Eye, description: "View settings" },
      {
        id: "update",
        name: "Update",
        icon: Edit2,
        description: "Modify settings",
      },
    ],
  },
];

export default function RoleManagement() {
  const [activeTab, setActiveTab] = useState("roles");
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPassword, setCopiedPassword] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingRole, setEditingRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roleName: "",
    roleDescription: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const { toast } = useToast();

  // Fetch roles and users on mount
  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  // Inside RoleManagement.jsx - update fetch functions:

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/auth/roles");
      if (res.ok) {
        const data = await res.json();
        setRoles(data || []);
      } else {
        // Fallback to empty array if API fails
        setRoles([]);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setRoles([]); // Fallback to empty array
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/auth/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleEditRole = (role) => {
    console.log("handleEditRole called with:", role);
    setEditingRole(role);
    setFormData({
      ...formData,
      roleName: role.name,
      roleDescription: role.description || "",
      // Maintain other fields blank or as is
      name: "",
      email: "",
      password: "",
      phone: "",
    });
    setSelectedPermissions(role.permissions || []);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRole = async (roleId) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      const res = await fetch(`/api/auth/roles/${roleId}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Success", description: "Role deleted" });
        fetchRoles();
      } else {
        toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (editingRole) {
        // Update existing role
        res = await fetch(`/api/auth/roles/${editingRole._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.roleName,
            description: formData.roleDescription,
            permissions: selectedPermissions,
          }),
        });
      } else {
        // Create new role & user (Reference existing logic)
        res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name, // Only for new user creation flow
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            roleName: formData.roleName,
            roleDescription: formData.roleDescription,
            permissions: selectedPermissions,
          }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to create role and user",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Role and user created successfully!",
      });
      fetchRoles();
      fetchUsers();
      // Reset form
      setFormData({
        roleName: "",
        roleDescription: "",
        name: "",
        email: "",
        phone: "",
        password: "",
      });
      setSelectedPermissions([]);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: "Failed to create role and user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPassword(text);
    setTimeout(() => setCopiedPassword(""), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      Active: { className: "bg-green-500 text-white rounded-full" },
      Inactive: {
        className: "bg-red-500 text-white rounded-full",
      },
      "Pending Verification": {
        className: "bg-yellow-500 text-white rounded-full",
      },
      "Approved - Temp Password Sent": {
        className: "bg-blue-500 text-white rounded-full",
      },
      Expired: { className: "bg-gray-500 text-white rounded-full" },
    };
    const config = variants[status] || {
      className: "bg-gray-500 text-white rounded-full",
    };
    return (
      <Badge variant="default" className={config.className}>
        {status}
      </Badge>
    );
  };

  // Filter users based on search and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role?.name === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Count permissions per role for display
  const getPermissionCount = (permissions) => {
    const uniqueTabs = [...new Set(permissions.map((p) => p.split("-")[0]))]
      .length;
    return `${permissions.length} actions (${uniqueTabs} tabs)`;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Roles & User Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create roles with granular CRUD permissions for each tab and manage
            user access with secure authentication
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-primary cursor-pointer hover:bg-primary/90 text-white shadow-sm flex items-center gap-2"
            permission="roles-create"
          >
            <UserPlus className="h-4 w-4" />
            Create Role & User
          </Button>
        </div>
      </div>

      {/* Create Role & User Form - Inline */}
      {showCreateForm && (
        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-2xl">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-xl">
                    Create New Role & Assign User
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Define role with granular CRUD permissions per tab and
                    create a user with auto-generated temporary password
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
                className="text-foreground cursor-pointer hover:bg-primary/10 rounded-xl"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-8 p-6 lg:p-8">
              {/* Step 1: Role Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-500 font-bold text-sm">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Role Details
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="roleName"
                      className="text-sm font-medium text-foreground"
                    >
                      Role Name *
                    </Label>
                    <Input
                      id="roleName"
                      name="roleName"
                      value={formData.roleName}
                      onChange={handleInputChange}
                      placeholder="e.g., Content Editor"
                      className="rounded-xl border-primary/20 focus:border-primary h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="roleDescription"
                      className="text-sm font-medium text-foreground"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="roleDescription"
                      name="roleDescription"
                      value={formData.roleDescription}
                      onChange={handleInputChange}
                      placeholder="Brief role summary"
                      className="rounded-xl border-primary/20 focus:border-primary min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Permissions with CRUD */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-500 font-bold text-sm">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Granular Permissions (CRUD per Tab)
                  </h3>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto p-4 rounded-xl bg-muted/30">
                  {tabPermissions.map((tab) => (
                    <div
                      key={tab.id}
                      className="space-y-3 border-b border-border/50 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-primary" />{" "}
                          {/* Placeholder icon */}
                          <span className="font-medium text-foreground">
                            {tab.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tab.actions.length} actions
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {tab.actions.map((action) => {
                          const fullId = `${tab.id}-${action.id}`;
                          return (
                            <div
                              key={fullId}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <Checkbox
                                id={fullId}
                                checked={selectedPermissions.includes(fullId)}
                                onCheckedChange={() =>
                                  handlePermissionToggle(fullId)
                                }
                                className="mt-0.5"
                              />
                              <label
                                htmlFor={fullId}
                                className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                              >
                                <action.icon className="h-3 w-3 text-primary flex-shrink-0" />
                                <div className="text-xs">
                                  <div className="font-medium text-foreground truncate">
                                    {action.name}
                                  </div>
                                  <div className="text-muted-foreground truncate">
                                    {action.description}
                                  </div>
                                </div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {selectedPermissions.length} of{" "}
                  {tabPermissions.reduce((acc, t) => acc + t.actions.length, 0)}{" "}
                  permissions selected
                </div>
              </div>

              {/* Step 3: User Assignment */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-500 font-bold text-sm">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    User Assignment
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="userName"
                      className="text-sm font-medium text-foreground"
                    >
                      User Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., John Doe"
                      className="rounded-xl border-primary/20 focus:border-primary h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="userEmail"
                      className="text-sm font-medium text-foreground"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="user@company.com"
                      className="rounded-xl border-primary/20 focus:border-primary h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="userPhone"
                      className="text-sm font-medium text-foreground"
                    >
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="rounded-xl border-primary/20 focus:border-primary h-11"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="userPassword"
                      className="text-sm font-medium text-foreground"
                    >
                      Temporary Password *
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="e.g., SecurePass123!"
                      className="rounded-xl border-primary/20 focus:border-primary h-11"
                      required
                    />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-foreground">
                        Manual Password Set
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Set a secure temporary password for the new user
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-xl cursor-pointer flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex-1 flex items-center justify-center gap-2"
                  permission="roles-create"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Create Role & User
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 bg-gradient-to-r from-muted/50 to-muted/30 rounded-2xl p-1 shadow-lg">
          <TabsTrigger
            value="roles"
            className="rounded-xl cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Roles ({roles.length})
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="rounded-xl cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Users ({users.length})
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="mt-0 space-y-6">
          {/* Roles Table */}
          <Card className="shadow-md border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-foreground">
                      Role Permissions
                    </CardTitle>
                    <CardDescription>
                      Manage role-based CRUD access control for admin tabs
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl cursor-pointer"
                    onClick={fetchRoles}
                    permission="roles-read"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-primary/10">
                    <TableHead className="text-left font-semibold text-foreground">
                      Role
                    </TableHead>
                    <TableHead className="text-left font-semibold text-foreground hidden md:table-cell">
                      Description
                    </TableHead>
                    <TableHead className="text-center font-semibold text-foreground">
                      Permissions
                    </TableHead>
                    <TableHead className="text-center font-semibold text-foreground">
                      Users
                    </TableHead>
                    <TableHead className="text-right font-semibold text-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow
                      key={role._id}
                      className="hover:bg-primary/5 transition-colors border-b border-border/20"
                    >
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {role.name}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {role.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs">
                          {getPermissionCount(role.permissions || [])}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {role.users || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          {getStatusBadge(role.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {/* 
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            // permission="roles-read"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                           */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 cursor-pointer"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteRole(role._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-0 space-y-6">
          {/* Users Header with Search & Filter */}
          <Card className="shadow-md border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-foreground">
                      User Management
                    </CardTitle>
                    <CardDescription>
                      View and manage all registered users
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl h-11"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-auto rounded-xl h-11">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Frontend Editor">
                        Frontend Editor
                      </SelectItem>
                      <SelectItem value="Guard Supervisor">
                        Guard Supervisor
                      </SelectItem>
                      <SelectItem value="Client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Users Table */}
          <Card className="shadow-md border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-primary/10">
                    <TableHead className="text-left font-semibold text-foreground">
                      User
                    </TableHead>
                    <TableHead className="text-left font-semibold text-foreground hidden lg:table-cell">
                      Email
                    </TableHead>
                    <TableHead className="text-left font-semibold text-foreground">
                      Role
                    </TableHead>
                    <TableHead className="text-center font-semibold text-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-left font-semibold text-foreground hidden xl:table-cell">
                      Last Login
                    </TableHead>
                    {/* <TableHead className="text-right font-semibold text-foreground">
                      Actions
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      className="hover:bg-primary/5 transition-colors border-b border-border/20"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {user.avatar || user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {user.name}
                            </div>
                            <div className="text-xs text-muted-foreground lg:hidden">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-full border-primary/20"
                        >
                          {user.role?.name || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          {getStatusBadge(user.status)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {user.lastLogin
                            ? formatDate(user.lastLogin)
                            : "Never"}
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                            permission="roles-read"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                            permission="roles-update"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                            onClick={() => handlePasswordReset(user.email)}
                            permission="roles-update"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-primary/30" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No users found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
