// File: src/components/client/ServiceOverview.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Shield,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  FileText,
  CreditCard,
  Briefcase,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Award,
  Star,
  Target,
  Bell,
  Settings,
  Download,
  MessageSquare,
  Eye,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function ServiceOverview({ serviceData, loading = false }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading service overview...</p>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No service data found</h3>
        <p className="text-muted-foreground">Please contact support for assistance.</p>
      </div>
    );
  }

  const {
    clientInfo,
    contractDetails,
    serviceDetails,
    sites,
    assignedGuards,
    emergencyContacts,
    documentsCount,
    currentStatus,
  } = serviceData;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Service Overview
          </h1>
          <p className="text-muted-foreground">
            Complete details of your security service and assigned personnel
          </p>
        </div>


      </div>

      {/* Client Profile Card */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg bg-primary/10">
                  {clientInfo.avatar || clientInfo.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{clientInfo.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Building className="h-4 w-4" />
                  {clientInfo.companyName || "No company specified"}
                </CardDescription>
              </div>
            </div>
            <Badge className={`rounded-full px-3 py-1 ${currentStatus.isActive ? "bg-green-500" : "bg-gray-500"
              }`}>
              {currentStatus.status || "Active"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Guards Section */}
      <div className="space-y-6">
        <Card className="rounded-2xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Assigned Security Personnel ({assignedGuards.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignedGuards.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {assignedGuards.map((guard) => (
                  <Card key={guard._id} className="rounded-xl border-border/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-foreground text-lg">
                          {guard.name}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {guard.guardId || "No Code"}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {guard.phone || "N/A"}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{guard.address || guard.location || "N/A"}</span>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No guards assigned</h3>
                <p className="text-muted-foreground">
                  Guards will appear here once assigned by the administrator
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}