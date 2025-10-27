// File: src/app/admin-dashboard/page.jsx - CORRECTED
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/admin/Header";
import DesktopSidebar from "@/components/admin/DesktopSidebar";
import DashboardContent from "@/components/admin/DashboardContent";
import ClientManagement from "@/components/admin/ClientManagement";
import DocumentManagement from "@/components/admin/DocumentManagement";
import RequestReports from "@/components/admin/RequestReports";
import GuardManagement from "@/components/admin/GuardManagement";
import ContactManagement from "@/components/admin/ContactManagement";
import SettingsManagement from "@/components/admin/SettingsManagement";
import AdminProfileDialog from "@/components/admin/AdminProfileDialog";
import RoleManagement from "@/components/admin/RoleManagement";
import { useAuth } from "@/hooks/useAuth";

const dummyClients = [
  {
    id: 1,
    name: "John Smith",
    org: "ABC Corporation",
    email: "john@abc.com",
    phone: "(555) 123-4567",
    joined: "2024-01-15",
    lastLogin: "2025-01-15",
    status: "Active",
    services: ["Corporate Security", "Mobile Patrols"],
    plan: "Security Officer",
    duration: { from: "2025-01-01", to: "2025-12-31" },
    assignedGuards: [1, 2],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    org: "TechCorp Industries",
    email: "sarah@techcorp.com",
    phone: "(555) 987-6543",
    joined: "2024-03-22",
    lastLogin: "2025-01-14",
    status: "Active",
    services: ["Event Security", "CCTV Monitoring"],
    plan: "Security Supervisor",
    duration: { from: "2025-02-01", to: "2025-11-30" },
    assignedGuards: [2, 3],
  },
  {
    id: 3,
    name: "Mike Davis",
    org: "RetailPlus Stores",
    email: "mike@retailplus.com",
    phone: "(555) 456-7890",
    joined: "2025-01-10",
    lastLogin: "Never",
    status: "Pending",
    services: ["Residential Security"],
    plan: "Security Guard",
    duration: { from: "2025-01-10", to: "2025-06-10" },
    assignedGuards: [1],
  },
];

const dummyGuards = [
  {
    id: 1,
    name: "Guard A",
    email: "guardA@example.com",
    phone: "(555) 111-2222",
    status: "Assigned",
    documents: [{ name: "Cert1.pdf", size: "1MB" }],
    type: "Security Guard",
    gender: "Male",
  },
  {
    id: 2,
    name: "Guard B",
    email: "guardB@example.com",
    phone: "(555) 333-4444",
    status: "Not Assigned",
    documents: [
      { name: "Cert2.pdf", size: "2MB" },
      { name: "Doc2.pdf", size: "500KB" },
    ],
    type: "Personal Security Officer",
    gender: "Female",
  },
  {
    id: 3,
    name: "Guard C",
    email: "guardC@example.com",
    phone: "(555) 555-6666",
    status: "Not Active",
    documents: [],
    type: "Security Supervisor",
    gender: "Male",
  },
];

const dummyDocuments = [
  {
    id: 1,
    name: "Service Agreement Template",
    type: "agreement",
    uploaded: "2024-12-01",
    size: "2.1 MB",
    uploader: "Admin",
    access: "general",
    description: "Standard service agreement for new clients.",
    actions: true,
  },
  {
    id: 2,
    name: "Company Privacy Policy",
    type: "attendance",
    uploaded: "2024-11-15",
    size: "1.5 MB",
    uploader: "Legal Team",
    access: "general",
    description: "Updated privacy policy effective 2025.",
    actions: true,
  },
  {
    id: 3,
    name: "Insurance Certificate 2025",
    type: "bills",
    uploaded: "2024-12-20",
    size: "85 KB",
    uploader: "Admin",
    access: "specific",
    description: "Annual insurance coverage details.",
    actions: true,
  },
  {
    id: 4,
    name: "Monthly Operations Report",
    type: "salary-sheet",
    uploaded: "2025-01-01",
    size: "3.2 MB",
    uploader: "Operations Manager",
    access: "specific",
    description: "Q4 2024 operations summary.",
    actions: true,
  },
  {
    id: 5,
    name: "MSME Certificate",
    type: "msme",
    uploaded: "2025-01-05",
    size: "500 KB",
    uploader: "Admin",
    access: "general",
    description: "MSME registration document.",
    actions: true,
  },
];

const dummyRequests = [
  {
    id: 1,
    client: "John Smith",
    type: "Invoice",
    status: "Pending",
    date: "2025-01-15",
  },
  {
    id: 2,
    client: "Sarah Johnson",
    type: "Report",
    status: "Fulfilled",
    date: "2025-01-14",
  },
];

// Document Categories - Define once at top level
const initialDocumentCategories = [
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

// Company Document Categories - Define once at top level
const initialCompanyDocumentCategories = [
  { id: "msme", name: "MSME" },
  { id: "gst", name: "GST" },
  { id: "pasara", name: "Pasara" },
  { id: "pan", name: "PAN" },
  { id: "profile", name: "Profile" },
  { id: "bank-details", name: "Bank Details" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [guardSearch, setGuardSearch] = useState("");
  const [docGuardSearch, setDocGuardSearch] = useState("");
  const [selectedGuards, setSelectedGuards] = useState([]);
  const [selectedDocGuards, setSelectedDocGuards] = useState([]);
  const [showSpecificClients, setShowSpecificClients] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [documentCategories, setDocumentCategories] = useState(
    initialDocumentCategories
  );
  const [companyDocumentCategories, setCompanyDocumentCategories] = useState(
    initialCompanyDocumentCategories
  );
  const [guardDocuments, setGuardDocuments] = useState([]);
  const [contactTab, setContactTab] = useState("inquiries");
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: 30,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
  });
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: 587,
  });
  const [frontendCategories, setFrontendCategories] = useState([
    { id: "services", name: "Services" },
    { id: "gallery", name: "Gallery" },
    { id: "clients", name: "Clients" },
    { id: "testimonials", name: "Testimonials" },
  ]);
  const router = useRouter();
  const { user, loading, hasPermission } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const mountedRef = useRef(false); // ✅ ADD: Ref for mounted to prevent loops

  // ✅ FIXED: Fetch all clients for document access control - with mounted check
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const fetchClients = async () => {
      try {
        const response = await fetch("/api/auth/client");
        const data = await response.json();
        if (data.clients) {
          setAllClients(data.clients);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        // Fallback to dummy clients
        setAllClients(dummyClients);
      }
    };
    fetchClients();
  }, []);

  const filteredClientGuards = useMemo(() => {
    return dummyGuards.filter((guard) =>
      guard.name.toLowerCase().includes(guardSearch.toLowerCase())
    );
  }, [guardSearch]);

  const filteredDocGuards = useMemo(() => {
    return allClients.filter((client) =>
      client.name.toLowerCase().includes(docGuardSearch.toLowerCase())
    );
  }, [docGuardSearch, allClients]);

  // ✅ FIXED: Use effect to fetch documents - with mounted ref and better deps to prevent loops
  useEffect(() => {
    if (!mountedRef.current || !user || loading) return;

    const fetchDocuments = async () => {
      try {
        console.log(
          "📥 Fetching documents. Admin: true ClientId: null isCompany:",
          activeTab.startsWith("company-documents")
        );

        let url = "/api/documents?admin=true";
        if (activeTab.startsWith("company-documents")) {
          url += "&isCompanyDocument=true";
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (activeTab.startsWith("company-documents")) {
          setCompanyDocuments(data.documents || []);
          console.log(
            "✅ Admin fetched",
            data.documents?.length || 0,
            "company documents"
          );
        } else {
          setDocuments(data.documents || []);
          console.log(
            "✅ Admin fetched",
            data.documents?.length || 0,
            "documents"
          );
        }
      } catch (error) {
        console.error("❌ Failed to fetch documents:", error);
        if (activeTab.startsWith("company-documents")) {
          setCompanyDocuments([]);
        } else {
          setDocuments([]);
        }
      }
    };

    fetchDocuments();
  }, [activeTab, user, loading]); // ✅ FIXED: Deps include activeTab to fetch only on tab change

  // Auth protection useEffect
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!hasPermission("dashboard-read")) {
      console.log("No admin permission, redirecting to login");
      localStorage.removeItem("authToken");
      router.push("/login");
      return;
    }
  }, [user, loading, router, hasPermission]);

  // Helper functions for document categories
  const getCurrentCategory = () => {
    if (activeTab.startsWith("documents-")) {
      const categoryId = activeTab.replace("documents-", "");
      return documentCategories.find((cat) => cat.id === categoryId) || null;
    }
    return null;
  };

  const getCurrentCompanyCategory = () => {
    if (activeTab.startsWith("company-documents-")) {
      const categoryId = activeTab.replace("company-documents-", "");
      return (
        companyDocumentCategories.find((cat) => cat.id === categoryId) || null
      );
    }
    return null;
  };

  const addNewCompanyCategory = (name) => {
    addNewCategory(name, true);
  };

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

  if (!user || !hasPermission("dashboard-read")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleGuardSearch = (e, type) => {
    if (type === "client") {
      setGuardSearch(e.target.value);
    } else if (type === "doc") {
      setDocGuardSearch(e.target.value);
    }
  };

  const toggleGuardSelection = (guardId, type) => {
    if (type === "client") {
      setSelectedGuards((prev) =>
        prev.includes(guardId)
          ? prev.filter((id) => id !== guardId)
          : [...prev, guardId]
      );
    } else if (type === "doc") {
      setSelectedDocGuards((prev) =>
        prev.includes(guardId)
          ? prev.filter((id) => id !== guardId)
          : [...prev, guardId]
      );
    }
  };

  const handleClientRowClick = (clientId) => {
    router.push(`/admin-dashboard/client-details/${clientId}`);
  };

  const handleGuardRowClick = (guardId) => {
    router.push(`/admin-dashboard/guard-details/${guardId}`);
  };

  const handleAddGuardDocuments = (e) => {
    const files = Array.from(e.target.files);
    setGuardDocuments((prev) => [
      ...prev,
      ...files.map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(0) + "KB",
      })),
    ]);
  };

  const addNewCategory = (newCategoryName, isCompany = false) => {
    if (isCompany) {
      setCompanyDocumentCategories((prev) => [
        ...prev,
        { id: `company-${Date.now()}`, name: newCategoryName },
      ]);
    } else {
      setDocumentCategories((prev) => [
        ...prev,
        { id: `doc-${Date.now()}`, name: newCategoryName },
      ]);
    }
  };

  const renderTabContent = () => {
    switch (true) {
      case activeTab.startsWith("documents"):
        return (
          <DocumentManagement
            dummyDocuments={documents} // ✅ Real data pass karen
            showSpecificClients={showSpecificClients}
            setShowSpecificClients={setShowSpecificClients}
            docGuardSearch={docGuardSearch}
            handleGuardSearch={handleGuardSearch}
            selectedDocGuards={selectedDocGuards}
            toggleGuardSelection={toggleGuardSelection}
            filteredDocGuards={filteredDocGuards} // ✅ FIXED: filteredDocGuards use karen
            currentCategory={getCurrentCategory()}
            addNewCategory={addNewCategory}
            documentCategories={documentCategories}
            companyDocumentCategories={companyDocumentCategories}
            isCompanyDocuments={false}
          />
        );
      case activeTab.startsWith("company-documents"):
        return (
          <DocumentManagement
            dummyDocuments={companyDocuments} // ✅ Real company data pass karen
            showSpecificClients={showSpecificClients}
            setShowSpecificClients={setShowSpecificClients}
            docGuardSearch={docGuardSearch}
            handleGuardSearch={handleGuardSearch}
            selectedDocGuards={selectedDocGuards}
            toggleGuardSelection={toggleGuardSelection}
            filteredDocGuards={filteredDocGuards} // ✅ FIXED: filteredDocGuards use karen
            currentCategory={getCurrentCompanyCategory()}
            addNewCategory={addNewCompanyCategory}
            documentCategories={documentCategories}
            companyDocumentCategories={companyDocumentCategories}
            isCompanyDocuments={true}
          />
        );
      case activeTab === "roles":
        return <RoleManagement />;
      case activeTab === "dashboard":
        return (
          <DashboardContent
            dummyClients={dummyClients}
            dummyDocuments={dummyDocuments}
          />
        );
      case activeTab === "clients":
        return (
          <ClientManagement
            dummyClients={dummyClients}
            guardSearch={guardSearch}
            handleGuardSearch={handleGuardSearch}
            selectedGuards={selectedGuards}
            toggleGuardSelection={toggleGuardSelection}
            filteredClientGuards={filteredClientGuards}
            handleClientRowClick={handleClientRowClick}
          />
        );
      case activeTab === "requests":
        return <RequestReports dummyRequests={dummyRequests} />;
      case activeTab === "guards":
        return (
          <GuardManagement
            dummyGuards={dummyGuards}
            guardDocuments={guardDocuments}
            handleAddGuardDocuments={handleAddGuardDocuments}
            handleGuardRowClick={handleGuardRowClick}
          />
        );
      case activeTab === "contact":
        return (
          <ContactManagement
            contactTab={contactTab}
            setContactTab={setContactTab}
            // dummyContactSubmissions={dummyContactSubmissions}
          />
        );
      case activeTab === "settings":
        return (
          <SettingsManagement
            companyInfo={companyInfo}
            securitySettings={securitySettings}
            notificationSettings={notificationSettings}
            emailSettings={emailSettings}
            frontendCategories={frontendCategories}
          //   dummyWeProvideServices={dummyWeProvideServices}
          //   dummyGalleryItems={dummyGalleryItems}
          //   dummyFrontendClients={dummyFrontendClients}
          //   dummyTestimonials={dummyTestimonials}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        openAdminDialog={openAdminDialog}
        setOpenAdminDialog={setOpenAdminDialog}
        documentCategories={documentCategories}
        companyDocumentCategories={companyDocumentCategories}
      />

      <div className="flex flex-1">
        <DesktopSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documentCategories={documentCategories}
          companyDocumentCategories={companyDocumentCategories}
          setDocumentCategories={setDocumentCategories}
        />

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
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

      <AdminProfileDialog
        open={openAdminDialog}
        onOpenChange={setOpenAdminDialog}
      />
    </div>
  );
}
