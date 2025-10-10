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
import { Eye, Trash2 } from "lucide-react";

const dummyRequests = [
  {
    id: 1,
    client: "John Smith",
    clientId: 1,
    type: "Invoice",
    status: "Pending",
    date: "2025-01-15",
  },
  {
    id: 2,
    client: "Sarah Johnson",
    clientId: 2,
    type: "Report",
    status: "Fulfilled",
    date: "2025-01-14",
  },
];

export default function RequestReports({ dummyRequests: propRequests }) {
  const router = useRouter();
  const requests = propRequests || dummyRequests;

  const handleClientClick = (clientId) => {
    router.push(`/admin-dashboard/client-details/${clientId}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
        Request Reports
      </h2>
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow
                  key={req.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleClientClick(req.clientId)}
                >
                  <TableCell className="font-medium">{req.client}</TableCell>
                  <TableCell>{req.type}</TableCell>
                  <TableCell>
                    <Badge>Pending</Badge>
                  </TableCell>
                  <TableCell>{req.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
