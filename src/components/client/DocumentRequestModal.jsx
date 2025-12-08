// File: src/components/client/DocumentRequestModal.jsx - UPDATED
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  Upload,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Building,
  X,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const DOCUMENT_TYPES = [
  { value: "agreement", label: "Agreement" },
  { value: "attendance", label: "Attendance Record" },
  { value: "bills", label: "Bills & Invoices" },
  { value: "salary-sheet", label: "Salary Sheet" },
  { value: "pay-slip", label: "Pay Slip" },
  { value: "esi", label: "ESI Documents" },
  { value: "pf", label: "PF Documents" },
  { value: "employee-details", label: "Employee Details" },
  { value: "training", label: "Training Documents" },
  { value: "night-checking", label: "Night Checking Reports" },
  { value: "paid-gst", label: "Paid GST" },
  { value: "msme", label: "MSME Certificate" },
  { value: "gst", label: "GST Certificate" },
  { value: "pasara", label: "Pasara Documents" },
  { value: "pan", label: "PAN Card" },
  { value: "profile", label: "Company Profile" },
  { value: "bank-details", label: "Bank Details" },
  { value: "license", label: "License" },
  { value: "certificate", label: "Certificate" },
  { value: "contract", label: "Contract" },
  { value: "invoice", label: "Invoice" },
  { value: "report", label: "Report" },
  { value: "other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "text-gray-600" },
  { value: "medium", label: "Medium", color: "text-blue-600" },
  { value: "high", label: "High", color: "text-orange-600" },
  { value: "urgent", label: "Urgent", color: "text-red-600" },
];

export default function DocumentRequestModal({
  open,
  onOpenChange,
  clientId,
  clientName,
  clientEmail,
  clientCompany,
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    documentName: "",
    documentType: "",
    description: "",
    priority: "medium",
    requiredBy: null,
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      documentName: "",
      documentType: "",
      description: "",
      priority: "medium",
      requiredBy: null,
    });
    setError("");
    setSuccess(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.documentName.trim()) {
      setError("Document name is required");
      return;
    }

    if (!formData.documentType) {
      setError("Please select a document type");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Get auth token
      const getToken = () => {
        if (typeof window === "undefined") return null;
        return (
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken")
        );
      };

      const token = getToken();

      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const response = await fetch("/api/client/document-requests/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          requiredBy: formData.requiredBy
            ? formData.requiredBy.toISOString()
            : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          resetForm();
          onOpenChange(false);
        }, 2000);
      } else {
        setError(data.error || "Failed to submit request");
      }
    } catch (err) {
      console.error("Error submitting request:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Request New Document
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to request a new document. Our team will
            process your request within 24-48 hours.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Request Submitted Successfully!
            </h3>
            <p className="text-muted-foreground">
              Your document request has been submitted. We'll notify you once
              it's processed.
            </p>
            <Button  onClick={handleClose} className="mt-6 cursor-pointer">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 py-2">
            {/* Client Info Display - WITHOUT COMPANY */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Requesting as:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{clientEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{clientName}</span>
                </div>
                {/* Optional: Show company only if available */}
                {clientCompany && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{clientCompany}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Document Name */}
            <div className="space-y-2">
              <Label htmlFor="documentName" className="text-sm font-medium">
                Document Name *
              </Label>
              <Input
                id="documentName"
                placeholder="e.g., January 2024 Salary Sheet, Company GST Certificate"
                value={formData.documentName}
                onChange={(e) => handleChange("documentName", e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <Label htmlFor="documentType" className="text-sm font-medium">
                Document Type *
              </Label>
              <Select
                value={formData.documentType}
                onValueChange={(value) => handleChange("documentType", value)}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Provide additional details about the document you need..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={loading}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Mention specific details like period, format requirements, or
                purpose
              </p>
            </div>

            {/* Priority and Required By */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleChange("priority", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={option.color}>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Required By */}
              <div className="space-y-2">
                <Label htmlFor="requiredBy" className="text-sm font-medium">
                  Required By (Optional)
                </Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full cursor-pointer justify-start text-left font-normal h-10"
                        disabled={loading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.requiredBy ? (
                          format(formData.requiredBy, "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Select date
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 shadow-lg bg-white"
                      align="start"
                    >
                      <div className="p-3 bg-card">
                        <div className="mb-2 px-2 bg-white">
                          <h3 className="font-medium text-sm">
                            Select Required Date
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Past dates are disabled
                          </p>
                        </div>
                        <Calendar
                          mode="single"
                          selected={formData.requiredBy}
                          onSelect={(date) => handleChange("requiredBy", date)}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          className="rounded-md bg-white"
                          classNames={{
                            months:
                              "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                            month: "space-y-4",
                            caption:
                              "flex justify-center pt-1 relative items-center",
                            caption_label: "text-sm font-medium",
                            nav: "space-x-1 flex items-center",
                            nav_button:
                              "h-7 w-7 cursor-pointer bg-transparent p-0 opacity-50 hover:opacity-100",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell:
                              "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                            day_selected:
                              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                            day_today: "bg-accent text-accent-foreground",
                            day_outside: "text-muted-foreground opacity-50",
                            day_disabled: "text-muted-foreground opacity-50",
                            day_range_middle:
                              "aria-selected:bg-accent aria-selected:text-accent-foreground",
                            day_hidden: "invisible",
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  {formData.requiredBy && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleChange("requiredBy", null)}
                      disabled={loading}
                      className="h-10 w-10 cursor-pointer"
                      title="Clear date"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form Actions */}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  loading || !formData.documentName || !formData.documentType
                }
                className="gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Send Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
