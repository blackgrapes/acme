// File: src/app/client-dashboard/documents/page.jsx
"use client";

import { useState, useEffect } from "react";
import ClientDocuments from "@/components/client/ClientDocuments";
import { useAuth } from "@/hooks/useAuth";

export default function DocumentsPage() {
  const [clientDocuments, setClientDocuments] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({
    id: "all",
    name: "All Documents"
  });
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken') ||
      sessionStorage.getItem('authToken') ||
      document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
  };

  const fetchClientDocuments = async (category = "all") => {
    try {
      setLoading(true);
      const token = getToken();

      console.log('Token available:', !!token);

      if (!token) {
        console.error('No auth token found');
        setClientDocuments([]);
        setLoading(false);
        return;
      }

      let url = '/api/client/my-documents';
      if (category !== "all") {
        url += `?category=${category}`;
      }

      console.log('Fetching documents from:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', {
          success: data.success,
          total: data.total,
          documents: data.documents?.length || 0
        });

        if (data.success) {
          const clientDocs = data.documents
            .filter(doc => doc.isCompanyDocument === false)
            .map(doc => ({
              _id: doc._id || doc.id,
              name: doc.name || "Unnamed Document",
              description: doc.description || "",
              type: doc.type || "unknown",
              fileUrl: doc.fileUrl,
              size: doc.size,
              uploaded: doc.uploaded || doc.uploadDate,
              uploadedBy: doc.uploadedBy || null,
              accessLevel: doc.accessLevel || "specific",
              status: doc.status || "approved",
              isCompanyDocument: doc.isCompanyDocument || false,
              // ✅ CHANGE: Add these new fields
              originalName: doc.originalName,
              fileName: doc.fileName,
              documentStartDate: doc.documentStartDate,
              documentEndDate: doc.documentEndDate,
              documentPeriod: doc.documentPeriod
            }));

          console.log('Filtered client documents:', clientDocs.length);
          console.log('Sample document:', clientDocs[0]);
          setClientDocuments(clientDocs);
        } else {
          console.error('API error:', data.error);
          setClientDocuments([]);
        }
      } else {
        console.error('HTTP error:', response.status);
        setClientDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching client documents:", error);
      setClientDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
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
        console.log('Categories response:', {
          success: data.success,
          total: data.totalCategories,
          categories: data.categories?.length || 0
        });

        if (data.success && data.categories) {
          // ✅ Dynamic Categories: Show all categories returned by API
          // This includes client-specific types AND any types from uploaded documents
          const dynamicCategories = data.categories.map(cat => ({
            id: cat.type,
            name: cat.name || cat.type,
            count: cat.count || 0
          }));

          console.log('Available dynamic categories:', dynamicCategories);
          setAvailableCategories(dynamicCategories);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setAvailableCategories([]);
    }
  };

  const handleCategoryChange = (category) => {
    console.log('Category changed to:', category);
    setCurrentCategory(category);
    fetchClientDocuments(category.id);
  };

  useEffect(() => {
    window.handleClientDocumentCategoryChange = handleCategoryChange;
    return () => {
      window.handleClientDocumentCategoryChange = null;
    };
  }, []);

  useEffect(() => {
    console.log('Component mounted, fetching data...');
    fetchClientDocuments();
    fetchCategories();
  }, []);

  return (
    <ClientDocuments
      clientDocuments={clientDocuments}
      currentCategory={currentCategory}
      onCategoryChange={handleCategoryChange}
      clientId={user?._id || user?.id}
      availableCategories={availableCategories}
      loading={loading || authLoading}
      onDocumentsUpdate={() => fetchClientDocuments(currentCategory.id)}
    />
  );
}