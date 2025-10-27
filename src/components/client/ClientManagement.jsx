// File: src/components/client/ClientManagement.jsx - UPDATED WITH REAL DATA
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Shield,
  Star,
  Phone,
  Mail,
  MapPin,
  Eye,
  MessageCircle,
} from "lucide-react";

export default function ClientManagement({
  dummyGuards = [], // ✅ FIXED: Fallback for assignedGuards
  dummyRequests = [],
  dummyDocuments = [], // ✅ FIXED: Use for clientDocuments
  handleGuardClick,
  clientData, // ✅ FIXED: Add clientData prop if needed
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">
          Security Management
        </h2>
        <p className="text-muted-foreground mt-2">
          Manage your security team and service details
        </p>
      </div>

      {/* Assigned Guards Section */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Your Security Team ({dummyGuards.length})
          </CardTitle>
          <CardDescription>
            Security personnel currently assigned to your location
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dummyGuards.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {dummyGuards.map((guard) => (
                <Card
                  key={guard._id || guard.id}
                  className="rounded-xl border-border/30 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleGuardClick(guard._id || guard.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {guard.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {guard.type || "Security Guard"} •{" "}
                            {guard.experience || "2+ years"}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            <span className="text-xs font-medium">
                              {guard.rating || 4.5}/5
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          guard.status === "Active" ? "default" : "secondary"
                        }
                        className={`rounded-full ${
                          guard.status === "Active"
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {guard.status}
                      </Badge>
                    </div>

                    {guard.specialization &&
                      guard.specialization.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {guard.specialization
                            .slice(0, 3)
                            .map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs rounded-full"
                              >
                                {skill}
                              </Badge>
                            ))}
                        </div>
                      )}

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {guard.phone || "(555) 111-2222"}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {guard.location || "Mumbai"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No guards assigned
              </h3>
              <p className="text-muted-foreground mb-4">
                Your security team will appear here once assigned by the
                administrator
              </p>
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Information */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Security Plan
              </span>
              <Badge variant="outline" className="rounded-full">
                {clientData?.securityPlan || "Standard"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Service Status
              </span>
              <Badge variant="default" className="rounded-full bg-green-500">
                Active
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Assigned Since
              </span>
              <span className="text-sm text-foreground">
                {formatDate(clientData?.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Total Documents
              </span>
              <span className="text-sm text-foreground">
                {dummyDocuments.length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a
                href={`mailto:support@elitesecurity.com?subject=Support Request - ${clientData?.name}`}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Request Service Change
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Download Service Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Emergency Contact
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
