// File: src/hooks/useOptimizedData.js
"use client";

import { useState, useEffect, useRef } from "react";

export function useOptimizedData(fetchFunction, dependencies = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFunction();
        setData(result);
        fetchedRef.current = true;
      } catch (error) {
        console.error("Fetch error:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading };
}

// Optimized client fetch
export function useOptimizedClients() {
  return useOptimizedData(async () => {
    const response = await fetch("/api/auth/client?fields=name,email,status");
    const data = await response.json();
    return data.clients || [];
  });
}

// Optimized documents fetch
export function useOptimizedDocuments(params = "") {
  return useOptimizedData(async () => {
    const response = await fetch(`/api/documents?${params}&limit=50`);
    const data = await response.json();
    return data.documents || [];
  }, [params]);
}
