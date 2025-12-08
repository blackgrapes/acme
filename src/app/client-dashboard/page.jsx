// File: src/app/client-dashboard/page.jsx - UPDATED
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientOverview from "@/components/client/ClientOverview";
import { useAuth } from "@/hooks/useAuth";

export default function ClientPortal() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <ClientOverview />;
}