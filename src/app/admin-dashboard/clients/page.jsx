// File: src/app/admin-dashboard/clients/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClientManagement from "@/components/admin/ClientManagement";

export default function ClientsPage() {
  const [guardSearch, setGuardSearch] = useState("");
  const [selectedGuards, setSelectedGuards] = useState([]);
  const router = useRouter();

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
  ];

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
  ];

  const filteredClientGuards = dummyGuards.filter((guard) =>
    guard.name.toLowerCase().includes(guardSearch.toLowerCase())
  );

  const handleGuardSearch = (e) => {
    setGuardSearch(e.target.value);
  };

  const toggleGuardSelection = (guardId) => {
    setSelectedGuards((prev) =>
      prev.includes(guardId)
        ? prev.filter((id) => id !== guardId)
        : [...prev, guardId]
    );
  };

  const handleClientRowClick = (clientId) => {
    router.push(`/admin-dashboard/client-details/${clientId}`);
  };

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
}
