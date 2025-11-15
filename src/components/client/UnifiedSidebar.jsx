// File: src/components/client/UnifiedSidebar.jsx - FIXED NO ROUTE CHANGE
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SheetContent } from "@/components/ui/sheet";
import {
  Home,
  FileText,
  Folder,
  Users,
  LogOut,
  ChevronDown,
  ChevronRight,
  Building,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UnifiedSidebar({
  activeTab,
  setActiveTab,
  documentCategories = [],
  companyDocumentCategories = [],
  isMobile = false,
  onNavigate = () => {},
}) {
  const [documentDropdownOpen, setDocumentDropdownOpen] = useState(false);
  const [companyDocumentDropdownOpen, setCompanyDocumentDropdownOpen] =
    useState(false);
  const { hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ OPTIMIZED: Single useEffect
  useEffect(() => {
    setDocumentDropdownOpen(pathname.includes("/documents"));
    setCompanyDocumentDropdownOpen(pathname.includes("/company-documents"));
  }, [pathname]);

  // ✅ FIXED: useCallback for navigation - ONLY FOR MAIN TABS
  const handleNavigation = useCallback(
    (tab) => {
      setActiveTab(tab);
      if (tab === "overview") {
        router.push("/client-dashboard");
      } else {
        router.push(`/client-dashboard/${tab}`);
      }
      onNavigate();
    },
    [setActiveTab, router, onNavigate]
  );

  // ✅ FIXED: Handle document category change - NO ROUTE CHANGE
  const handleDocumentCategoryChange = useCallback(
    (category) => {
      // Only update active tab internally without route change
      if (category.id === "all") {
        setActiveTab("documents");
      } else {
        setActiveTab(`documents-${category.id}`);
      }

      // Trigger category change in parent component
      if (window.handleClientDocumentCategoryChange) {
        window.handleClientDocumentCategoryChange(category);
      }
    },
    [setActiveTab]
  );

  // ✅ FIXED: Handle company document category change - NO ROUTE CHANGE
  const handleCompanyDocumentCategoryChange = useCallback(
    (category) => {
      // Only update active tab internally without route change
      if (category.id === "all") {
        setActiveTab("company-documents");
      } else {
        setActiveTab(`company-documents-${category.id}`);
      }

      // Trigger category change in parent component
      if (window.handleClientCompanyDocumentCategoryChange) {
        window.handleClientCompanyDocumentCategoryChange(category);
      }
    },
    [setActiveTab]
  );

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("authToken");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (tab) => activeTab === tab;

  const renderSidebarContent = () => (
    <nav
      className={`space-y-1 flex flex-col h-full ${
        isMobile ? "p-4 overflow-y-auto" : "p-4"
      }`}
    >
      <div className="space-y-1">
        <Button
          variant={isActive("overview") ? "default" : "ghost"}
          className={`w-full justify-start shadow-sm ${
            isActive("overview")
              ? "bg-primary text-white"
              : "text-primary-foreground"
          }`}
          onClick={() => handleNavigation("overview")}
        >
          <Home className="h-4 w-4 mr-2" />
          Overview
        </Button>

        {/* Documents */}
        <div className="space-y-1">
          <Button
            variant={activeTab.startsWith("documents") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab.startsWith("documents")
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => {
              setDocumentDropdownOpen(!documentDropdownOpen);
              if (!documentDropdownOpen && !pathname.includes("/documents")) {
                handleNavigation("documents");
              }
            }}
          >
            <Folder className="h-4 w-4 mr-2" />
            Documents
            {documentDropdownOpen ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </Button>

          {documentDropdownOpen && (
            <div className="pl-6 space-y-1 pt-1">
              <Button
                variant={activeTab === "documents" ? "default" : "ghost"}
                className={`w-full justify-start text-sm shadow-sm ${
                  activeTab === "documents"
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  handleDocumentCategoryChange({
                    id: "all",
                    name: "All Documents",
                  });
                }}
              >
                All Documents
              </Button>

              {documentCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    activeTab === `documents-${category.id}`
                      ? "default"
                      : "ghost"
                  }
                  className={`w-full justify-start text-sm shadow-sm ${
                    activeTab === `documents-${category.id}`
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => {
                    handleDocumentCategoryChange(category);
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Company Documents */}
        <div className="space-y-1">
          <Button
            variant={
              activeTab.startsWith("company-documents") ? "default" : "ghost"
            }
            className={`w-full justify-start shadow-sm ${
              activeTab.startsWith("company-documents")
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => {
              setCompanyDocumentDropdownOpen(!companyDocumentDropdownOpen);
              if (
                !companyDocumentDropdownOpen &&
                !pathname.includes("/company-documents")
              ) {
                handleNavigation("company-documents");
              }
            }}
          >
            <Building className="h-4 w-4 mr-2" />
            Company Documents
            {companyDocumentDropdownOpen ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </Button>

          {companyDocumentDropdownOpen && (
            <div className="pl-6 space-y-1 pt-1">
              <Button
                variant={
                  activeTab === "company-documents" ? "default" : "ghost"
                }
                className={`w-full justify-start text-sm shadow-sm ${
                  activeTab === "company-documents"
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  handleCompanyDocumentCategoryChange({
                    id: "all",
                    name: "All Company Documents",
                  });
                }}
              >
                All Company Documents
              </Button>

              {companyDocumentCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    activeTab === `company-documents-${category.id}`
                      ? "default"
                      : "ghost"
                  }
                  className={`w-full justify-start text-sm shadow-sm ${
                    activeTab === `company-documents-${category.id}`
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => {
                    handleCompanyDocumentCategoryChange(category);
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        <Button
          variant={isActive("management") ? "default" : "ghost"}
          className={`w-full justify-start shadow-sm ${
            isActive("management")
              ? "bg-primary text-white"
              : "text-primary-foreground"
          }`}
          onClick={() => handleNavigation("management")}
        >
          <Users className="h-4 w-4 mr-2" />
          Management
        </Button>
      </div>

      <div
        className={`mt-auto space-y-1 pt-4 ${
          isMobile ? "border-t border-border/50" : "border-t border-border"
        }`}
      >
        <Button
          variant="ghost"
          className="w-full justify-start shadow-sm bg-primary text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </nav>
  );

  if (isMobile) {
    return (
      <SheetContent
        side="left"
        className="w-64 p-0 bg-white border-r border-border shadow-sm"
      >
        {renderSidebarContent()}
      </SheetContent>
    );
  }

  return (
    <aside className="w-64 border-r border-border bg-card shadow-sm hidden md:block">
      {renderSidebarContent()}
    </aside>
  );
}


