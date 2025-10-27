// File: src/hooks/useAuth.js - FIXED & SIMPLIFIED
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const verifyAuth = async () => {
      try {
        console.log("🔄 useAuth: Starting authentication verification...");

        // Check localStorage first
        const localToken = localStorage.getItem("authToken");
        console.log("📦 LocalStorage token exists:", !!localToken);

        if (!localToken) {
          console.log("🚫 No token found, user is not authenticated");
          setUser(null);
          setLoading(false);
          return;
        }

        // Try to decode the token for basic user info
        try {
          const payload = JSON.parse(atob(localToken.split(".")[1]));
          console.log("📋 Token payload:", payload);

          // Set basic user info from token immediately
          setUser({
            _id: payload.userId,
            name: payload.name,
            email: payload.email,
            role: payload.role,
            permissions: payload.permissions || [],
          });
        } catch (e) {
          console.error("💥 Token decode error:", e);
          localStorage.removeItem("authToken");
          setUser(null);
          setLoading(false);
          return;
        }

        // Try API verification for complete user data
        try {
          console.log("🌐 useAuth: Calling verify API...");
          const response = await fetch("/api/auth/verify", {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localToken}`,
            },
          });

          console.log("📨 Verify API response status:", response.status);

          if (response.ok) {
            const userData = await response.json();
            console.log("✅ useAuth: API verified user:", userData);
            setUser(userData);
          } else {
            console.log(
              "❌ useAuth: API verification failed, using token data"
            );
            // Continue with token data
          }
        } catch (error) {
          console.error("🌐 useAuth: API call failed:", error);
          // Continue with token data
        }
      } catch (error) {
        console.error("💥 useAuth: Verification error:", error);
        setUser(null);
      } finally {
        console.log("🏁 useAuth: Verification complete");
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const hasPermission = (permission) => {
    if (loading) return false;
    if (!user) return false;
    return user?.permissions?.includes(permission) || false;
  };

  return { user, loading, hasPermission };
}
