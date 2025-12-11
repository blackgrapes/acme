// File: src/app/admin-dashboard/documents/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import DocumentManagement from "@/components/admin/DocumentManagement";
import { toast } from "sonner";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({ id: "all", name: "All Documents" });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const documentCategories = [
    { id: "all", name: "All Documents" },
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

  // Fetch all clients for selection in upload dialog
  const fetchClients = async () => {
    try {
      const response = await fetch("/api/auth/client?limit=1000");
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      let url = "/api/documents?admin=true";
      if (currentCategory && currentCategory.id !== "all") {
        url += `&category=${currentCategory.id}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      } else {
        console.error("Failed to fetch documents:", response.status, response.statusText);
        let errorMsg = "Failed to load documents.";
        try {
          const errData = await response.json();
          if (errData.error) errorMsg = errData.error;
        } catch (e) { /* ignore */ }
        toast.error(`${errorMsg} Please refresh.`);
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Error loading documents");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [currentCategory]);

  const handleCategoryChange = useCallback((category) => {
    setCurrentCategory(category);
  }, []);

  // Setup global handler for sidebar
  useEffect(() => {
    window.handleDocumentCategoryChange = handleCategoryChange;

    // Set default category
    if (!currentCategory) {
      setCurrentCategory(documentCategories[0]);
    }

    return () => {
      window.handleDocumentCategoryChange = null;
    };
  }, [handleCategoryChange]);

  useEffect(() => {
    fetchDocuments();
    fetchClients();
  }, [fetchDocuments]);

  return (
    <DocumentManagement
      documents={documents}
      currentCategory={currentCategory}
      onCategoryChange={handleCategoryChange}
      documentCategories={documentCategories}
      allClients={clients}
      loading={loading}
      onRefresh={fetchDocuments}
      isCompanyDocuments={false}
    />
  );
}