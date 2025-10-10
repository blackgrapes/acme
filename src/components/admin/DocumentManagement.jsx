// Updated File: components/admin/DocumentManagement.jsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Edit2, Trash2, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function DocumentManagement({
  dummyDocuments,
  showSpecificClients,
  setShowSpecificClients,
  docGuardSearch,
  handleGuardSearch,
  selectedDocGuards,
  toggleGuardSelection,
  filteredDocGuards,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Document Management
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
              <DialogDescription>
                Upload and configure document access.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="docName">Document Name</Label>
                <Input id="docName" placeholder="Enter name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="docType">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="docFile">Upload Document</Label>
                <Input id="docFile" type="file" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Brief description" />
              </div>
              <div className="space-y-2">
                <Label>Access Control</Label>
                <Select
                  onValueChange={(value) =>
                    setShowSpecificClients(value === "specific")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="specific">Specific Guards</SelectItem>
                  </SelectContent>
                </Select>
                {showSpecificClients && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search guards by name or email..."
                        value={docGuardSearch}
                        onChange={(e) =>
                          handleGuardSearch(e.target.value, "doc")
                        }
                        className="flex-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                      {filteredDocGuards.map((guard) => (
                        <div
                          key={guard.id}
                          className="flex items-center space-x-2 p-1"
                        >
                          <input
                            type="checkbox"
                            id={`doc-guard-${guard.id}`}
                            checked={selectedDocGuards.includes(guard.id)}
                            onChange={() =>
                              toggleGuardSelection(guard.id, "doc")
                            }
                          />
                          <Label
                            htmlFor={`doc-guard-${guard.id}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            <div className="font-medium">{guard.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {guard.email}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" className="shadow-sm">
                  Upload Document
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Name</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden sm:table-cell">Uploaded</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead className="hidden sm:table-cell">Access</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium sm:table-cell hidden">
                    {doc.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {doc.type}
                  </TableCell>
                  <TableCell className="sm:table-cell hidden">
                    {doc.uploaded}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {doc.size}
                  </TableCell>
                  <TableCell className="sm:table-cell hidden">
                    <Badge variant="secondary">{doc.access}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
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
