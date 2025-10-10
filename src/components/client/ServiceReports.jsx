// File: components/client/ServiceReports.jsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

export default function ServiceReports({ dummyServiceReports }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Service Reports
        </h2>
      </div>
      <p className="text-secondary">
        Detailed reports of security services provided at your location.
      </p>
      <div className="space-y-4">
        {dummyServiceReports.map((report) => (
          <Card key={report.id} className="shadow-md border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">{report.code}</Badge>
                  <span className="font-medium text-foreground">
                    {report.hours}
                  </span>
                </div>
                <p className="text-sm text-secondary mt-1">
                  {report.date} - {report.location}
                </p>
              </div>
              <Badge
                variant="default"
                className={
                  report.status === "completed"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }
              >
                {report.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1 text-foreground">
                  Officer
                </p>
                <p className="text-secondary">{report.officer}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1 text-foreground">
                  Details
                </p>
                <p className="text-secondary text-sm">{report.details}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="shadow-sm">
                  <Eye className="h-4 w-4 mr-2" /> View Full Report
                </Button>
                <Button variant="ghost" size="sm" className="shadow-sm">
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
