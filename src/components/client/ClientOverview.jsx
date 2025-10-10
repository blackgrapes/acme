// File: components/client/ClientOverview.jsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, AlertCircle, Folder, Eye, Download } from "lucide-react";
import { Button } from "../ui/button";

export default function ClientOverview({
  dummyServiceReports,
  dummyIncidentReports,
  dummyDocuments,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Dashboard Overview
        </h2>
      </div>
      <p className="text-secondary">
        Welcome to your security portal. Here's your latest activity.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Services
            </CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              3
            </div>
            <p className="text-xs text-secondary">Currently running</p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              12
            </div>
            <p className="text-xs text-secondary">Service reports</p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents</CardTitle>
            <AlertCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              2
            </div>
            <p className="text-xs text-secondary">This month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <Folder className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              8
            </div>
            <p className="text-xs text-secondary">Available</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle>Recent Service Reports</CardTitle>
            <CardDescription>Latest security service activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dummyServiceReports.slice(0, 3).map((report) => (
              <div key={report.id} className="flex items-start space-x-3 py-2">
                <div className="flex-shrink-0 mt-1">
                  <Badge
                    variant={
                      report.status === "completed" ? "default" : "secondary"
                    }
                    className={
                      report.status === "completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }
                  >
                    {report.status === "completed" ? "✓" : "⟳"}
                  </Badge>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{report.code}</p>
                  <p className="text-sm text-secondary">{report.location}</p>
                  <p className="text-xs text-muted-foreground">
                    {report.date} - {report.officer}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Latest documents and reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dummyDocuments.slice(0, 3).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <p className="text-xs text-secondary">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
