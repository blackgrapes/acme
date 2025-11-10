"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import StatsCards from "./SettingsComponents/StatsCards";
import CategoryTabs from "./CategoryTabs";
import ActionBar from "./SettingsComponents/ActionBar";
import ContentTable from "./SettingsComponents/ContentTable";
import { Mail, Shield } from "lucide-react";

const EMAIL_CATEGORIES = [
  {
    id: "email-limits",
    name: "Email Limits",
    icon: Mail,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400",
  },
  {
    id: "fallback-requests", 
    name: "Fallback Requests",
    icon: Shield,
    color: "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400",
  }
];

export default function EmailManagement() {
  const [activeCategory, setActiveCategory] = useState(EMAIL_CATEGORIES[0]);
  const [limitsData, setLimitsData] = useState(null);
  const [fallbackData, setFallbackData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Refs
  const searchInputRef = useRef(null);

  // Effects
  useEffect(() => {
    if (document.activeElement !== searchInputRef.current && searchQuery !== "") {
      searchInputRef.current?.focus();
    }
  }, [searchQuery]);

  useEffect(() => {
    loadData();
  }, [activeCategory]);

  // Data Management
  const loadData = async () => {
    setLoading(true);
    try {
      if (activeCategory.id === 'email-limits') {
        const response = await fetch('/api/admin/email-limits');
        if (response.ok) {
          const data = await response.json();
          setLimitsData(data);
        } else {
          setLimitsData(null);
        }
      } else {
        const response = await fetch('/api/admin/fallback-requests');
        if (response.ok) {
          const data = await response.json();
          setFallbackData(data.requests || []);
        } else {
          setFallbackData([]);
        }
      }
    } catch (error) {
      showError("Failed to load data");
      if (activeCategory.id === 'email-limits') {
        setLimitsData(null);
      } else {
        setFallbackData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get current items based on active category
  const getCurrentItems = () => {
    if (activeCategory.id === 'email-limits') {
      return limitsData?.userCounts || [];
    } else {
      return fallbackData;
    }
  };

  // Enhanced filtering based on category
  const filteredItems = getCurrentItems().filter((item) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    switch (activeCategory.id) {
      case "email-limits":
        return (
          item.email?.toLowerCase().includes(searchLower) ||
          item.status?.toLowerCase().includes(searchLower)
        );
      case "fallback-requests":
        return (
          item.email?.toLowerCase().includes(searchLower) ||
          item.status?.toLowerCase().includes(searchLower) ||
          item.reason?.toLowerCase().includes(searchLower)
        );
      default:
        return true;
    }
  });

  const showError = (message) => {
    toast({ 
      title: "Error", 
      description: message, 
      variant: "destructive" 
    });
  };

  const showSuccess = (message) => {
    toast({ 
      title: "Success", 
      description: message 
    });
  };

  // Action handlers for Email Limits
  const resetLimits = async () => {
    if (!confirm('Are you sure you want to reset today\'s email limits? This cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch('/api/admin/email-limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess(data.message);
        loadData();
      } else {
        showError(data.error || "Failed to reset limits");
      }
    } catch (error) {
      console.error('Error resetting limits:', error);
      showError("Failed to reset limits");
    }
  };

  // Action handlers for Fallback Requests
  const getAdminUserId = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return user.id || user._id;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
    return null;
  };


const handleUpdateStatus = async (requestId, status, notes = '', newPassword = '') => {
  try {
    const adminUserId = getAdminUserId();
    
    const res = await fetch('/api/admin/fallback-requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        requestId, 
        status, 
        adminNotes: notes,
        newPassword,
        completedBy: adminUserId
      })
    });

    const data = await res.json();

    if (res.ok) {
      showSuccess(`Request marked as ${status}`);
      loadData();
    } else {
      throw new Error(data.error || "Failed to update request");
    }
  } catch (error) {
    console.error('Error updating request:', error);
    showError(error.message || "Failed to update request");
  }
};

  // Stats calculation for Email Limits
  const getEmailLimitsStats = () => {
    if (!limitsData) return null;
    
    return {
      dailyCount: limitsData.dailyCount,
      dailyLimit: limitsData.dailyLimit,
      remainingDaily: limitsData.remainingDaily,
      perUserLimit: limitsData.perUserLimit,
      lastReset: limitsData.lastReset,
      totalUsers: limitsData.userCounts?.length || 0,
      activeUsers: limitsData.userCounts?.filter(user => user.count < user.limit).length || 0,
      limitReachedUsers: limitsData.userCounts?.filter(user => user.count >= user.limit).length || 0
    };
  };

  // Stats calculation for Fallback Requests
  const getFallbackStats = () => {
    return {
      totalRequests: fallbackData.length,
      pendingRequests: fallbackData.filter(req => req.status === 'pending').length,
      completedRequests: fallbackData.filter(req => req.status === 'completed').length,
      cancelledRequests: fallbackData.filter(req => req.status === 'cancelled').length
    };
  };

  const emailStats = getEmailLimitsStats();
  const fallbackStats = getFallbackStats();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <HeaderSection />

        {/* Stats Cards - Always show stats for both categories */}
        <StatsCards 
          activeCategory={activeCategory}
          emailStats={emailStats}
          fallbackStats={fallbackStats}
          loading={loading}
        />

        {/* Category Tabs */}
        <CategoryTabs
          categories={EMAIL_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Action Bar */}
        <ActionBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          searchInputRef={searchInputRef}
          onRefresh={loadData}
          onResetLimits={activeCategory.id === 'email-limits' ? resetLimits : null}
        />

        {/* Content Table */}
        <ContentTable
          activeCategory={activeCategory}
          filteredItems={filteredItems}
          loading={loading}
          onUpdateStatus={handleUpdateStatus}
          emailStats={emailStats}
          fallbackStats={fallbackStats}
        />
      </div>
    </div>
  );
}

// Header Section Component
const HeaderSection = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Email Management</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Manage email limits and fallback password reset requests
      </p>
    </div>
    <div className="p-3 bg-primary/10 rounded-lg self-start sm:self-auto">
      <Mail className="h-6 w-6 text-primary" />
    </div>
  </div>
);