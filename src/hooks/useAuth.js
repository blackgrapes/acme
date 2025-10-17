// hooks/useAuth.js - ENHANCED DEBUG VERSION
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

        // Check localStorage first for quick fallback
        const localToken = localStorage.getItem("authToken");
        console.log("📦 LocalStorage token exists:", !!localToken);

        // Try API verification (uses httpOnly cookie)
        console.log("🌐 useAuth: Calling verify API...");
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        console.log("📨 Verify API response status:", response.status);

        if (response.ok) {
          const userData = await response.json();
          console.log("✅ useAuth: API verified user:", userData);
          setUser(userData);
        } else {
          console.log("❌ useAuth: API verification failed");

          // Fallback to localStorage token
          if (localToken) {
            console.log("🔄 useAuth: Trying localStorage fallback...");
            try {
              const payload = JSON.parse(atob(localToken.split(".")[1]));
              console.log("📋 useAuth: Fallback user data:", payload);
              setUser(payload);
            } catch (e) {
              console.error("💥 useAuth: Token decode error:", e);
              localStorage.removeItem("authToken");
              setUser(null);
            }
          } else {
            console.log("🚫 useAuth: No authentication found");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("💥 useAuth: Verification error:", error);
        setUser(null);
      } finally {
        console.log("🏁 useAuth: Verification complete, loading:", false);
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const hasPermission = (permission) => {
    if (loading) {
      console.log("⏳ useAuth: Still loading, permission denied");
      return false;
    }
    if (!user) {
      console.log("🚫 useAuth: No user, permission denied");
      return false;
    }
    const allowed = user?.permissions?.includes(permission) || false;
    console.log(`🔐 useAuth: Permission '${permission}':`, allowed);
    return allowed;
  };

  console.log("📊 useAuth: Current state - user:", user, "loading:", loading);
  return { user, loading, hasPermission };
}
