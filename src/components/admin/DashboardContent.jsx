"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, FileText, Users, AlertCircle } from "lucide-react";

export default function DashboardContent({ dummyClients, dummyDocuments }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Admin Dashboard
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              2
            </div>
            <p className="text-xs text-secondary">Currently active</p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              1
            </div>
            <p className="text-xs text-secondary">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              4
            </div>
            <p className="text-xs text-secondary">In system</p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Services
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              15
            </div>
            <p className="text-xs text-secondary">Currently running</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
            <CardDescription>
              Latest client registrations and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dummyClients.slice(0, 3).map((client) => (
              <div key={client.id} className="flex items-center space-x-3 py-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {client.name}
                  </p>
                  <p className="text-xs text-secondary truncate">
                    {client.org}
                  </p>
                </div>
                <div className="ml-auto text-xs">
                  <Badge
                    variant={
                      client.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {client.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>
              Latest document uploads and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dummyDocuments.slice(0, 3).map((doc) => (
              <div key={doc.id} className="flex items-center space-x-3 py-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none text-foreground truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-secondary">{doc.type}</p>
                </div>
                <div className="ml-auto text-xs">
                  <Badge variant="secondary">{doc.access}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>
              Important notifications and system status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start p-3 bg-primary/5 rounded-md shadow-sm">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  1 client pending approval
                </p>
                <p className="text-xs text-secondary">
                  Review and approve new client registrations
                </p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-secondary/10 rounded-md shadow-sm">
              <Shield className="h-4 w-4 text-secondary mt-0.5 mr-3 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  System running smoothly
                </p>
                <p className="text-xs text-secondary">
                  All services operational, no issues detected
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
