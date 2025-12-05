// File: src/app/client-dashboard/layout.jsx - UPDATED
"use client";

import { useState, useEffect } from "react";
import UnifiedSidebar from "@/components/client/UnifiedSidebar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useClientDocuments } from "@/hooks/useClientDocuments";

export default function ClientDashboardLayout({ children }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Use the hook to get actual categories
  const { categories: allCategories, fetchCategories } = useClientDocuments();
  const [documentCategories, setDocumentCategories] = useState([]);
  const [companyDocumentCategories, setCompanyDocumentCategories] = useState([]);

  // Filter categories based on type
  useEffect(() => {
    if (allCategories.length > 0) {
      const clientSpecificTypes = [
        "agreement", "attendance", "bills", "salary-sheet", "pay-slip",
        "esi", "pf", "employee-details", "training", "night-checking", "paid-gst"
      ];
      
      const companyDocTypes = [
        "msme", "gst", "pasara", "pan", "profile", "bank-details"
      ];
      
      // Client documents with count > 0
      const clientCats = allCategories
        .filter(cat => clientSpecificTypes.includes(cat.type) && cat.count > 0)
        .map(cat => ({
          id: cat.type,
          name: cat.name || cat.type,
          count: cat.count
        }));
      
      // Company documents with count > 0
      const companyCats = allCategories
        .filter(cat => companyDocTypes.includes(cat.type) && cat.count > 0)
        .map(cat => ({
          id: cat.type,
          name: cat.name || cat.type,
          count: cat.count
        }));
      
      setDocumentCategories(clientCats);
      setCompanyDocumentCategories(companyCats);
    }
  }, [allCategories]);

  // Set active tab based on pathname
  useEffect(() => {
    if (pathname.includes("/documents")) {
      setActiveTab("documents");
    } else if (pathname.includes("/company-documents")) {
      setActiveTab("company-documents");
    } else if (pathname.includes("/management")) {
      setActiveTab("management");
    } else {
      setActiveTab("overview");
    }
  }, [pathname]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <UnifiedSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        documentCategories={documentCategories}
        companyDocumentCategories={companyDocumentCategories}
        isMobile={false}
        onNavigate={() => setSidebarOpen(false)}
      />

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <UnifiedSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documentCategories={documentCategories}
          companyDocumentCategories={companyDocumentCategories}
          isMobile={true}
          onNavigate={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="font-semibold">Client Dashboard</div>
          <div className="w-10"></div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}