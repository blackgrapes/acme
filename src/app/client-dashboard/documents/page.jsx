// File: src/app/client-dashboard/documents/page.jsx - WITH TAB SUPPORT
"use client";

import { useState, useEffect, useCallback } from "react";
import ClientDocuments from "@/components/client/ClientDocuments";
import { useAuth } from "@/hooks/useAuth";

export default function DocumentsPage() {
  const [clientDocuments, setClientDocuments] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const { user } = useAuth();

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

  const fetchClientDocuments = useCallback(async () => {
    if (!user?.id) return;
    try {
      let url = `/api/documents?clientId=${user.id}`;
      if (currentCategory && currentCategory.id !== "all") {
        url += `&category=${currentCategory.id}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setClientDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Error fetching client documents:", error);
      setClientDocuments([]);
    }
  }, [user?.id, currentCategory]);

  // ✅ OPTIMIZED: Handle category change from sidebar - NO ROUTE CHANGE
  const handleCategoryChange = useCallback((category) => {
    setCurrentCategory(category);
  }, []);

  // ✅ SETUP: Global handler for sidebar category changes
  useEffect(() => {
    window.handleClientDocumentCategoryChange = handleCategoryChange;

    return () => {
      window.handleClientDocumentCategoryChange = null;
    };
  }, [handleCategoryChange]);

  useEffect(() => {
    fetchClientDocuments();
  }, [fetchClientDocuments]);

  return (
    <ClientDocuments
      clientDocuments={clientDocuments}
      currentCategory={currentCategory || { id: "all", name: "All Documents" }}
      onCategoryChange={handleCategoryChange}
      clientId={user?.id}
      onDocumentsUpdate={fetchClientDocuments}
    />
  );
}
