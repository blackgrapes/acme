// File: src/app/admin-dashboard/layout.jsx - FIXED
"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/admin/Header";
import UnifiedSidebar from "@/components/admin/UnifiedSidebar";
import AdminProfileDialog from "@/components/admin/AdminProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { useAuth } from "@/hooks/useAuth";

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

const companyDocumentCategories = [
  { id: "msme", name: "MSME" },
  { id: "gst", name: "GST" },
  { id: "pasara", name: "Pasara" },
  { id: "pan", name: "PAN" },
  { id: "profile", name: "Profile" },
  { id: "bank-details", name: "Bank Details" },
];

export default function AdminDashboardLayout({ children }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, hasPermission } = useAuth();

  // FIXED: Get active tab from current pathname
  useEffect(() => {
    const pathSegments = pathname.split("/");
    let currentTab = pathSegments[pathSegments.length - 1] || "dashboard";

    // If we're on /admin-dashboard, set active tab to "dashboard"
    if (pathname === "/admin-dashboard" || currentTab === "admin-dashboard") {
      currentTab = "dashboard";
    }

    // Remove category-specific tabs, keep only main tabs
    if (currentTab.includes("-")) {
      const mainTab = currentTab.split("-")[0];
      if (["documents", "company-documents"].includes(mainTab)) {
        currentTab = mainTab;
      }
    }

    setActiveTab(currentTab);
  }, [pathname]);

  // ✅ FIXED: useCallback for navigation
  const handleSidebarNavigation = useCallback(
    (tab) => {
      // Remove category part if present
      const mainTab = tab.split("-")[0];
      setActiveTab(mainTab);

      if (mainTab === "dashboard") {
        router.push("/admin-dashboard");
      } else {
        router.push(`/admin-dashboard/${mainTab}`);
      }
    },
    [router]
  );

  // ✅ FIXED: Auth protection with minimal re-renders
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    // Determine required permission based on current active tab/path
    const requiredPermissionForTab = (() => {
      try {
        const pathSegments = pathname.split("/").filter(Boolean);
        // pathSegments like ["admin-dashboard", "settings"]
        const last = pathSegments[pathSegments.length - 1] || "dashboard";

        if (last === "admin-dashboard" || last === "dashboard") return "dashboard-read";

        // Map common tabs to their read permission
        const mapping = {
          clients: "clients-read",
          documents: "documents-read",
          "company-documents": "documents-read",
          requests: "requests-read",
          guards: "guards-read",
          roles: "roles-read",
          contact: "contact-read",
          settings: "settings-read",
          frontend: "frontend-read",
        };

        // normalize if tab has subcategory like documents-xxx
        const main = last.split("-")[0];
        return mapping[main] || "dashboard-read";
      } catch (e) {
        return "dashboard-read";
      }
    })();

    if (!hasPermission(requiredPermissionForTab)) {
      // If user lacks permission for the target tab, clear auth and redirect to login
      localStorage.removeItem("authToken");
      router.push("/login");
    }
  }, [user, loading, router, hasPermission]);

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

  // Compute required permission for current path so render guard matches effect logic
  const requiredPermissionForTab = (() => {
    try {
      const pathSegments = pathname.split("/").filter(Boolean);
      const last = pathSegments[pathSegments.length - 1] || "dashboard";

      if (last === "admin-dashboard" || last === "dashboard") return "dashboard-read";

      const mapping = {
        clients: "clients-read",
        documents: "documents-read",
        "company-documents": "documents-read",
        requests: "requests-read",
        guards: "guards-read",
        roles: "roles-read",
        contact: "contact-read",
        settings: "settings-read",
        frontend: "frontend-read",
      };

      const main = last.split("-")[0];
      return mapping[main] || "dashboard-read";
    } catch (e) {
      return "dashboard-read";
    }
  })();

  if (!user || !hasPermission(requiredPermissionForTab)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={handleSidebarNavigation}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        openAdminDialog={openAdminDialog}
        setOpenAdminDialog={setOpenAdminDialog}
        documentCategories={documentCategories}
        companyDocumentCategories={companyDocumentCategories}
      />

      <div className="flex flex-1">
        <UnifiedSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab} // Pass setActiveTab directly
          documentCategories={documentCategories}
          companyDocumentCategories={companyDocumentCategories}
          isMobile={false}
        />

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </div>

      <AdminProfileDialog
        open={openAdminDialog}
        onOpenChange={setOpenAdminDialog}
      />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
