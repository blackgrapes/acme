// File: src/app/client-dashboard/page.jsx - FIXED HOOK ORDER
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
import CompanyDocuments from "@/components/client/CompanyDocuments";
import ClientManagement from "@/components/client/ClientManagement";

// Dummy data for maintaining same UI structure
const dummyServiceReports = [
  {
    id: 1,
    code: "SR-001",
    date: "2025-01-15",
    hours: "8 hours",
    location: "ABC Corporation - Main Building",
    officer: "Officer Johnson",
    status: "completed",
    details: "Regular security patrol and building monitoring.",
  },
  {
    id: 2,
    code: "SR-002",
    date: "2025-01-14",
    hours: "12 hours",
    location: "ABC Corporation - Parking Garage",
    officer: "Officer Smith",
    status: "completed",
    details: "Overnight security coverage for parking facility.",
  },
];

const dummyIncidentReports = [];

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
  const [clientData, setClientData] = useState(null);
  const [assignedGuards, setAssignedGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientDocuments, setClientDocuments] = useState([]);
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [mounted, setMounted] = useState(false); // ✅ ADD: Mounted flag for client fetches

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // ✅ FIXED: All useEffect hooks at the top level, no conditional rendering
  // Client-side protection
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      console.log("No user found, redirecting to login");
      router.push("/login");
      return;
    }

    if (user.role !== "Client") {
      console.log("Non-client user, redirecting to login");
      localStorage.removeItem("authToken");
      router.push("/login");
      return;
    }
  }, [user, authLoading, router]);

  // Fetch client data
  useEffect(() => {
    if (user && user._id && mounted) {
      fetchClientData();
    }
  }, [user, mounted]); // ✅ FIXED: Added mounted

  // ✅ FIXED: Moved this useEffect to proper position with mounted
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    if (user?.id && isValidObjectId(user.id)) {
      // ✅ FIXED: Validate ID before fetch
      fetchClientDocuments();
      fetchCompanyDocuments();
    }
  }, [user?.id, mounted]); // ✅ FIXED: Depend on user.id and mounted

  const fetchClientData = async () => {
    try {
      setLoading(true);

      // Fetch client details
      const clientResponse = await fetch(`/api/auth/client/${user._id}`);
      if (clientResponse.ok) {
        const clientData = await clientResponse.json();
        setClientData(clientData.client);

        // Fetch client documents
        const docsResponse = await fetch(
          `/api/auth/client/${user._id}/documents`
        );
        if (docsResponse.ok) {
          const docsData = await docsResponse.json();
          setClientDocuments(docsData.documents || []);
        }

        // Fetch assigned guards
        if (
          clientData.client.assignedGuards &&
          clientData.client.assignedGuards.length > 0
        ) {
          const guardsPromises = clientData.client.assignedGuards.map(
            (guardId) =>
              fetch(`/api/auth/guard/${guardId}`).then((res) => res.json())
          );
          const guardsResults = await Promise.all(guardsPromises);
          const validGuards = guardsResults
            .filter((result) => result.guard)
            .map((result) => result.guard);
          setAssignedGuards(validGuards);
        }
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientDocuments = async () => {
    if (!user?.id || !isValidObjectId(user.id)) {
      console.warn("⏳ Waiting for valid clientId:", user?.id);
      return;
    }

    try {
      const response = await fetch(`/api/documents?clientId=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setClientDocuments(data.documents || []);
        console.log(
          `✅ Fetched ${data.documents?.length || 0} client documents`
        );
      } else {
        console.error(
          "❌ Client docs fetch failed:",
          response.status,
          data.error
        );
        setClientDocuments([]);
      }
    } catch (error) {
      console.error("❌ Error fetching client documents:", error);
      setClientDocuments([]);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const handleAdminUploadRefresh = () => {
      // Listen for potential admin broadcasts (or manual trigger)
      if (
        activeTab.startsWith("documents") ||
        activeTab.startsWith("company-documents")
      ) {
        fetchClientDocuments();
        fetchCompanyDocuments();
      }
    };

    window.addEventListener("adminDocumentsUpdated", handleAdminUploadRefresh); // Optional: dispatch from admin if needed

    return () =>
      window.removeEventListener(
        "adminDocumentsUpdated",
        handleAdminUploadRefresh
      );
  }, [activeTab, mounted]); // ✅ FIXED: Added mounted

  const fetchCompanyDocuments = async () => {
    if (!user?.id || !isValidObjectId(user.id)) return; // ✅ FIXED: Validate before fetch

    try {
      // Fetch ALL company docs with general access (shared across clients)
      // Remove clientId - company docs are typically general
      const response = await fetch(
        "/api/documents?isCompanyDocument=true&accessLevel=general"
      );
      const data = await response.json();

      if (response.ok) {
        setCompanyDocuments(data.documents || []);
        console.log(
          `✅ Fetched ${
            data.documents?.length || 0
          } company documents for client`
        );
      } else {
        console.error("❌ Company docs fetch failed:", response.status);
        setCompanyDocuments([]);
      }
    } catch (error) {
      console.error("❌ Error fetching company documents:", error);
      setCompanyDocuments([]);
    }
  };

  // ✅ Helper
  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));

  // Loading state - ✅ FIXED: Moved after all hooks
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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

  // Document Categories - SAME AS BEFORE
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

  // Company Document Categories - SAME AS BEFORE
  const companyDocumentCategories = [
    { id: "msme", name: "MSME" },
    { id: "gst", name: "GST" },
    { id: "pasara", name: "Pasara" },
    { id: "pan", name: "PAN" },
    { id: "profile", name: "Profile" },
    { id: "bank-details", name: "Bank Details" },
  ];

  const handleGuardClick = (guardId) => {
    router.push(`/client-dashboard/guard-details/${guardId}`);
  };

  const renderTabContent = () => {
    if (activeTab === "overview") {
      return (
        <ClientOverview
          dummyServiceReports={dummyServiceReports}
          dummyIncidentReports={dummyIncidentReports}
          dummyDocuments={
            clientDocuments.length > 0 ? clientDocuments : dummyServiceReports
          }
          clientData={clientData}
          assignedGuards={assignedGuards}
          onGuardClick={handleGuardClick}
        />
      );
    } else if (activeTab === "service-reports") {
      return <ServiceReports dummyServiceReports={dummyServiceReports} />;
    } else if (activeTab.startsWith("documents")) {
      const categoryId = activeTab.replace("documents-", "");
      const currentCategory = documentCategories.find(
        (cat) => cat.id === categoryId
      ) || { id: "documents", name: "All Documents" };
      return (
        <ClientDocuments
          clientDocuments={clientDocuments} // ✅ Real data
          currentCategory={currentCategory}
          clientId={user?.id}
          onDocumentsUpdate={fetchClientDocuments}
        />
      );
    } else if (activeTab.startsWith("company-documents")) {
      const categoryId = activeTab.replace("company-documents-", "");
      const currentCategory = companyDocumentCategories.find(
        (cat) => cat.id === categoryId
      ) || { id: "company-documents", name: "All Company Documents" };
      return (
        <CompanyDocuments
          dummyDocuments={companyDocuments} // ✅ Real data
          currentCategory={currentCategory}
          clientId={user?.id} // ✅ Pass clientId
        />
      );
    } else if (activeTab === "management") {
      return (
        <ClientManagement
          dummyGuards={assignedGuards.length > 0 ? assignedGuards : dummyGuards}
          dummyRequests={dummyRequests}
          dummyDocuments={
            clientDocuments.length > 0 ? clientDocuments : dummyServiceReports
          }
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
        companyDocumentCategories={companyDocumentCategories}
      />
      <div className="flex flex-1">
        <DesktopSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documentCategories={documentCategories}
          companyDocumentCategories={companyDocumentCategories}
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
