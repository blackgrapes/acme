// File: src/components/client/UnifiedSidebar.jsx - UPDATED WITH ACTIVE STATE
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
  LifeBuoy,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UnifiedSidebar({
  activeTab,
  setActiveTab,
  documentCategories = [],
  companyDocumentCategories = [],
  isMobile = false,
  pendingRequestsCount,
  onNavigate = () => { },
}) {
  const [documentDropdownOpen, setDocumentDropdownOpen] = useState(false);
  const [companyDocumentDropdownOpen, setCompanyDocumentDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // ✅ OPTIMIZED: Single useEffect for pathname
  useEffect(() => {
    setDocumentDropdownOpen(pathname.includes("/documents"));
    setCompanyDocumentDropdownOpen(pathname.includes("/company-documents"));
  }, [pathname]);

  // ✅ FIXED: Check if document-requests is active
  useEffect(() => {
    if (pathname.includes("/document-requests")) {
      setActiveTab("document-requests");
    }
  }, [pathname, setActiveTab]);

  // ✅ FIXED: useCallback for navigation
  const handleNavigation = useCallback(
    (tab) => {
      setActiveTab(tab);
      if (tab === "overview") {
        router.push("/client-dashboard");
      } else if (tab === "document-requests") {
        router.push("/client-dashboard/document-requests"); // Changed route
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
      if (category.id === "all") {
        setActiveTab("documents");
      } else {
        setActiveTab(`documents-${category.id}`);
      }

      if (window.handleClientDocumentCategoryChange) {
        window.handleClientDocumentCategoryChange(category);
      }
    },
    [setActiveTab]
  );

  // ✅ FIXED: Handle company document category change - NO ROUTE CHANGE
  const handleCompanyDocumentCategoryChange = useCallback(
    (category) => {
      if (category.id === "all") {
        setActiveTab("company-documents");
      } else {
        setActiveTab(`company-documents-${category.id}`);
      }

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

  // ✅ FIXED: Check if tab is active
  const isActive = (tab) => {
    return activeTab === tab;
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Scrollable Content Area with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/30 hover:scrollbar-thumb-border/50">
        <nav className="space-y-1 p-4 w-full max-w-full">
          <div className="space-y-1 w-full">
            {/* Overview Button */}
            <Button
              variant={isActive("overview") ? "default" : "ghost"}
              className={`w-full cursor-pointer justify-start shadow-sm truncate ${isActive("overview")
                ? "bg-primary text-white"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => handleNavigation("overview")}
            >
              <Home className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Overview</span>
            </Button>

            {/* DOCUMENTS SECTION - SHOW ONLY IF CATEGORIES EXIST */}
            {documentCategories.length > 0 && (
              <div className="space-y-1 w-full">
                <Button
                  variant={activeTab.startsWith("documents") ? "default" : "ghost"}
                  className={`w-full cursor-pointer justify-start shadow-sm truncate ${activeTab.startsWith("documents")
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  onClick={() => {
                    setDocumentDropdownOpen(!documentDropdownOpen);
                    if (!documentDropdownOpen && !pathname.includes("/documents")) {
                      handleNavigation("documents");
                    }
                  }}
                >
                  <Folder className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Documents</span>
                  <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full flex-shrink-0">
                    {documentCategories.reduce((sum, cat) => sum + (cat.count || 0), 0)}
                  </span>
                  {documentDropdownOpen ? (
                    <ChevronDown className="h-4 w-4 ml-auto flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />
                  )}
                </Button>

                {documentDropdownOpen && (
                  <div className="pl-6 space-y-1 pt-1 w-full">
                    <Button
                      variant={activeTab === "documents" ? "default" : "ghost"}
                      className={`w-full cursor-pointer justify-start text-sm shadow-sm truncate ${activeTab === "documents"
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      onClick={() => {
                        handleDocumentCategoryChange({
                          id: "all",
                          name: "All Documents",
                        });
                      }}
                    >
                      <span className="truncate">All Documents</span>
                    </Button>

                    {documentCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          activeTab === `documents-${category.id}`
                            ? "default"
                            : "ghost"
                        }
                        className={`w-full cursor-pointer justify-start text-sm shadow-sm truncate ${activeTab === `documents-${category.id}`
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        onClick={() => {
                          handleDocumentCategoryChange(category);
                        }}
                      >
                        <span className="truncate">{category.name}</span>
                        {category.count > 0 && (
                          <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full flex-shrink-0">
                            {category.count}
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COMPANY DOCUMENTS SECTION - SHOW ONLY IF CATEGORIES EXIST */}
            {companyDocumentCategories.length > 0 && (
              <div className="space-y-1 w-full">
                <Button
                  variant={
                    activeTab.startsWith("company-documents") ? "default" : "ghost"
                  }
                  className={`w-full cursor-pointer justify-start shadow-sm truncate ${activeTab.startsWith("company-documents")
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
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
                  <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Company Documents</span>
                  <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full flex-shrink-0">
                    {companyDocumentCategories.reduce((sum, cat) => sum + (cat.count || 0), 0)}
                  </span>
                  {companyDocumentDropdownOpen ? (
                    <ChevronDown className="h-4 w-4 ml-auto flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />
                  )}
                </Button>

                {companyDocumentDropdownOpen && (
                  <div className="pl-6 space-y-1 pt-1 w-full">
                    <Button
                      variant={
                        activeTab === "company-documents" ? "default" : "ghost"
                      }
                      className={`w-full cursor-pointer justify-start text-sm shadow-sm truncate ${activeTab === "company-documents"
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      onClick={() => {
                        handleCompanyDocumentCategoryChange({
                          id: "all",
                          name: "All Company Documents",
                        });
                      }}
                    >
                      <span className="truncate">All Company Documents</span>
                    </Button>

                    {companyDocumentCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          activeTab === `company-documents-${category.id}`
                            ? "default"
                            : "ghost"
                        }
                        className={`w-full cursor-pointer justify-start text-sm shadow-sm truncate ${activeTab === `company-documents-${category.id}`
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        onClick={() => {
                          handleCompanyDocumentCategoryChange(category);
                        }}
                      >
                        <span className="truncate">{category.name}</span>
                        {category.count > 0 && (
                          <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full flex-shrink-0">
                            {category.count}
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* DOCUMENT REQUESTS SECTION - SINGLE BUTTON */}
            <Button
              variant={isActive("document-requests") ? "default" : "ghost"}
              className={`w-full cursor-pointer justify-start shadow-sm truncate relative ${isActive("document-requests")
                ? "bg-primary text-white"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => handleNavigation("document-requests")} // Updated
            >
              <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Document Requests</span>

              {/* Badge for pending requests */}
              {pendingRequestsCount > 0 && (
                <div className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs flex-shrink-0 text-primary rounded-full">
                  {pendingRequestsCount}
                </div>
              )}
            </Button>

            {/* Management Button */}
            <Button
              variant={isActive("management") ? "default" : "ghost"}
              className={`w-full cursor-pointer justify-start shadow-sm truncate ${isActive("management")
                ? "bg-primary text-white"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => handleNavigation("management")}
            >
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Management</span>
            </Button>
            <Button
              variant={isActive("support") ? "default" : "ghost"}
              className={`w-full cursor-pointer justify-start shadow-sm truncate ${isActive("support")
                  ? "bg-primary text-white"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              onClick={() => handleNavigation("support")}
            >
              <LifeBuoy className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Support</span>
            </Button>
          </div>
        </nav>
      </div>

      {/* Logout Button */}
      <div className={`flex-shrink-0 border-t border-border/50 p-4 w-full`}>
        <Button
          variant="ghost"
          className="w-full cursor-pointer justify-start shadow-sm bg-primary text-white truncate"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">Sign Out</span>
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <SheetContent
        side="left"
        className="w-72 p-0 bg-white border-r border-border shadow-sm flex flex-col overflow-hidden"
      >
        {renderSidebarContent()}
      </SheetContent>
    );
  }

  return (
    <aside className="w-70 border-r border-border bg-card shadow-sm hidden md:flex flex-col h-screen sticky top-0 overflow-hidden">
      {renderSidebarContent()}
    </aside>
  );
}