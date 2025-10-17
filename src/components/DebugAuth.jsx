// Create this file: src/components/DebugAuth.jsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function DebugAuth() {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("🔍 DEBUG AUTH COMPONENT:");
    console.log("   - Loading:", loading);
    console.log("   - User:", user);
    console.log("   - localStorage token:", localStorage.getItem("authToken"));
    console.log("   - Role:", user?.role);
  }, [user, loading]);

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-2 text-xs z-50">
      Auth Debug:{" "}
      {loading
        ? "Loading..."
        : user
        ? `Logged in as ${user.role}`
        : "Not logged in"}
    </div>
  );
}
