// File: src/app/client-dashboard/layout.jsx - UPDATED PATH CHECK
"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/client/Header";
import UnifiedSidebar from "@/components/client/UnifiedSidebar";
import ClientProfileDialog from "@/components/client/ClientProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { useAuth } from "@/hooks/useAuth";
import { useClientDocuments } from "@/hooks/useClientDocuments";

export default function ClientDashboardLayout({ children }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openClientDialog, setOpenClientDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const router = useRouter();
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

  // Set active tab based on pathname - UPDATED
  useEffect(() => {
    if (pathname.includes("/document-requests")) {
      setActiveTab("document-requests");
    } else if (pathname.includes("/documents")) {
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

  // Fetch pending requests count
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch('/api/client/document-requests/create?status=pending&limit=1');
        const data = await response.json();
        if (data.success) {
          setPendingRequestsCount(data.pagination?.totalItems || 0);
        }
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingRequests();
  }, []);

  // Navigation handler
  const handleSidebarNavigation = useCallback((tab) => {
    setActiveTab(tab);
    
    if (tab === "overview") {
      router.push("/client-dashboard");
    } else if (tab === "document-requests") {
      router.push("/client-dashboard/document-requests"); // Direct route
    } else {
      router.push(`/client-dashboard/${tab}`);
    }
  }, [router]);

  // Auth protection
  useEffect(() => {
    if (loading) {
      console.log("Still loading auth...");
      return;
    }

    if (!user) {
      console.log("No user found, redirecting to login");
      router.push("/login");
      return;
    }

    // Check if user is a client (case-insensitive)
    const userRole = user?.role?.toLowerCase();
    if (userRole !== "client") {
      console.log(`Invalid role: "${user?.role}" (normalized: "${userRole}"), redirecting to login`);
      router.push("/login");
      return;
    }

    console.log("User is client, allowing access");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={handleSidebarNavigation}
        documentCategories={documentCategories}
        companyDocumentCategories={companyDocumentCategories}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        openClientDialog={openClientDialog}
        setOpenClientDialog={setOpenClientDialog}
        pendingRequestsCount={pendingRequestsCount} // Pass count
      />

      <div className="flex flex-1">
        <UnifiedSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documentCategories={documentCategories}
          companyDocumentCategories={companyDocumentCategories}
          pendingRequestsCount={pendingRequestsCount} // Pass count
          isMobile={false}
        />

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </div>

      <ClientProfileDialog
        open={openClientDialog}
        onOpenChange={setOpenClientDialog}
        user={user}
      />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}