// File: src/hooks/useRealtimeRequests.js
"use client";

import { useEffect, useState } from "react";

export default function useRealtimeRequests(interval = 15000) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/requests");
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const timer = setInterval(fetchRequests, interval);
    return () => clearInterval(timer);
  }, []);

  return { requests, loading, refresh: fetchRequests };
}
