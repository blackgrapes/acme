// Updated File: components/admin/RequestReports.jsx
"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Trash2,
  FileText,
  Users,
  Search,
  Filter,
  Download,
  MoreVertical,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  FileDown,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dummyRequests = [
  {
    id: 1,
    client: "John Smith",
    clientId: 1,
    type: "Invoice",
    status: "Pending",
    date: "2025-01-15",
    amount: "$2,500",
    priority: "High",
    assignedTo: "Admin User",
  },
  {
    id: 2,
    client: "Sarah Johnson",
    clientId: 2,
    type: "Report",
    status: "Fulfilled",
    date: "2025-01-14",
    amount: "N/A",
    priority: "Medium",
    assignedTo: "Support Team",
  },
  {
    id: 3,
    client: "Mike Davis",
    clientId: 3,
    type: "Service Extension",
    status: "Pending",
    date: "2025-01-10",
    amount: "$1,200",
    priority: "High",
    assignedTo: "Admin User",
  },
  {
    id: 4,
    client: "Emily Wilson",
    clientId: 4,
    type: "Invoice",
    status: "Rejected",
    date: "2025-01-08",
    amount: "$3,400",
    priority: "Low",
    assignedTo: "Finance Team",
  },
  {
    id: 5,
    client: "Robert Brown",
    clientId: 5,
    type: "Custom Report",
    status: "Fulfilled",
    date: "2025-01-05",
    amount: "N/A",
    priority: "Medium",
    assignedTo: "Analytics Team",
  },
];

export default function RequestReports({ dummyRequests: propRequests }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const requests = propRequests || dummyRequests;

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesType = typeFilter === "all" || req.type === typeFilter;
    const matchesPriority =
      priorityFilter === "all" || req.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const handleClientClick = (clientId) => {
    router.push(`/admin-dashboard/client-details/${clientId}`);
  };

  const statusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Fulfilled":
        return "default";
      case "Rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Fulfilled":
        return <CheckCircle className="h-3 w-3" />;
      case "Pending":
        return <Clock className="h-3 w-3" />;
      case "Rejected":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800";
      case "Low":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Statistics
  const stats = {
    total: requests.length,
    pending: requests.filter((req) => req.status === "Pending").length,
    fulfilled: requests.filter((req) => req.status === "Fulfilled").length,
    rejected: requests.filter((req) => req.status === "Rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Request Reports
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage client requests, reports, and service extensions
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-primary/20 hover:bg-primary/5"
          >
            <Download className="h-4 w-4 mr-2 text-primary" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
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
                  {stats.pending}
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
                <p className="text-sm font-medium text-foreground">Fulfilled</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.fulfilled}
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
                <p className="text-sm font-medium text-foreground">Rejected</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.rejected}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            Client Requests
            <Badge variant="outline" className="text-primary border-primary/20">
              {filteredRequests.length}
            </Badge>
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center space-x-2 w-full sm:w-64">
              <Search className="h-4 w-4 text-primary flex-shrink-0" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 flex-1 border-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] border-primary/20 focus:border-primary">
                  <Filter className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] border-primary/20 focus:border-primary">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="Service Extension">
                    Service Extension
                  </SelectItem>
                  <SelectItem value="Custom Report">Custom Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-primary/10">
                  <TableHead className="text-left font-semibold text-foreground">
                    Client
                  </TableHead>
                  <TableHead className="text-left font-semibold text-foreground hidden sm:table-cell">
                    Type
                  </TableHead>
                  <TableHead className="text-left font-semibold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-left font-semibold text-foreground hidden lg:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="text-left font-semibold text-foreground hidden xl:table-cell">
                    Amount
                  </TableHead>
                  <TableHead className="text-left font-semibold text-foreground hidden 2xl:table-cell">
                    Priority
                  </TableHead>
                  <TableHead className="text-right font-semibold text-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow
                    key={req.id}
                    className="cursor-pointer hover:bg-primary/5 transition-colors border-b border-border/20 group"
                    onClick={() => handleClientClick(req.clientId)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {req.client}
                          </div>
                          <div className="text-xs text-muted-foreground hidden md:block">
                            {req.assignedTo}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/20"
                      >
                        {req.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant(req.status)}
                        className={`text-xs flex items-center gap-1 ${
                          req.status === "Fulfilled"
                            ? "bg-primary text-primary-foreground"
                            : req.status === "Pending"
                            ? "bg-primary/20 text-primary"
                            : ""
                        }`}
                      >
                        {getStatusIcon(req.status)}
                        <span className="hidden sm:inline">{req.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(req.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex items-center gap-1 font-mono text-sm">
                        {req.amount !== "N/A" && (
                          <DollarSign className="h-3 w-3 text-primary" />
                        )}
                        {req.amount}
                      </div>
                    </TableCell>
                    <TableCell className="hidden 2xl:table-cell">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${getPriorityColor(
                          req.priority
                        )}`}
                      >
                        {req.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view action
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle download action
                          }}
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle more actions
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-primary/30" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No requests found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No requests have been created yet"}
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Request
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-4">
        {filteredRequests.map((req) => (
          <Card
            key={req.id}
            className="shadow-md border-0 cursor-pointer hover:bg-primary/5 transition-colors"
            onClick={() => handleClientClick(req.clientId)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {req.client}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {req.assignedTo}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={statusVariant(req.status)}
                  className={`flex items-center gap-1 ${
                    req.status === "Fulfilled"
                      ? "bg-primary text-primary-foreground"
                      : req.status === "Pending"
                      ? "bg-primary/20 text-primary"
                      : ""
                  }`}
                >
                  {getStatusIcon(req.status)}
                  {req.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium text-foreground">{req.type}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Amount</div>
                  <div className="font-medium text-foreground">
                    {req.amount}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Date</div>
                  <div className="font-medium text-foreground">
                    {new Date(req.date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Priority</div>
                  <Badge
                    variant="outline"
                    className={`text-xs border ${getPriorityColor(
                      req.priority
                    )}`}
                  >
                    {req.priority}
                  </Badge>
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
                  <FileDown className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
