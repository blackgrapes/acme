// File: src/app/client-dashboard/layout.jsx - FIXED
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/client/Header";
import UnifiedSidebar from "@/components/client/UnifiedSidebar";
import ClientProfileDialog from "@/components/client/ClientProfileDialog";
import RequestDocumentDialog from "@/components/client/RequestDocumentDialog";
import ContactSupportDialog from "@/components/client/ContactSupportDialog";
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

export default function ClientDashboardLayout({ children }) {
  const [openProfile, setOpenProfile] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openRequestDoc, setOpenRequestDoc] = useState(false);
  const [openContact, setOpenContact] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // ✅ FIXED: Get active tab from current pathname
  useEffect(() => {
    let currentTab = "overview";
    if (
      pathname === "/client-dashboard" ||
      pathname.endsWith("client-dashboard")
    ) {
      currentTab = "overview";
    } else {
      const segments = pathname.split("/");
      currentTab = segments[segments.length - 1] || "overview";

      // Remove category-specific tabs, keep only main tabs
      if (currentTab.includes("-")) {
        const mainTab = currentTab.split("-")[0];
        if (["documents", "company-documents"].includes(mainTab)) {
          currentTab = mainTab;
        }
      }
    }

    setActiveTab(currentTab);
  }, [pathname]);

  // ✅ FIXED: Handle sidebar navigation
  const handleSidebarNavigation = useCallback(
    (tab) => {
      // Remove category part if present
      const mainTab = tab.split("-")[0];
      setActiveTab(mainTab);

      if (mainTab === "overview") {
        router.push("/client-dashboard");
      } else {
        router.push(`/client-dashboard/${mainTab}`);
      }
    },
    [router]
  );

  // ✅ FIXED: Auth protection
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "Client") {
      localStorage.removeItem("authToken");
      router.push("/login");
      return;
    }
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

  if (!user || user.role !== "Client") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={handleSidebarNavigation}
        documentCategories={documentCategories}
        companyDocumentCategories={companyDocumentCategories}
      />

      <div className="flex flex-1">
        <UnifiedSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab} // ✅ Pass setActiveTab directly
          documentCategories={documentCategories}
          companyDocumentCategories={companyDocumentCategories}
          isMobile={false}
        />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
            {children}
          </div>
        </main>
      </div>

      <ClientProfileDialog
        open={openProfile}
        onOpenChange={setOpenProfile}
        user={user}
      />
      <RequestDocumentDialog
        open={openRequestDoc}
        onOpenChange={setOpenRequestDoc}
      />
      <ContactSupportDialog open={openContact} onOpenChange={setOpenContact} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
