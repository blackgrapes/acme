// File: src/app/admin-dashboard/guards/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GuardManagement from "@/components/admin/GuardManagement";

export default function GuardsPage() {
  const [guardDocuments, setGuardDocuments] = useState([]);
  const router = useRouter();

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

  const handleGuardRowClick = (guardId) => {
    router.push(`/admin-dashboard/guard-details/${guardId}`);
  };

  return (
    <GuardManagement
      guardDocuments={guardDocuments}
      handleAddGuardDocuments={handleAddGuardDocuments}
      handleGuardRowClick={handleGuardRowClick}
    />
  );
}
