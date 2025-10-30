// File: src/app/admin-dashboard/requests/page.jsx
"use client";

import RequestReports from "@/components/admin/RequestReports";

export default function RequestsPage() {
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

  return <RequestReports dummyRequests={dummyRequests} />;
}
