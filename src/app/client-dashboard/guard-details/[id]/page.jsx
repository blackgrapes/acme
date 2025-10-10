// Updated File: app/client-dashboard/guard-details/[id]/page.jsx
"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Eye, Download } from "lucide-react";
import Header from "@/components/client/Header";
import DesktopSidebar from "@/components/client/DesktopSidebar";

const dummyGuardDetails = {
  id: 1,
  name: "Guard A",
  email: "guardA@example.com",
  phone: "(555) 111-2222",
  status: "Active",
  assignedDate: "2025-01-01",
  documents: [
    {
      id: 1,
      name: "Certification",
      type: "Certificate",
      uploaded: "2025-01-01",
      size: "500 KB",
      description: "Security certification.",
    },
    {
      id: 2,
      name: "Training Report",
      type: "Report",
      uploaded: "2025-01-05",
      size: "1.2 MB",
      description: "Latest training completion report.",
    },
  ],
};

export default function GuardDetails() {
  const params = useParams();
  const guardId = parseInt(params.id);
  const router = useRouter();
  const guard = dummyGuardDetails; // In real app, fetch based on id

  const activeTab = "management";
  const handleTabChange = () => {
    router.push("/client-dashboard");
  };

  if (!guard) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header activeTab={activeTab} setActiveTab={handleTabChange} />
        <div className="flex flex-1">
          <DesktopSidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
              <p className="text-foreground">Guard not found</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex flex-1">
        <DesktopSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6 text-foreground">
              Guard Details: {guard.name}
            </h1>

            <Card className="mb-6 shadow-md border-0">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-secondary font-medium">Email</p>
                    <p className="text-foreground">{guard.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary font-medium">Phone</p>
                    <p className="text-foreground">{guard.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary font-medium">Status</p>
                    <p className="text-foreground">
                      <Badge variant="default">{guard.status}</Badge>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary font-medium">
                      Assigned Date
                    </p>
                    <p className="text-foreground">{guard.assignedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  View guard's associated documents and certifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {guard.documents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guard.documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            {doc.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{doc.type}</Badge>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {doc.uploaded}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {doc.size}
                          </TableCell>
                          <TableCell className="text-foreground max-w-[200px] truncate">
                            {doc.description}
                          </TableCell>
                          <TableCell className="space-x-2">
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
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-secondary py-8">
                    No documents available for this guard.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
