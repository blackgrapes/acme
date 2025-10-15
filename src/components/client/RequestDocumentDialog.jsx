// File: src/components/client/RequestDocumentDialog.jsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

const documentCategories = [
  { id: "agreement", name: "Agreement" },
  { id: "attendance", name: "Attendance" },
  { id: "bills", name: "Bills" },
  { id: "salary-slips", name: "Salary Slips" },
  { id: "pay-slips", name: "Pay Slips" },
  { id: "esi", name: "ESI" },
  { id: "pf", name: "PF" },
  { id: "employee-details", name: "Employee Details" },
  { id: "training", name: "Training" },
  { id: "night-checking", name: "Night Checking" },
  { id: "paid-gst", name: "Paid GST" },
  {
    id: "company-documents",
    name: "Company Documents",
    children: ["MSME", "GST", "Pasara", "PAN", "Profile", "Bank Details"],
  },
];

export default function RequestDocumentDialog({ open, onOpenChange }) {
  const [selectedType, setSelectedType] = useState("");
  const [showSpecificClients, setShowSpecificClients] = useState(false);
  const [docGuardSearch, setDocGuardSearch] = useState("");
  const [selectedDocGuards, setSelectedDocGuards] = useState([]);
  const [filteredDocGuards, setFilteredDocGuards] = useState([]); // Placeholder for guards

  // Handle guard search for access control
  const handleGuardSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setDocGuardSearch(value);
    // Implement guard filtering logic when guard data is available
  };

  // Toggle guard selection for access control
  const toggleGuardSelection = (guardId) => {
    setSelectedDocGuards((prev) =>
      prev.includes(guardId)
        ? prev.filter((id) => id !== guardId)
        : [...prev, guardId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request New Document</DialogTitle>
          <DialogDescription>
            Request a new document to be uploaded.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="docName">Document Name</Label>
            <Input id="docName" placeholder="Enter name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="docType">Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {documentCategories.map((category) =>
                  category.children ? (
                    <SelectGroup key={category.id}>
                      <SelectLabel>{category.name}</SelectLabel>
                      {category.children.map((child) => (
                        <SelectItem key={child} value={child.toLowerCase()}>
                          {child}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ) : (
                    <SelectItem key={category.id} value={category.name.toLowerCase()}>
                      {category.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
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
                <SelectItem value="admin">Admin Only</SelectItem>
              </SelectContent>
            </Select>
            {showSpecificClients && (
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search guards by name or email..."
                    value={docGuardSearch}
                    onChange={handleGuardSearch}
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
                        onChange={() => toggleGuardSelection(guard.id)}
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
            <Button
              type="submit"
              className="shadow-sm"
              onClick={() => onOpenChange(false)}
            >
              Request Document
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
