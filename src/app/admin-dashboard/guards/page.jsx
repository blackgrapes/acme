// File: src/app/admin-dashboard/guards/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GuardManagement from "@/components/admin/GuardManagement";

export default function GuardsPage() {
  const [guardDocuments, setGuardDocuments] = useState([]);
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
      dummyGuards={dummyGuards}
      guardDocuments={guardDocuments}
      handleAddGuardDocuments={handleAddGuardDocuments}
      handleGuardRowClick={handleGuardRowClick}
    />
  );
}
