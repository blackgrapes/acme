// File: src/app/client-dashboard/service-overview/page.jsx
"use client";

import { useState, useEffect } from "react";
import ServiceOverview from "@/components/client/ServiceOverview";
import { useAuth } from "@/hooks/useAuth";

export default function ServiceOverviewPage() {
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchServiceOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get auth token
      const getToken = () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('authToken') || 
               sessionStorage.getItem('authToken');
      };
      
      const token = getToken();
      
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await fetch('/api/client/service-overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setServiceData(data.data);
        } else {
          setError(data.error || "Failed to fetch service overview");
        }
      } else {
        setError(`HTTP Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching service overview:", error);
      setError("Failed to load service overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchServiceOverview();
    }
  }, [user]);

  const handleRefresh = () => {
    fetchServiceOverview();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <ServiceOverview 
        serviceData={serviceData} 
        loading={loading}
      />
      
      {error && !loading && (
        <div className="mt-6 p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-red-800">Error loading service overview</p>
              <p className="text-sm text-red-600">{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}