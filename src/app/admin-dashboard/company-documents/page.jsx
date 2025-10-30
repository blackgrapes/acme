// File: src/app/admin-dashboard/company-documents/page.jsx - WITH TAB SUPPORT
"use client";

import { useState, useEffect, useCallback } from "react";
import DocumentManagement from "@/components/admin/DocumentManagement";

export default function CompanyDocumentsPage() {
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  const companyDocumentCategories = [
    { id: "msme", name: "MSME" },
    { id: "gst", name: "GST" },
    { id: "pasara", name: "Pasara" },
    { id: "pan", name: "PAN" },
    { id: "profile", name: "Profile" },
    { id: "bank-details", name: "Bank Details" },
  ];

  // ✅ OPTIMIZED: Fetch company documents
  const fetchCompanyDocuments = useCallback(async () => {
    try {
      let url = "/api/documents?isCompanyDocument=true";
      if (currentCategory && currentCategory.id !== "all") {
        url += `&category=${currentCategory.id}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCompanyDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Error fetching company documents:", error);
      setCompanyDocuments([]);
    }
  }, [currentCategory]);

  // ✅ OPTIMIZED: Handle category change from sidebar - NO ROUTE CHANGE
  const handleCategoryChange = useCallback((category) => {
    setCurrentCategory(category);
  }, []);

  // ✅ SETUP: Global handler for sidebar category changes
  useEffect(() => {
    window.handleCompanyDocumentCategoryChange = handleCategoryChange;

    return () => {
      window.handleCompanyDocumentCategoryChange = null;
    };
  }, [handleCategoryChange]);

  useEffect(() => {
    fetchCompanyDocuments();
  }, [fetchCompanyDocuments]);

  return (
    <DocumentManagement
      dummyDocuments={companyDocuments}
      currentCategory={
        currentCategory || { id: "all", name: "All Company Documents" }
      }
      onCategoryChange={handleCategoryChange}
      companyDocumentCategories={companyDocumentCategories}
      isCompanyDocuments={true}
    />
  );
}
