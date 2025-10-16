// Updated File: components/client/ClientManagement.jsx
"use client";

import { useRouter } from "next/navigation";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  Plus,
  Download,
  Clock,
  TrendingUp,
  MoreHorizontal,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "@/components/ui/progress";

export default function ClientManagement({
  dummyGuards,
  dummyRequests,
  handleGuardClick,
}) {
  // Calculate metrics
  const totalGuards = dummyGuards.length;
  const activeGuards = dummyGuards.filter(
    (guard) => guard.status === "Active"
  ).length;
  const totalRequests = dummyRequests.length;
  const pendingRequests = dummyRequests.filter(
    (req) => req.status === "Pending"
  ).length;

  // Mock compliance for guards
  const guardCompliance = 88;

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Client Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your assigned guards and document requests efficiently
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 hover:bg-primary/5"
          >
            <Clock className="h-4 w-4 mr-2 text-primary" />
            Last 30 days
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Guards
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {totalGuards}
            </div>
            <p className="text-xs text-muted-foreground">Assigned personnel</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <p className="text-xs text-primary font-medium">
                +{activeGuards} active
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Active Guards
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {activeGuards}
            </div>
            <p className="text-xs text-muted-foreground">On duty</p>
            {totalGuards > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Compliance</span>
                  <span>{guardCompliance}%</span>
                </div>
                <Progress
                  value={guardCompliance}
                  className="h-1 mt-1 bg-primary/20"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {totalRequests}
            </div>
            <p className="text-xs text-muted-foreground">Document requests</p>
            <p className="text-xs text-primary mt-2 font-medium">
              {pendingRequests} pending
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Pending Requests
            </CardTitle>
            <div className="relative">
              <AlertCircle className="h-4 w-4 text-primary" />
              {pendingRequests > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {pendingRequests}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
            {pendingRequests > 0 && (
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-primary mt-2 font-medium"
              >
                Review now →
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Management Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Assigned Guards */}
        <Card className="shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-foreground">Assigned Guards</CardTitle>
              <CardDescription>
                View and manage your security guards
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyGuards.slice(0, 10).map((guard) => (
                  <TableRow
                    key={guard.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleGuardClick(guard.id)}
                  >
                    <TableCell className="font-medium">{guard.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {guard.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {guard.phone}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          guard.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          guard.status === "Active"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }
                      >
                        {guard.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {dummyGuards.length > 10 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm text-primary"
                      >
                        View all {totalGuards} guards →
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Document Requests */}
        <Card className="shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-foreground">
                Document Requests
              </CardTitle>
              <CardDescription>
                View your previous document requests
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-primary/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyRequests.slice(0, 10).map((req) => (
                  <TableRow
                    key={req.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">{req.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === "Pending" ? "secondary" : "default"
                        }
                        className={
                          req.status === "Pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {req.date}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {dummyRequests.length > 10 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm text-primary"
                      >
                        View all {totalRequests} requests →
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
