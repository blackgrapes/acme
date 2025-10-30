// File: src/app/admin-dashboard/documents/page.jsx - WITH TAB SUPPORT
"use client";

import { useState, useEffect, useCallback } from "react";
import DocumentManagement from "@/components/admin/DocumentManagement";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

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

  // ✅ OPTIMIZED: Fetch documents
  const fetchDocuments = useCallback(async () => {
    try {
      let url = "/api/documents";
      if (currentCategory && currentCategory.id !== "all") {
        url += `?category=${currentCategory.id}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    }
  }, [currentCategory]);

  // ✅ OPTIMIZED: Handle category change from sidebar - NO ROUTE CHANGE
  const handleCategoryChange = useCallback((category) => {
    setCurrentCategory(category);
  }, []);

  // ✅ SETUP: Global handler for sidebar category changes
  useEffect(() => {
    window.handleDocumentCategoryChange = handleCategoryChange;

    return () => {
      window.handleDocumentCategoryChange = null;
    };
  }, [handleCategoryChange]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <DocumentManagement
      dummyDocuments={documents}
      currentCategory={currentCategory || { id: "all", name: "All Documents" }}
      onCategoryChange={handleCategoryChange}
      documentCategories={documentCategories}
      isCompanyDocuments={false}
    />
  );
}
