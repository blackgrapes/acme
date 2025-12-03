// File: src/app/admin-dashboard/company-documents/page.jsx - UPDATED
"use client";

import { useState, useEffect, useCallback } from "react";
import DocumentManagement from "@/components/admin/DocumentManagement";

export default function CompanyDocumentsPage() {
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({ id: "all", name: "All Company Documents" });
  const [loading, setLoading] = useState(true);

  const companyDocumentCategories = [
    { id: "all", name: "All Company Documents" },
    { id: "msme", name: "MSME" },
    { id: "gst", name: "GST" },
    { id: "pasara", name: "Pasara" },
    { id: "pan", name: "PAN" },
    { id: "profile", name: "Profile" },
    { id: "bank-details", name: "Bank Details" },
  ];

  const fetchCompanyDocuments = useCallback(async () => {
    try {
      setLoading(true);
      let url = "/api/documents?isCompanyDocument=true";
      if (currentCategory && currentCategory.id !== "all") {
        url += `&category=${currentCategory.id}`;
      }

      console.log("Fetching company documents from:", url);
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCompanyDocuments(data.documents || []);
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch company documents:", errorData);
        setCompanyDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching company documents:", error);
      setCompanyDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [currentCategory]);

  const handleCategoryChange = useCallback((category) => {
    console.log("Category changed to:", category);
    setCurrentCategory(category);
  }, []);

  // Setup global handler for sidebar
  useEffect(() => {
    window.handleCompanyDocumentCategoryChange = handleCategoryChange;
    
    // Set default category
    if (!currentCategory.id) {
      setCurrentCategory(companyDocumentCategories[0]);
    }

    return () => {
      window.handleCompanyDocumentCategoryChange = null;
    };
  }, [handleCategoryChange]);

  useEffect(() => {
    fetchCompanyDocuments();
  }, [fetchCompanyDocuments]);

  return (
    <DocumentManagement
      documents={companyDocuments}
      currentCategory={currentCategory}
      onCategoryChange={handleCategoryChange}
      documentCategories={companyDocumentCategories}
      loading={loading}
      onRefresh={fetchCompanyDocuments}
      isCompanyDocuments={true}
    />
  );
}