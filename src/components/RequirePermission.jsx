"use client";
import React from "react";
import { useAuth } from "@/hooks/useAuth";

export default function RequirePermission({ permission, children, fallback = null }) {
  const { hasPermission, loading } = useAuth();

  if (loading) return null;

  if (!permission) return children;

  return hasPermission(permission) ? children : fallback;
}
