// File: src/app/admin-dashboard/page.jsx
"use client";

import DashboardContent from "@/components/admin/DashboardContent";

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
];

export default function AdminDashboard() {
  return (
    <DashboardContent
      // dummyClients={dummyClients}
      dummyDocuments={dummyDocuments}
    />
  );
}
