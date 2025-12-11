// File: src/hooks/useAuth.js - OPTIMIZED
import { useEffect, useState, useRef } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (verifiedRef.current || typeof window === "undefined") {
      console.log("useAuth: already verified or server-side");
      setLoading(false);
      return;
    }
    console.log("useAuth: starting verification");

    const verifyAuth = async () => {
      try {
        const localToken = localStorage.getItem("authToken");

        if (!localToken) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Try to decode token first (fast)
        try {
          const payload = JSON.parse(atob(localToken.split(".")[1]));
          setUser({
            _id: payload.userId,
            name: payload.name,
            email: payload.email,
            role: payload.role,
            permissions: payload.permissions || [],
          });
        } catch (e) {
          localStorage.removeItem("authToken");
          setUser(null);
          setLoading(false);
          return;
        }

        // API verification in background
        setTimeout(async () => {
          try {
            const response = await fetch("/api/auth/verify", {
              headers: { Authorization: `Bearer ${localToken}` },
            });
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            }
          } catch (error) {
            // Silent fail - use token data
          }
        }, 100);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
        verifiedRef.current = true;
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
