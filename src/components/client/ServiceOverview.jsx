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
                  <Badge variant="outline" className="ml-2">
                    {clientInfo.clientType}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <Badge className={`rounded-full px-3 py-1 ${
              currentStatus.isActive ? "bg-green-500" : "bg-gray-500"
            }`}>
              {currentStatus.status || "Active"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="font-medium">{clientInfo.email}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </div>
              <p className="font-medium">{clientInfo.phone || "Not provided"}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>Designation</span>
              </div>
              <p className="font-medium">{clientInfo.designation || "Not specified"}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Client Since</span>
              </div>
              <p className="font-medium">{formatDate(clientInfo.joinDate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger className="cursor-pointer" value="overview">Overview</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="guards">Guards</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="sites">Sites</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="emergency">Emergency</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Contract Summary */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Contract Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Contract No.</span>
                  <Badge variant="outline">{contractDetails.contractNumber}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Start Date</span>
                  <span className="font-medium">{formatDate(contractDetails.contractStartDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">End Date</span>
                  <span className="font-medium">{formatDate(contractDetails.contractEndDate) || "Not set"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Value</span>
                  <span className="font-medium text-green-600">{formatCurrency(contractDetails.contractValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Security Plan</span>
                  <Badge className="rounded-full bg-blue-100 text-blue-700">
                    {contractDetails.securityPlan}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  Service Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Service Types</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceDetails.serviceType?.map((type, index) => (
                      <Badge key={index} variant="secondary" className="rounded-full">
                        {type}
                      </Badge>
                    )) || <span className="text-sm">No services specified</span>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Male Guards</p>
                    <p className="text-xl font-bold">{serviceDetails.requiredGuards?.male || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Female Guards</p>
                    <p className="text-xl font-bold">{serviceDetails.requiredGuards?.female || 0}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Equipment Required</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceDetails.equipmentRequired?.map((eq, index) => (
                      <Badge key={index} variant="outline" className="rounded-full">
                        {eq}
                      </Badge>
                    )) || <span className="text-sm">No equipment specified</span>}
                  </div>
                </div>
              </CardContent>
            </Card>

           
          </div>
        </TabsContent>

        {/* Guards Tab */}
        <TabsContent value="guards" className="space-y-6">
          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Assigned Security Personnel ({assignedGuards.length})
              </CardTitle>
              <CardDescription>
                Security guards currently assigned to your service
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignedGuards.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {assignedGuards.map((guard) => (
                    <Card key={guard._id} className="rounded-xl border-border/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10">
                                {guard.avatar || guard.name?.charAt(0) || "G"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-bold text-foreground">
                                {guard.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {guard.type} • ID: {guard.guardId}
                              </div>
                            </div>
                          </div>
                          <Badge className={`rounded-full ${
                            guard.status === "Active" ? "bg-green-500" :
                            guard.status === "Assigned" ? "bg-blue-500" :
                            "bg-gray-500"
                          }`}>
                            {guard.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Experience</p>
                            <p className="font-medium">{guard.experience}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{guard.rating}/5</span>
                            </div>
                          </div>
                          {/* <div>
                            <p className="text-xs text-muted-foreground">Salary</p>
                            <p className="font-medium">{guard.salary}</p>
                          </div> */}
                          <div>
                            <p className="text-xs text-muted-foreground">Gender</p>
                            <p className="font-medium">{guard.gender}</p>
                          </div>
                        </div>

                        {guard.specialization?.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-2">Specialization</p>
                            <div className="flex flex-wrap gap-1">
                              {guard.specialization.map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs rounded-full">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {guard.phone}
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
        </TabsContent>

        {/* Sites Tab */}
        <TabsContent value="sites" className="space-y-6">
          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Service Locations ({sites.length})
              </CardTitle>
              <CardDescription>
                All sites/locations where security service is provided
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sites.length > 0 ? (
                <div className="grid gap-4">
                  {sites.map((site, index) => (
                    <Card key={index} className="rounded-xl border-border/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="font-bold text-foreground flex items-center gap-2">
                              {site.siteName || `Site ${index + 1}`}
                              {site.isActive && (
                                <Badge className="rounded-full bg-green-500 text-xs">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {site.address}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Contact Person</p>
                            <p className="font-medium">{site.contactPerson || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Contact Number</p>
                            <p className="font-medium">{site.contactNumber || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Shift Timings</p>
                            <p className="font-medium">
                              {site.shiftTimings?.start && site.shiftTimings?.end 
                                ? `${site.shiftTimings.start} - ${site.shiftTimings.end}`
                                : "Not specified"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No sites configured</h3>
                  <p className="text-muted-foreground">
                    Sites will appear here once configured by the administrator
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contacts Tab */}
        <TabsContent value="emergency">
          <Card className="rounded-2xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Emergency Contacts ({emergencyContacts.length})
              </CardTitle>
              <CardDescription>
                Emergency contacts for your security service
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emergencyContacts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {emergencyContacts.map((contact, index) => (
                    <Card key={index} className="rounded-xl border-border/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="font-bold text-foreground flex items-center gap-2">
                              {contact.name}
                              {contact.priority === 1 && (
                                <Badge className="rounded-full bg-red-500 text-xs">
                                  Primary
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {contact.relationship || "Emergency Contact"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{contact.phone}</span>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="text-xs text-muted-foreground">
                              Priority: {contact.priority}
                            </div>
                            
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No emergency contacts</h3>
                  <p className="text-muted-foreground">
                    Please contact support to add emergency contacts
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}