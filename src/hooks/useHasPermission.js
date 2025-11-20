import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function useHasPermission() {
  const { hasPermission, user, loading } = useAuth();

  const check = useMemo(() => {
    return (perm) => {
      if (loading) return false;
      return hasPermission(perm);
    };
  }, [hasPermission, loading]);

  return { hasPermission: check, user, loading };
}
