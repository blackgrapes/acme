// Updated File: src/components/admin/DesktopSidebar.jsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  FileText,
  UserPlus,
  Mail,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Users2,
} from "lucide-react";

export default function DesktopSidebar({
  activeTab,
  setActiveTab,
  documentCategories = [],
  setDocumentCategories,
}) {
  const [documentDropdownOpen, setDocumentDropdownOpen] = useState(false);

  // Auto-open document dropdown if a sub-tab is active
  useEffect(() => {
    if (activeTab.startsWith("documents-") && activeTab !== "documents-all") {
      setDocumentDropdownOpen(true);
    } else if (!activeTab.startsWith("documents-")) {
      setDocumentDropdownOpen(false);
    }
  }, [activeTab]);

  const toggleDocumentDropdown = () => {
    setDocumentDropdownOpen(!documentDropdownOpen);
  };

  const isActive = (tab) => activeTab === tab;

  const handleDocumentClick = () => {
    setActiveTab("documents-all");
    toggleDocumentDropdown();
  };

  return (
    <aside className="w-64 border-r border-border bg-card shadow-sm hidden md:block">
      <nav className="p-4 space-y-1 flex flex-col h-full">
        <div className="space-y-1">
          <Button
            variant={isActive("dashboard") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("dashboard")
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Shield className="h-4 w-4 mr-2" />
            Dashboard
          </Button>

          <Button
            variant={isActive("clients") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("clients")
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("clients")}
          >
            <Users className="h-4 w-4 mr-2" />
            Client Management
          </Button>

          {/* Document Management with Dropdown */}
          <div className="space-y-1">
            <Button
              variant={activeTab.startsWith("documents") ? "default" : "ghost"}
              className={`w-full justify-start shadow-sm ${
                activeTab.startsWith("documents")
                  ? "bg-primary text-white"
                  : "text-primary-foreground"
              }`}
              onClick={handleDocumentClick}
            >
              <FileText className="h-4 w-4 mr-2" />
              Document Management
              {documentDropdownOpen ? (
                <ChevronDown className="h-4 w-4 ml-auto transition-transform duration-200" />
              ) : (
                <ChevronRight className="h-4 w-4 ml-auto transition-transform duration-200" />
              )}
            </Button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                documentDropdownOpen
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="pl-6 space-y-1 pt-1">
                {documentCategories.map((category) =>
                  category.children ? (
                    category.children.map((child, index) => {
                      const childSlug = child
                        .replace(/\s+/g, "-")
                        .toLowerCase();
                      const isActive = activeTab === `documents-${childSlug}`;
                      return (
                        <Button
                          key={`${category.id}-${index}`}
                          variant={isActive ? "default" : "ghost"}
                          className={`w-full justify-start text-sm shadow-sm ${
                            isActive
                              ? "bg-primary text-white"
                              : "text-primary-foreground"
                          }`}
                          onClick={() => setActiveTab(`documents-${childSlug}`)}
                        >
                          {child}
                        </Button>
                      );
                    })
                  ) : (
                    <Button
                      key={category.id}
                      variant={
                        activeTab ===
                        `documents-${category.name
                          .replace(/\s+/g, "-")
                          .toLowerCase()}`
                          ? "default"
                          : "ghost"
                      }
                      className={`w-full justify-start text-sm shadow-sm ${
                        activeTab ===
                        `documents-${category.name
                          .replace(/\s+/g, "-")
                          .toLowerCase()}`
                          ? "bg-primary text-white"
                          : "text-primary-foreground"
                      }`}
                      onClick={() =>
                        setActiveTab(
                          `documents-${category.name
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`
                        )
                      }
                    >
                      {category.name}
                    </Button>
                  )
                )}
                <Button
                  variant={
                    activeTab === "documents-add-tab" ? "default" : "ghost"
                  }
                  className={`w-full justify-start text-sm shadow-sm ${
                    activeTab === "documents-add-tab"
                      ? "bg-primary text-white"
                      : "text-primary-foreground"
                  }`}
                  onClick={() => setActiveTab("documents-add-tab")}
                >
                  + Add New Tab
                </Button>
              </div>
            </div>
          </div>

          <Button
            variant={isActive("requests") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("requests")
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Request Reports
          </Button>

          <Button
            variant={isActive("guards") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("guards")
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("guards")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Guards
          </Button>

          <Button
            variant={isActive("roles") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("roles")
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("roles")}
          >
            <Users2 className="h-4 w-4 mr-2" />
            Roles & Users
          </Button>

          <Button
            variant={isActive("contact") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("contact")
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>

          <Button
            variant={isActive("settings") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("settings")
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        <div className="mt-auto space-y-1 pt-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start shadow-sm text-white bg-primary"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>
    </aside>
  );
}
