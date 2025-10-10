"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Shield, User, LogOut, Plus, Eye } from "lucide-react";
import Header from "@/components/admin/Header";
import MobileMenu from "@/components/admin/MobileMenu";
import DesktopSidebar from "@/components/admin/DesktopSidebar";
import DashboardContent from "@/components/admin/DashboardContent";
import ClientManagement from "@/components/admin/ClientManagement";
import DocumentManagement from "@/components/admin/DocumentManagement";
import RequestReports from "@/components/admin/RequestReports";
import GuardManagement from "@/components/admin/GuardManagement";
import FrontendManagement from "@/components/admin/FrontendManagement";
import ContactManagement from "@/components/admin/ContactManagement";
import SettingsManagement from "@/components/admin/SettingsManagement";
import AdminProfileDialog from "@/components/admin/AdminProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";

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
    type: "template",
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
    type: "policy",
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
    type: "certificate",
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
    type: "report",
    uploaded: "2025-01-01",
    size: "3.2 MB",
    uploader: "Operations Manager",
    access: "Specific",
    description: "Q4 2024 operations summary.",
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
    summary:
      "24x7 personal protection — escorting clients like a shadow while respecting personal & professional space.",
    benefits: [
      "Crowd control & family protection",
      "Extreme security coverage",
      "Discreet presence",
    ],
    img: "/Personal.jpg",
    slug: "pso",
    showOnHome: true,
  },
  {
    id: 2,
    title: "Security Guard",
    summary:
      "On-site guards ensuring rules, laws, and company policies are enforced with quick response.",
    benefits: ["Protect property", "Emergency handling", "Access control"],
    img: "/SecurityGuard.jpg",
    slug: "guard",
    showOnHome: true,
  },
  // Add more as per WeProvide
];

const dummyGalleryItems = [
  {
    id: 1,
    tag: "Events",
    caption: "Corporate event security",
    src: "url1",
    type: "image",
    showOnHome: true,
  },
];

const dummyFrontendClients = [
  {
    id: 1,
    name: "Client 1",
    logo: "url1",
    quote: "ACME elevated...",
    showOnHome: true,
  },
];

const dummyTestimonials = [
  {
    id: 1,
    quote: "Reliable team...",
    author: "Operations Head",
    showOnHome: true,
  },
];

const dummyContactSubmissions = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 1234567890",
    message: "Inquiry about security services...",
    date: "2025-01-15",
  },
];

const companyInfo = {
  name: "Elite Security",
  email: "info@elitesecurity.com",
  phone: "(555) 123-4567",
  address: "123 Security Blvd, City, ST 2345",
};

const securitySettings = {
  twoFactor: true,
  sessionTimeout: 60,
  loginAlerts: true,
};

const notificationSettings = {
  newClient: true,
  incidentReports: true,
  maintenance: true,
  adminEmail: "admin@elitesecurity.com",
};

const emailSettings = {
  smtpHost: "smtp.gmail.com",
  smtpPort: 587,
  username: "noreply@elitesecurity.com",
  useSSL: true,
};

const systemMaintenance = {
  lastBackup: "January 15, 2025 at 3:00 AM",
  nextBackup: "January 16, 2025 at 3:00 AM",
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [frontendTab, setFrontendTab] = useState("weprovide");
  const [contactTab, setContactTab] = useState("submissions");
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();

  const [selectedGuards, setSelectedGuards] = useState([]);
  const [showSpecificClients, setShowSpecificClients] = useState(false);
  const [guardDocuments, setGuardDocuments] = useState([]);
  const [guardSearch, setGuardSearch] = useState("");
  const [docGuardSearch, setDocGuardSearch] = useState("");
  const [selectedDocGuards, setSelectedDocGuards] = useState([]);
  const [filteredGuards, setFilteredGuards] = useState(dummyGuards);

  const handleClientRowClick = (clientId) => {
    router.push(`/admin-dashboard/client-details/${clientId}`);
  };

  const handleGuardRowClick = (guardId) => {
    // Optional
  };

  const handleAddGuardDocuments = (e) => {
    const files = Array.from(e.target.files);
    setGuardDocuments(
      files.map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + "KB",
        file,
      }))
    );
  };

  const handleGuardSearch = (e, searchType = "client") => {
    const value = e.target.value.toLowerCase();
    if (searchType === "client") {
      setGuardSearch(value);
    } else {
      setDocGuardSearch(value);
    }
    const filtered = dummyGuards.filter(
      (guard) =>
        guard.name.toLowerCase().includes(value) ||
        guard.email.toLowerCase().includes(value)
    );
    if (searchType === "client") {
      setFilteredGuards(filtered);
    } else {
      setFilteredGuards(filtered); // Reuse for doc as well
    }
  };

  const toggleGuardSelection = (guardId, searchType = "client") => {
    setSelectedGuards((prev) =>
      prev.includes(guardId)
        ? prev.filter((id) => id !== guardId)
        : [...prev, guardId]
    );
    if (searchType === "doc") {
      setSelectedDocGuards((prev) =>
        prev.includes(guardId)
          ? prev.filter((id) => id !== guardId)
          : [...prev, guardId]
      );
    }
  };

  const filteredClientGuards = guardSearch
    ? dummyGuards.filter(
        (guard) =>
          guard.name.toLowerCase().includes(guardSearch.toLowerCase()) ||
          guard.email.toLowerCase().includes(guardSearch.toLowerCase())
      )
    : dummyGuards;

  const filteredDocGuards = docGuardSearch
    ? dummyGuards.filter(
        (guard) =>
          guard.name.toLowerCase().includes(docGuardSearch.toLowerCase()) ||
          guard.email.toLowerCase().includes(docGuardSearch.toLowerCase())
      )
    : dummyGuards;

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent dummyClients={dummyClients} dummyDocuments={dummyDocuments} />;
      case "clients":
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
      case "documents":
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
          />
        );
      case "requests":
        return <RequestReports dummyRequests={dummyRequests} />;
      case "guards":
        return (
          <GuardManagement
            dummyGuards={dummyGuards}
            guardDocuments={guardDocuments}
            handleAddGuardDocuments={handleAddGuardDocuments}
            handleGuardRowClick={handleGuardRowClick}
          />
        );
      case "frontend":
        return <FrontendManagement frontendTab={frontendTab} setFrontendTab={setFrontendTab} dummyWeProvideServices={dummyWeProvideServices} dummyGalleryItems={dummyGalleryItems} dummyFrontendClients={dummyFrontendClients} dummyTestimonials={dummyTestimonials} />;
      case "contact":
        return <ContactManagement contactTab={contactTab} setContactTab={setContactTab} dummyContactSubmissions={dummyContactSubmissions} />;
      case "settings":
        return <SettingsManagement companyInfo={companyInfo} securitySettings={securitySettings} notificationSettings={notificationSettings} emailSettings={emailSettings} systemMaintenance={systemMaintenance} />;
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
      />
      <div className="flex flex-1">
        <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {renderTabContent()}
            </Tabs>
          </div>
        </main>
      </div>
      <AdminProfileDialog open={openAdminDialog} onOpenChange={setOpenAdminDialog} />
    </div>
  );
}