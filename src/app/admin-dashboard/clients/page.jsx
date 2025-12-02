// File: src/app/admin-dashboard/clients/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClientManagement from "@/components/admin/ClientManagement";

export default function ClientsPage() {
  const [guardSearch, setGuardSearch] = useState("");
  const [selectedGuards, setSelectedGuards] = useState([]);
  const router = useRouter();

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
      guardSearch={guardSearch}
      handleGuardSearch={handleGuardSearch}
      selectedGuards={selectedGuards}
      toggleGuardSelection={toggleGuardSelection}
      handleClientRowClick={handleClientRowClick}
    />
  );
}