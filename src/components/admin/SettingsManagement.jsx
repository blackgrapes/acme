// File: src/components/admin/SettingsManagement.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import StatsCards from "./StatsCards";
import CategoryTabs from "./CategoryTabs";
import ActionBar from "./ActionBar";
import ContentTable from "./ContentTable";
import { WeProvideDialog, GalleryDialog, ClientsDialog, TestimonialsDialog } from "./Dialogs";
import { Shield, ImageIcon, Users, MessageSquare } from "lucide-react";

const FRONTEND_CATEGORIES = [
  {
    id: "weprovide",
    name: "Our Services",
    icon: Shield,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400",
  },
  {
    id: "gallery",
    name: "Gallery",
    icon: ImageIcon,
    color: "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400",
  },
  {
    id: "clients",
    name: "Clients",
    icon: Users,
    color: "bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400",
  },
  {
    id: "testimonials",
    name: "Testimonials",
    icon: MessageSquare,
    color: "bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400",
  },
];

export default function SettingsManagement({ settings }) {
  const [activeCategory, setActiveCategory] = useState(FRONTEND_CATEGORIES[0]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
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
      const response = await fetch(`/api/frontend/${activeCategory.id}`);
      if (response.ok) {
        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      } else {
        setItems([]);
      }
    } catch (error) {
      showError("Failed to load data");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced filtering based on schema fields
  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    switch (activeCategory.id) {
      case "weprovide":
        return (
          item.title?.toLowerCase().includes(searchLower) ||
          item.summary?.toLowerCase().includes(searchLower) ||
          item.slug?.toLowerCase().includes(searchLower) ||
          item.benefits?.some(benefit => benefit.toLowerCase().includes(searchLower))
        );
      case "gallery":
        return (
          item.caption?.toLowerCase().includes(searchLower) ||
          item.tag?.toLowerCase().includes(searchLower) ||
          item.type?.toLowerCase().includes(searchLower)
        );
      case "clients":
        return (
          item.name?.toLowerCase().includes(searchLower) ||
          item.quote?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
        );
      case "testimonials":
        return (
          item.quote?.toLowerCase().includes(searchLower) ||
          item.author?.toLowerCase().includes(searchLower) ||
          item.position?.toLowerCase().includes(searchLower)
        );
      default:
        return true;
    }
  });

  const showError = (message) => {
    toast({ title: "Error", description: message, variant: "destructive" });
  };

  const showSuccess = (message) => {
    toast({ title: "Success", description: message });
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Upload failed");

    const result = await response.json();
    return result.fileUrl;
  };

  const toggleVisibility = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/frontend/${activeCategory.id}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showOnHome: !currentStatus }),
      });

      if (response.ok) {
        showSuccess("Visibility updated");
        loadData();
      }
    } catch (error) {
      showError("Failed to update visibility");
    }
  };

  const deleteItem = async (id, itemName) => {
    if (!confirm(`Delete this ${itemName}?`)) return;

    try {
      const response = await fetch(`/api/frontend/${activeCategory.id}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showSuccess(`${itemName} deleted`);
        loadData();
      }
    } catch (error) {
      showError(`Failed to delete ${itemName}`);
    }
  };

  // Dialog Content Renderer
  const renderDialogContent = () => {
    const dialogProps = {
      onSuccess: () => {
        showSuccess("Item added successfully");
        setDialogOpen(false);
        loadData();
      },
      onError: showError,
      uploadFile,
    };

    switch (activeCategory.id) {
      case "weprovide":
        return <WeProvideDialog {...dialogProps} />;
      case "gallery":
        return <GalleryDialog {...dialogProps} />;
      case "clients":
        return <ClientsDialog {...dialogProps} />;
      case "testimonials":
        return <TestimonialsDialog {...dialogProps} />;
      default:
        return <WeProvideDialog {...dialogProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <HeaderSection />

        {/* Stats Cards - Only show if we have data */}
        {(items.length > 0 || loading) && (
          <StatsCards 
            items={items} 
            activeCategory={activeCategory} 
          />
        )}

        {/* Category Tabs */}
        <CategoryTabs
          categories={FRONTEND_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Action Bar */}
        <ActionBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchInputRef={searchInputRef}
          activeCategory={activeCategory}
          dialogOpen={dialogOpen}
          onDialogChange={setDialogOpen}
          renderDialogContent={renderDialogContent}
        />

        {/* Content Table */}
        <ContentTable
          activeCategory={activeCategory}
          filteredItems={filteredItems}
          loading={loading}
          onToggleVisibility={toggleVisibility}
          onDeleteItem={deleteItem}
        />
      </div>
    </div>
  );
}

// Header Section Component
const HeaderSection = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Frontend Management</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Manage your frontend content sections
      </p>
    </div>
    <div className="p-3 bg-primary/10 rounded-lg self-start sm:self-auto">
      <Shield className="h-6 w-6 text-primary" />
    </div>
  </div>
);