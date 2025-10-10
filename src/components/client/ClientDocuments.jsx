// Updated File: components/client/ClientDocuments.jsx
"use client";

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
import { FileText, Eye, Download } from "lucide-react";

export default function ClientDocuments({ dummyDocuments }) {
  const filteredDocuments = dummyDocuments.filter(
    (doc) => doc.access === "general" || doc.access === "specific"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Documents
        </h2>
      </div>
      <p className="text-secondary">
        Access your contracts, reports, certificates, and other important
        documents.
      </p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Access</TableHead>
              <TableHead className="max-w-[300px]">Description</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>{doc.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="default">{doc.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{doc.access}</Badge>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {doc.description}
                </TableCell>
                <TableCell>{doc.uploaded}</TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredDocuments.length === 0 && (
        <div className="text-center py-8 text-secondary">
          No documents available.
        </div>
      )}
    </div>
  );
}
