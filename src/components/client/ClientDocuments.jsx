// File: src/components/client/ClientDocuments.jsx
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientDocuments({ dummyDocuments, currentCategory }) {
  // Filter documents based on current category
  const filteredDocuments =
    currentCategory && currentCategory !== "documents"
      ? dummyDocuments.filter(
          (doc) =>
            (doc.access === "general" || doc.access === "specific") &&
            doc.type === (currentCategory.child ? currentCategory.child.toLowerCase() : currentCategory.name.toLowerCase())
        )
      : dummyDocuments.filter(
          (doc) => doc.access === "general" || doc.access === "specific"
        );

  // Determine page title and description
  const getPageTitle = () => {
    if (currentCategory && currentCategory !== "documents") {
      return currentCategory.child
        ? `${currentCategory.name} - ${currentCategory.child} Documents`
        : `${currentCategory.name} Documents`;
    }
    return "Documents";
  };

  const getPageDescription = () => {
    if (currentCategory && currentCategory !== "documents") {
      return `Access your ${currentCategory.child ? currentCategory.child.toLowerCase() : currentCategory.name.toLowerCase()} documents`;
    }
    return "Access all your contracts, reports, certificates, and other important documents";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {getPageTitle()}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {getPageDescription()}
          </p>
        </div>
      </div>

      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle>
            {getPageTitle()}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredDocuments.length}{" "}
              {filteredDocuments.length === 1 ? "document" : "documents"})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
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
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No documents found in this category
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}