// File: src/hooks/useClientDocuments.js - COMPLETELY FIXED
import { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

// Improved auth token getter
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  // Check all possible token locations
  try {
    const tokenFromLocal = localStorage.getItem('authToken') || localStorage.getItem('authToken');
    const tokenFromSession = sessionStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const tokenFromCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('token=') || row.startsWith('authToken='))
      ?.split('=')[1];
    
    return tokenFromLocal || tokenFromSession || tokenFromCookie || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export function useClientDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Fetch client's documents
  const fetchDocuments = useCallback(async (category = 'all', search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      
      // Don't throw error if no token - just return empty
      if (!token) {
        console.warn('No authentication token found. User might not be logged in.');
        setDocuments([]);
        setLoading(false);
        return;
      }
      
      let url = `${API_BASE}/api/client/my-documents`;
      const params = new URLSearchParams();
      
      if (category && category !== 'all') {
        params.append('category', category);
      }
      
      if (search) {
        params.append('search', search);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
     
      // Handle unauthorized/expired token
      if (response.status === 401 || response.status === 403) {
        console.warn('Token expired or unauthorized');
        setDocuments([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
       console.log('Fetch documents response status:', data);
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      if (data.success) {
        setDocuments(data.documents || []);
      } else {
        throw new Error(data.error || 'Failed to fetch documents');
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Failed to fetch documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch document categories
  const fetchCategories = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('No token for fetching categories');
        setCategories([]);
        return;
      }
      
      const response = await fetch(`${API_BASE}/api/client/documents/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Handle unauthorized
      if (response.status === 401 || response.status === 403) {
        console.warn('Unauthorized to fetch categories');
        setCategories([]);
        return;
      }
      
      const data = await response.json();
      console.log('Fetch categories response status:', data);
      if (response.ok && data.success) {
        setCategories(data.categories || []);
      } else {
        console.warn('Failed to fetch categories:', data.error);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  }, []);
  
  // Download document
  const downloadDocument = async (documentId, fileName) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(
        `${API_BASE}/api/client/my-documents/${documentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      if (data.success && data.document.fileUrl) {
        const link = document.createElement('a');
        link.href = data.document.fileUrl;
        link.download = fileName || data.document.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return { success: true, document: data.document };
      } else {
        throw new Error('Document not found or no download URL');
      }
    } catch (err) {
      console.error('Error downloading document:', err);
      throw err;
    }
  };
  
  // Refresh documents
  const refresh = useCallback((category = 'all', search = '') => {
    fetchDocuments(category, search);
  }, [fetchDocuments]);
  
  // Initialize - fetch documents only
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  // Return ALL needed functions
  return {
    documents,
    loading,
    error,
    categories,
    fetchDocuments,
    fetchCategories, // ✅ ADDED THIS LINE - IMPORTANT!
    downloadDocument,
    refresh,
    hasDocuments: documents.length > 0
  };
}