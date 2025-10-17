// File: app/client-dashboard/page.jsx - UPDATED & STRICT
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/client/Header";
import DesktopSidebar from "@/components/client/DesktopSidebar";
import ClientOverview from "@/components/client/ClientOverview";
import ServiceReports from "@/components/client/ServiceReports";
import ClientDocuments from "@/components/client/ClientDocuments";
import ClientManagement from "@/components/client/ClientManagement";

const documentCategories = [
  { id: "agreement", name: "Agreement" },
  { id: "attendance", name: "Attendance" },
  { id: "bills", name: "Bills" },
  { id: "salary-slips", name: "Salary Slips" },
  { id: "pay-slips", name: "Pay Slips" },
  { id: "esi", name: "ESI" },
  { id: "pf", name: "PF" },
  { id: "employee-details", name: "Employee Details" },
  { id: "training", name: "Training" },
  { id: "night-checking", name: "Night Checking" },
  { id: "paid-gst", name: "Paid GST" },
  {
    id: "company-documents",
    name: "Company Documents",
    children: ["MSME", "GST", "Pasara", "PAN", "Profile", "Bank Details"],
  },
];

const dummyServiceReports = [
  {
    id: 1,
    code: "SR-001",
    date: "2025-01-15",
    hours: "8 hours",
    location: "ABC Corporation - Main Building",
    officer: "Officer Johnson",
    status: "completed",
    details:
      "Regular security patrol and building monitoring. Conducted hourly perimeter checks, monitored CCTV systems, and ensured all access points were secure. No incidents reported during shift.",
  },
  {
    id: 2,
    code: "SR-002",
    date: "2025-01-14",
    hours: "12 hours",
    location: "ABC Corporation - Parking Garage",
    officer: "Officer Smith",
    status: "completed",
    details:
      "Overnight security coverage for parking facility. Monitored parking garage overnight, conducted vehicle patrols, and assisted with late-night employee access. All vehicles accounted for.",
  },
  {
    id: 3,
    code: "SR-003",
    date: "2025-01-16",
    hours: "8 hours",
    location: "ABC Corporation - Main Building",
    officer: "Officer Davis",
    status: "in-progress",
    details:
      "Daytime security and reception duties. Currently providing front desk security, visitor management, and access control for main building entrance.",
  },
];

const dummyIncidentReports = [
  {
    id: 1,
    code: "IR-001",
    date: "2025-01-12",
    time: "14:30",
    type: "Security Breach",
    location: "ABC Corporation - Loading Dock",
    officer: "Officer Johnson",
    severity: "Medium",
    status: "resolved",
    description:
      "Unauthorized individual attempted to enter through loading dock area.",
    actions:
      "Individual was approached and escorted off premises. Incident logged and management notified.",
  },
  {
    id: 2,
    code: "IR-002",
    date: "2025-01-10",
    time: "09:15",
    type: "Vandalism",
    location: "ABC Corporation - Parking Lot B",
    officer: "Officer Smith",
    severity: "Low",
    status: "closed",
    description: "Minor graffiti discovered on exterior wall of building.",
    actions:
      "Area photographed, maintenance team notified for cleanup. Police report filed.",
  },
];

const dummyDocuments = [
  {
    id: 1,
    name: "Service Agreement 2025",
    type: "agreement",
    uploaded: "2025-01-01",
    size: "2.4 MB",
    category: "Contracts",
    access: "general",
    description: "Standard service agreement for 2025.",
  },
  {
    id: 2,
    name: "Monthly Security Report - December",
    type: "report",
    uploaded: "2024-12-31",
    size: "1.8 MB",
    category: "Reports",
    access: "specific",
    description: "Detailed monthly security report.",
  },
  {
    id: 3,
    name: "Insurance Certificate",
    type: "msme",
    uploaded: "2024-12-15",
    size: "85 KB",
    category: "Certificates",
    access: "general",
    description: "Current insurance coverage.",
  },
  {
    id: 4,
    name: "Invoice - January 2025",
    type: "bills",
    uploaded: "2025-01-01",
    size: "3.4 MB",
    category: "Invoices",
    access: "specific",
    description: "January services invoice.",
  },
];

const dummyGuards = [
  {
    id: 1,
    name: "Guard A",
    email: "guardA@example.com",
    phone: "(555) 111-2222",
    status: "Active",
    documents: ["Guard Cert"],
  },
  {
    id: 2,
    name: "Guard B",
    email: "guardB@example.com",
    phone: "(555) 333-4444",
    status: "Active",
    documents: ["Training Doc"],
  },
  {
    id: 3,
    name: "Guard C",
    email: "guardC@example.com",
    phone: "(555) 555-6666",
    status: "Inactive",
    documents: [],
  },
];

const dummyRequests = [
  {
    id: 1,
    type: "Invoice",
    status: "Pending",
    date: "2025-01-15",
  },
  {
    id: 2,
    type: "Report",
    status: "Fulfilled",
    date: "2025-01-14",
  },
];

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const { user, loading } = useAuth();

  // Client-side protection - STRICT VERSION
  useEffect(() => {
    if (loading) return; // Still loading, wait

    if (!user) {
      console.log("No user found, redirecting to login");
      router.push("/login");
      return;
    }

    // STRICT: Only Client can access client dashboard
    if (user.role !== "Client") {
      console.log("Non-client user, redirecting to login");
      // Clear invalid token and redirect to login
      localStorage.removeItem("authToken");
      router.push("/login");
      return;
    }
  }, [user, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user or wrong role, show redirecting (redirect will happen in useEffect)
  if (!user || user.role !== "Client") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleGuardClick = (guardId) => {
    router.push(`/client-dashboard/guard-details/${guardId}`);
  };

  const renderTabContent = () => {
    if (activeTab === "overview") {
      return (
        <ClientOverview
          dummyServiceReports={dummyServiceReports}
          dummyIncidentReports={dummyIncidentReports}
          dummyDocuments={dummyDocuments}
        />
      );
    } else if (activeTab === "service-reports") {
      return <ServiceReports dummyServiceReports={dummyServiceReports} />;
    } else if (activeTab.startsWith("documents")) {
      const sub =
        activeTab === "documents"
          ? "documents"
          : activeTab.substring("documents-".length);
      let currentCategory = null;
      if (sub !== "documents") {
        const companyCat = documentCategories.find(
          (c) => c.id === "company-documents"
        );
        const child = companyCat?.children.find(
          (ch) => ch.replace(/\s+/g, "-").toLowerCase() === sub
        );
        if (child) {
          currentCategory = { name: "Company Documents", child };
        } else {
          currentCategory = documentCategories.find(
            (c) => c.name.replace(/\s+/g, "-").toLowerCase() === sub
          );
        }
      }
      return (
        <ClientDocuments
          dummyDocuments={dummyDocuments}
          currentCategory={currentCategory || "documents"}
        />
      );
    } else if (activeTab === "management") {
      return (
        <ClientManagement
          dummyGuards={dummyGuards}
          dummyRequests={dummyRequests}
          dummyDocuments={dummyDocuments}
          handleGuardClick={handleGuardClick}
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        documentCategories={documentCategories}
      />
      <div className="flex flex-1">
        <DesktopSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documentCategories={documentCategories}
        />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {renderTabContent()}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
