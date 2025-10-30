// File: src/app/client-dashboard/company-documents/page.jsx - WITH TAB SUPPORT
"use client";

import { useState, useEffect, useCallback } from "react";
import CompanyDocuments from "@/components/client/CompanyDocuments";
import { useAuth } from "@/hooks/useAuth";

export default function CompanyDocumentsPage() {
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const { user } = useAuth();

  const companyDocumentCategories = [
    { id: "msme", name: "MSME" },
    { id: "gst", name: "GST" },
    { id: "pasara", name: "Pasara" },
    { id: "pan", name: "PAN" },
    { id: "profile", name: "Profile" },
    { id: "bank-details", name: "Bank Details" },
  ];

  const fetchCompanyDocuments = useCallback(async () => {
    try {
      let url = "/api/documents?isCompanyDocument=true&accessLevel=general";
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
    window.handleClientCompanyDocumentCategoryChange = handleCategoryChange;

    return () => {
      window.handleClientCompanyDocumentCategoryChange = null;
    };
  }, [handleCategoryChange]);

  useEffect(() => {
    fetchCompanyDocuments();
  }, [fetchCompanyDocuments]);

  return (
    <CompanyDocuments
      dummyDocuments={companyDocuments}
      currentCategory={
        currentCategory || { id: "all", name: "All Company Documents" }
      }
      onCategoryChange={handleCategoryChange}
      clientId={user?.id}
    />
  );
}
