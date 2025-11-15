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
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    const docName = document.getElementById("docName").value.trim();
    const desc = document.getElementById("description").value.trim();

    if (!docName || !selectedType) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: user?.name || "Client",
          clientEmail: user?.email || "client@example.com",
          documentName: docName,
          documentType: selectedType,
          description: desc,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Request Sent!",
          description: "Your document request was successfully submitted.",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send request.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Request error:", err);
      toast({
        title: "Error",
        description: "Something went wrong while sending request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request New Document</DialogTitle>
          <DialogDescription>
            Fill in the details below to request a new document.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="docName">Document Name</Label>
            <Input id="docName" placeholder="Enter document name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="docType">Document Type</Label>
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
                    <SelectItem
                      key={category.id}
                      value={category.name.toLowerCase()}
                    >
                      {category.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Short description" />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSendRequest}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
