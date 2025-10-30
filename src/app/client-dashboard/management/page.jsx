// File: src/app/client-dashboard/management/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientManagement from "@/components/client/ClientManagement";
import { useAuth } from "@/hooks/useAuth";

export default function ManagementPage() {
  const [assignedGuards, setAssignedGuards] = useState([]);
  const [clientDocuments, setClientDocuments] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  const handleGuardClick = (guardId) => {
    router.push(`/client-dashboard/guard-details/${guardId}`);
  };

  const fetchClientData = async () => {
    if (!user?._id) return;
    try {
      const [clientResponse, docsResponse] = await Promise.all([
        fetch(`/api/auth/client/${user._id}`),
        fetch(`/api/auth/client/${user._id}/documents`),
      ]);

      if (clientResponse.ok) {
        const clientData = await clientResponse.json();

        // Fetch assigned guards
        if (clientData.client.assignedGuards?.length > 0) {
          const guardsPromises = clientData.client.assignedGuards.map(
            (guardId) =>
              fetch(`/api/auth/guard/${guardId}`).then((res) => res.json())
          );
          const guardsResults = await Promise.all(guardsPromises);
          const validGuards = guardsResults
            .filter((result) => result.guard)
            .map((result) => result.guard);
          setAssignedGuards(validGuards);
        }
      }

      if (docsResponse.ok) {
        const docsData = await docsResponse.json();
        setClientDocuments(docsData.documents || []);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [user?._id]);

  return (
    <ClientManagement
      dummyGuards={assignedGuards}
      dummyRequests={[]}
      dummyDocuments={clientDocuments}
      handleGuardClick={handleGuardClick}
    />
  );
}
