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
import { Eye } from "lucide-react";
import { Button } from "../ui/button";

export default function ClientManagement({
  dummyGuards,
  dummyRequests,
  handleGuardClick,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Management
        </h2>
      </div>
      <p className="text-secondary">
        Manage your assigned guards and view document requests.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle>Assigned Guards</CardTitle>
            <CardDescription>
              View and manage your security guards.
            </CardDescription>
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
                {dummyGuards.map((guard) => (
                  <TableRow
                    key={guard.id}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleGuardClick(guard.id)}
                  >
                    <TableCell className="font-medium">{guard.name}</TableCell>
                    <TableCell>{guard.email}</TableCell>
                    <TableCell>{guard.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          guard.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {guard.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle>Document Requests</CardTitle>
            <CardDescription>
              View your previous document requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === "Pending" ? "secondary" : "default"
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{req.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
