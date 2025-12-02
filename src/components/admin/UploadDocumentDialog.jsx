"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Upload, X, Calendar } from "lucide-react";

export function UploadDocumentDialog({ open, onOpenChange, clientId, onUpload, isAdmin = false }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedClients, setSelectedClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [category, setCategory] = useState("client");
  
  // NEW: Date fields
  const [dateOption, setDateOption] = useState("none"); // none, single, range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customPeriod, setCustomPeriod] = useState("");

  const documentCategories = [
    { id: "agreement", name: "Agreement" },
    { id: "attendance", name: "Attendance" },
    { id: "bills", name: "Bills" },
    { id: "salary-sheet", name: "Salary Sheet" },
    { id: "pay-slip", name: "Pay Slip" },
    { id: "esi", name: "ESI" },
    { id: "pf", name: "PF" },
    { id: "employee-details", name: "Employee Details" },
    { id: "training", name: "Training" },
    { id: "night-checking", name: "Night Checking" },
    { id: "paid-gst", name: "Paid GST" },
  ];

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Fetch clients if admin mode
  useEffect(() => {
    if (isAdmin && open) {
      fetchClients();
    }
  }, [isAdmin, open]);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/auth/client?limit=1000");
      if (response.ok) {
        const data = await response.json();
        setAllClients(data.clients || []);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (100MB max)
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast.error("File size must be less than 100MB");
        e.target.value = ""; // Clear the file input
        return;
      }
      setFile(selectedFile);
      
      // Auto-fill name from file name (without extension)
      if (!name) {
        const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setName(fileNameWithoutExt);
      }
    }
  };

  // Reset form function
  const resetForm = () => {
    setName("");
    setDescription("");
    setType("");
    setFile(null);
    setSelectedClients([]);
    setCategory("client");
    setDateOption("none");
    setStartDate("");
    setEndDate("");
    setCustomPeriod("");
    setUploading(false);
    setProgress(0);
    
    // Reset file input element
    const fileInput = document.getElementById("file");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault(); // CRITICAL: Prevent form auto-submit
    
    console.log("🔄 Starting upload process...");
    
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (!type) {
      toast.error("Please select a document type");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a document name");
      return;
    }

    // Validate dates if selected
    if (dateOption === "single" && !startDate) {
      toast.error("Please select a start date");
      return;
    }
    
    if (dateOption === "range") {
      if (!startDate || !endDate) {
        toast.error("Please select both start and end dates");
        return;
      }
      if (new Date(startDate) > new Date(endDate)) {
        toast.error("Start date cannot be after end date");
        return;
      }
    }

    setUploading(true);
    setProgress(10);

    try {
      // Get token from localStorage or auth context
      const token = localStorage.getItem("token") || 
                    sessionStorage.getItem("token") ||
                    localStorage.getItem("authToken") ||
                    sessionStorage.getItem("authToken");
      
      console.log("🔑 Token found:", !!token);
      
      if (!token) {
        toast.error("Please login to upload documents");
        setUploading(false);
        return;
      }

      // Step 1: Upload file to server
      const formData = new FormData();
      formData.append("file", file);
      if (clientId && !isAdmin) {
        formData.append("clientId", clientId);
      }

      setProgress(30);
      
      console.log("📤 Uploading file to server...");
      
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      setProgress(60);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error("❌ File upload failed:", errorData);
        throw new Error(errorData.error || "File upload failed");
      }

      const uploadData = await uploadResponse.json();
      console.log("✅ File uploaded successfully:", uploadData);

      setProgress(80);

      // Step 2: Create document record
      const documentData = {
        name: name || file.name,
        description,
        type,
        fileId: uploadData.fileId,
        fileName: uploadData.fileName,
        originalName: file.name,
        fileUrl: uploadData.fileUrl,
        size: uploadData.size,
        mimeType: uploadData.mimeType,
        // Add date fields
        documentStartDate: startDate || null,
        documentEndDate: endDate || null,
        documentPeriod: customPeriod || generateDocumentPeriod()
      };

      console.log("📝 Creating document record:", documentData);

      // For admin mode, add category and client selections
      if (isAdmin) {
        documentData.category = category;
        
        if (category === "client") {
          if (selectedClients.length > 0) {
            documentData.specificClients = selectedClients;
          } else if (clientId) {
            documentData.targetClient = clientId;
          }
        }
        
        // Use admin API
        console.log("🛡️ Using admin API...");
        const response = await fetch("/api/admin/documents", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(documentData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ Admin API error:", errorData);
          throw new Error(errorData.error || "Failed to create document record");
        }
        
        console.log("✅ Document created via admin API");
      } else {
        // Use client-specific API
        console.log("👤 Using client API for client:", clientId);
        const response = await fetch(`/api/auth/client/${clientId}/documents`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(documentData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ Client API error:", errorData);
          throw new Error(errorData.error || "Failed to create document record");
        }
        
        console.log("✅ Document created via client API");
      }

      setProgress(100);
      console.log("🎉 Upload complete!");

      // Notify parent
      if (onUpload) {
        onUpload();
      }

      toast.success("Document uploaded successfully!");
      
      // Close dialog after delay
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
      }, 1000);

    } catch (error) {
      console.error("❌ Upload error:", error);
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // Helper function to generate document period string
  const generateDocumentPeriod = () => {
    if (dateOption === "none") return "";
    
    if (dateOption === "single" && startDate) {
      const date = new Date(startDate);
      return `From ${date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      })}`;
    }
    
    if (dateOption === "range" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return `${start.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      })} to ${end.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      })}`;
    }
    
    return customPeriod;
  };

  const handleClientToggle = (clientId) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("📝 Form submitted manually");
    handleUpload(e);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isAdmin ? "Upload Document (Admin)" : "Upload Client Document"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Admin-only: Category Selection */}
          {isAdmin && (
            <div className="space-y-3">
              <Label>Document Category</Label>
              <Select 
                value={category} 
                onValueChange={setCategory}
                disabled={uploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client Document</SelectItem>
                  <SelectItem value="company">Company Document</SelectItem>
                  <SelectItem value="general">General Document</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {category === "company" 
                  ? "Visible to all clients"
                  : category === "general"
                  ? "Visible to authorized users only"
                  : "Visible to selected clients only"}
              </p>
            </div>
          )}

          {/* Client Selection (Admin mode, client category) */}
          {isAdmin && category === "client" && (
            <div className="space-y-3">
              <Label>Select Clients</Label>
              <div className="max-h-60 overflow-y-auto border rounded-md p-3 space-y-2">
                {allClients.map(client => (
                  <div key={client._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`client-${client._id}`}
                      checked={selectedClients.includes(client._id)}
                      onCheckedChange={() => handleClientToggle(client._id)}
                      disabled={uploading}
                    />
                    <label
                      htmlFor={`client-${client._id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {client.name} ({client.companyName || "No Company"})
                    </label>
                  </div>
                ))}
              </div>
              {selectedClients.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Selected {selectedClients.length} client(s)
                </p>
              )}
            </div>
          )}

          {/* Document Details */}
          <div className="space-y-3">
            <Label htmlFor="name">Document Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter document name (will be used in downloaded filename)"
              required
              disabled={uploading}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description"
              rows={3}
              disabled={uploading}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="type">Document Type *</Label>
            <Select 
              value={type} 
              onValueChange={setType} 
              required
              disabled={uploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* NEW: Document Date/Period Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <Label className="text-lg">Document Period</Label>
            </div>
            
            <RadioGroup 
              value={dateOption} 
              onValueChange={setDateOption} 
              className="space-y-3"
              disabled={uploading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">No specific period</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Single date (e.g., for specific month)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="range" />
                <Label htmlFor="range">Date range (start to end)</Label>
              </div>
            </RadioGroup>

            {/* Show date inputs based on selection */}
            {dateOption === "single" && (
              <div className="space-y-3 ml-6">
                <Label htmlFor="startDate">Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  disabled={uploading}
                />
              </div>
            )}

            {dateOption === "range" && (
              <div className="space-y-3 ml-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDateRange">Start Date *</Label>
                    <Input
                      id="startDateRange"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      disabled={uploading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDateRange">End Date *</Label>
                    <Input
                      id="endDateRange"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Custom period description */}
            {(dateOption === "single" || dateOption === "range") && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="customPeriod">Period Description (Optional)</Label>
                <Input
                  id="customPeriod"
                  value={customPeriod}
                  onChange={(e) => setCustomPeriod(e.target.value)}
                  placeholder="e.g., January 2024, Q1 2024, etc."
                  disabled={uploading}
                />
                <p className="text-sm text-muted-foreground">
                  {generateDocumentPeriod() || "No period description"}
                </p>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="file">File *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {file ? (
                <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-2">
                    Drag & drop your file here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Max file size: 100MB
                  </p>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("file").click()}
                    disabled={uploading}
                  >
                    Browse Files
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={uploading}
              onClick={handleUpload}
            >
              {uploading ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}