// File: src/app/admin-dashboard/page.jsx - FIXED frontendCategories TO ARRAY
"use client";

import { useState, useMemo, useEffect } from "react";
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
    access: "All",
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
    access: "All",
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
    access: "Specific",
    description: "Annual insurance coverage details.",
    actions: true,
  },
  {
    id: 4,
    name: "Monthly Operations Report",
    type: "salary slips",
    uploaded: "2025-01-01",
    size: "3.2 MB",
    uploader: "Operations Manager",
    access: "Specific",
    description: "Q4 2024 operations summary.",
    actions: true,
  },
  // Added one for child category
  {
    id: 5,
    name: "MSME Certificate",
    type: "msme",
    uploaded: "2025-01-05",
    size: "500 KB",
    uploader: "Admin",
    access: "Admin",
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

// Frontend Management Data
const dummyWeProvideServices = [
  {
    id: 1,
    title: "Personal Security Officer",
    summary: "Professional personal security for high-profile individuals.",
    benefits: ["24/7 Protection", "Trained Personnel", "Discreet Service"],
    img: true,
    slug: "pso",
    showOnHome: true,
  },
  {
    id: 2,
    title: "Security Guard",
    summary: "Reliable on-site security for businesses and events.",
    benefits: ["Uniformed Guards", "Patrol Services", "Access Control"],
    img: true,
    slug: "guard",
    showOnHome: true,
  },
  // Add more as needed
];

const dummyGalleryItems = [
  {
    id: 1,
    caption: "Security Training Session",
    tag: "training",
    type: "image",
    showOnHome: true,
  },
  // Add more as needed
];

const dummyFrontendClients = [
  // Placeholder - add as needed
];

const dummyTestimonials = [
  // Placeholder - add as needed
];

const dummyContactSubmissions = [
  // Placeholder - add as needed
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
  const [currentCategory, setCurrentCategory] = useState("documents");
  const [documentCategoriesState, setDocumentCategoriesState] = useState([
    { id: 1, name: "Documents" },
    { id: 2, name: "Attendance" },
    // Add more default categories as needed
  ]);
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
  // FIXED: frontendCategories is now an array to match .map() expectation
  const [frontendCategories, setFrontendCategories] = useState([
    { id: "services", name: "Services" },
    { id: "gallery", name: "Gallery" },
    { id: "clients", name: "Clients" },
    { id: "testimonials", name: "Testimonials" },
  ]);
  const router = useRouter();
  const { user, loading, hasPermission } = useAuth();

  // Move useMemos after states, before useEffect
  const filteredClientGuards = useMemo(() => {
    return dummyGuards.filter((guard) =>
      guard.name.toLowerCase().includes(guardSearch.toLowerCase())
    );
  }, [guardSearch]);

  const filteredDocGuards = useMemo(() => {
    return dummyGuards.filter((guard) =>
      guard.name.toLowerCase().includes(docGuardSearch.toLowerCase())
    );
  }, [docGuardSearch]);

  // Admin-side protection
  useEffect(() => {
    if (loading) return; // Still loading, wait

    if (!user) {
      console.log("No user found, redirecting to login");
      router.push("/login");
      return;
    }

    // STRICT: Only users with admin permission can access admin dashboard
    if (!hasPermission("dashboard-read")) {
      console.log("No admin permission, redirecting to login");
      // Clear invalid token and redirect to login
      localStorage.removeItem("authToken");
      router.push("/login");
      return;
    }
  }, [user, loading, router, hasPermission]);

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
    setSelectedGuards((prev) =>
      type === "client"
        ? prev.includes(guardId)
          ? prev.filter((id) => id !== guardId)
          : [...prev, guardId]
        : prev
    );
    setSelectedDocGuards((prev) =>
      type === "doc"
        ? prev.includes(guardId)
          ? prev.filter((id) => id !== guardId)
          : [...prev, guardId]
        : prev
    );
  };

  const handleClientRowClick = (clientId) => {
    router.push(`/admin-dashboard/client-details/${clientId}`);
  };

  const handleGuardRowClick = (guardId) => {
    router.push(`/admin-dashboard/guard/${guardId}`);
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

  const addNewCategory = (newCategoryName) => {
    setDocumentCategoriesState((prev) => [
      ...prev,
      { id: prev.length + 1, name: newCategoryName },
    ]);
  };

  const renderTabContent = () => {
    switch (true) {
      case activeTab.startsWith("documents"):
        return (
          <DocumentManagement
            dummyDocuments={dummyDocuments}
            showSpecificClients={showSpecificClients}
            setShowSpecificClients={setShowSpecificClients}
            docGuardSearch={docGuardSearch}
            handleGuardSearch={handleGuardSearch}
            selectedDocGuards={selectedDocGuards}
            toggleGuardSelection={toggleGuardSelection}
            filteredDocGuards={filteredDocGuards}
            currentCategory={currentCategory}
            addNewCategory={addNewCategory}
            documentCategories={documentCategoriesState}
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
            dummyContactSubmissions={dummyContactSubmissions}
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
            dummyWeProvideServices={dummyWeProvideServices}
            dummyGalleryItems={dummyGalleryItems}
            dummyFrontendClients={dummyFrontendClients}
            dummyTestimonials={dummyTestimonials}
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
        documentCategories={documentCategoriesState}
      />

      <div className="flex flex-1">
        <DesktopSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documentCategories={documentCategoriesState}
          setDocumentCategories={setDocumentCategoriesState}
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
