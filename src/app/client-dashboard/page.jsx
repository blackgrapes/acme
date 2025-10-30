// File: src/app/client-dashboard/page.jsx
"use client";

import ClientOverview from "@/components/client/ClientOverview";

export default function ClientPortal() {
  return (
    <ClientOverview
      dummyServiceReports={[]}
      dummyIncidentReports={[]}
      dummyDocuments={[]}
      clientData={null}
      assignedGuards={[]}
      onGuardClick={() => {}}
    />
  );
}
