// Updated File: app/client-dashboard/page.jsx (Updated main Client Panel file)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/client/Header";
import DesktopSidebar from "@/components/client/DesktopSidebar";
import ClientOverview from "@/components/client/ClientOverview";
import ServiceReports from "@/components/client/ServiceReports";
import ClientDocuments from "@/components/client/ClientDocuments";
import ClientManagement from "@/components/client/ClientManagement";

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
    type: "Contract",
    uploaded: "2025-01-01",
    size: "2.4 MB",
    category: "Contracts",
    access: "general",
    description: "Standard service agreement for 2025.",
  },
  {
    id: 2,
    name: "Monthly Security Report - December",
    type: "Report",
    uploaded: "2024-12-31",
    size: "1.8 MB",
    category: "Reports",
    access: "specific",
    description: "Detailed monthly security report.",
  },
  {
    id: 3,
    name: "Insurance Certificate",
    type: "Certificate",
    uploaded: "2024-12-15",
    size: "85 KB",
    category: "Certificates",
    access: "general",
    description: "Current insurance coverage.",
  },
  {
    id: 4,
    name: "Invoice - January 2025",
    type: "Invoice",
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

  const handleGuardClick = (guardId) => {
    router.push(`/client-dashboard/guard-details/${guardId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <ClientOverview
            dummyServiceReports={dummyServiceReports}
            dummyIncidentReports={dummyIncidentReports}
            dummyDocuments={dummyDocuments}
          />
        );
      case "service-reports":
        return <ServiceReports dummyServiceReports={dummyServiceReports} />;
      case "documents":
        return <ClientDocuments dummyDocuments={dummyDocuments} />;
      case "management":
        return (
          <ClientManagement
            dummyGuards={dummyGuards}
            dummyRequests={dummyRequests}
            handleGuardClick={handleGuardClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-1">
        <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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
