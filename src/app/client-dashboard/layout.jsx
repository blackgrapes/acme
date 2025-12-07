// File: src/app/client-dashboard/layout.jsx - UPDATED
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

  // Navigation handler
  const handleSidebarNavigation = useCallback((tab) => {
    setActiveTab(tab);
    
    if (tab === "overview") {
      router.push("/client-dashboard");
    } else {
      router.push(`/client-dashboard/${tab}`);
    }
  }, [router]);

  // Auth protection - FIXED VERSION
useEffect(() => {
  if (loading) {
    console.log("Still loading auth...");
    return;
  }

  console.log("Auth check complete:", { 
    hasUser: !!user, 
    role: user?.role,
    roleLowercase: user?.role?.toLowerCase() 
  });

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
      />

      <div className="flex flex-1">
        <UnifiedSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documentCategories={documentCategories}
          companyDocumentCategories={companyDocumentCategories}
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