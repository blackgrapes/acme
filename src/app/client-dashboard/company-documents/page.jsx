// File: src/app/client-dashboard/company-documents/page.jsx - FIXED
"use client";

import { useState, useEffect, useCallback } from "react";
import CompanyDocuments from "@/components/client/CompanyDocuments";
import { useAuth } from "@/hooks/useAuth";

export default function CompanyDocumentsPage() {
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({ 
    id: "all", 
    name: "All Company Documents" 
  });
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // ✅ FIXED: Correct token getter
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken') || 
           sessionStorage.getItem('authToken') ||
           document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
  };

  // ✅ FIXED: Fetch company documents
  const fetchCompanyDocuments = useCallback(async (category = "all") => {
    try {
      setLoading(true);
      const token = getToken();
      
      console.log('Company Docs - Token available:', !!token);
      
      if (!token) {
        console.warn('No auth token found');
        setCompanyDocuments([]);
        setLoading(false);
        return;
      }

      let url = '/api/client/my-documents';
      if (category !== "all") {
        url += `?category=${category}`;
      }

      console.log('Fetching company documents from:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Company Docs API Response:', {
          success: data.success,
          total: data.total,
          documents: data.documents?.length || 0,
          companyDocsCount: data.documents?.filter(doc => doc.isCompanyDocument === true).length || 0
        });
        
        if (data.success) {
          // ✅ Filter only company documents (isCompanyDocument: true)
          const companyDocs = data.documents
            .filter(doc => doc.isCompanyDocument === true)
            .map(doc => ({
              _id: doc._id || doc.id,
              name: doc.name || "Unnamed Document",
              description: doc.description || "",
              type: doc.type || "unknown",
              fileUrl: doc.fileUrl,
              size: doc.size,
              uploaded: doc.uploaded || doc.uploadDate,
              uploadedBy: doc.uploadedBy || null,
              accessLevel: doc.accessLevel || "public",
              status: doc.status || "approved",
              isCompanyDocument: true
            }));
          
          console.log('Filtered company documents:', companyDocs.length);
          console.log('Sample company document:', companyDocs[0]);
          setCompanyDocuments(companyDocs);
        } else {
          console.error('API error:', data.error);
          setCompanyDocuments([]);
        }
      } else {
        console.error('HTTP error:', response.status);
        setCompanyDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching company documents:", error);
      setCompanyDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FIXED: Fetch categories for company documents
  const fetchCategories = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No token for fetching categories');
        return;
      }

      const response = await fetch('/api/client/documents/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Company Categories response:', {
          success: data.success,
          total: data.totalCategories,
          categories: data.categories?.length || 0
        });
        
        if (data.success && data.categories) {
          const companyDocTypes = [
            "msme", "gst", "pasara", "pan", "profile", 
            "bank-details", "company", "license", "certificate"
          ];
          
          const filtered = data.categories
            .filter(cat => companyDocTypes.includes(cat.type))
            .map(cat => ({
              id: cat.type,
              name: cat.name || cat.type,
              count: cat.count || 0
            }));
          
          console.log('Available company categories:', filtered);
          setAvailableCategories(filtered);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setAvailableCategories([]);
    }
  }, []);

  // ✅ Handle category change
  const handleCategoryChange = useCallback((category) => {
    console.log('Company Category changed to:', category);
    setCurrentCategory(category);
    fetchCompanyDocuments(category.id);
  }, [fetchCompanyDocuments]);

  // ✅ Setup global handler
  useEffect(() => {
    window.handleClientCompanyDocumentCategoryChange = handleCategoryChange;
    return () => {
      window.handleClientCompanyDocumentCategoryChange = null;
    };
  }, [handleCategoryChange]);

  // ✅ Initial fetch
  useEffect(() => {
    console.log('Company Docs Page mounted, fetching data...');
    fetchCompanyDocuments();
    fetchCategories();
  }, [fetchCompanyDocuments, fetchCategories]);

  return (
    <CompanyDocuments
      companyDocuments={companyDocuments}
      currentCategory={currentCategory}
      onCategoryChange={handleCategoryChange}
      clientId={user?._id || user?.id}
      availableCategories={availableCategories}
      loading={loading}
      onDocumentsUpdate={() => fetchCompanyDocuments(currentCategory.id)}
    />
  );
}