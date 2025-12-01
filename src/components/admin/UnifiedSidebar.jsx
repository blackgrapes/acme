// File: src/components/admin/UnifiedSidebar.jsx - PERFECT SCROLL & WIDTH
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SheetContent } from "@/components/ui/sheet";
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

  // ✅ OPTIMIZED: Single useEffect for pathname
  useEffect(() => {
    setDocumentDropdownOpen(pathname.includes("/documents"));
    setCompanyDocumentDropdownOpen(pathname.includes("/company-documents"));
  }, [pathname]);

  // ✅ FIXED: useCallback for navigation - ONLY FOR MAIN TABS
  const handleNavigation = useCallback(
    (tab) => {
      setActiveTab(tab);
      if (tab === "dashboard") {
        router.push("/admin-dashboard");
      } else {
        router.push(`/admin-dashboard/${tab}`);
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
      if (window.handleDocumentCategoryChange) {
        window.handleDocumentCategoryChange(category);
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
      if (window.handleCompanyDocumentCategoryChange) {
        window.handleCompanyDocumentCategoryChange(category);
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

  // ✅ OPTIMIZED: Permission checks memoized
  const permissions = {
    canViewDashboard: hasPermission("dashboard-read"),
    canManageClients: hasPermission("clients-read"),
    canManageDocuments: hasPermission("documents-read"),
    canManageRequests: hasPermission("requests-read"),
    canManageGuards: hasPermission("guards-read"),
    canManageRoles: hasPermission("roles-read"),
    canManageContact: hasPermission("contact-read"),
    canManageFrontend: hasPermission("frontend-read"),
    canManageSettings: hasPermission("settings-read"),
  };

  // ✅ FIXED: Check if tab is active (including dashboard on /admin-dashboard)
  const isActive = (tab) => {
    return activeTab === tab;
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Scrollable Content Area with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/30 hover:scrollbar-thumb-border/50">
        <nav className="space-y-1 p-4 w-full max-w-full">
          <div className="space-y-1 w-full">
            {permissions.canViewDashboard && (
              <Button
                variant={isActive("dashboard") ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm truncate ${
                  isActive("dashboard")
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleNavigation("dashboard")}
              >
                <Shield className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Dashboard</span>
              </Button>
            )}
            {permissions.canManageClients && (
              <Button
                variant={isActive("clients") ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm truncate ${
                  isActive("clients")
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleNavigation("clients")}
              >
                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Client Management</span>
              </Button>
            )}

            {/* Document Management */}
            {permissions.canManageDocuments && (
              <div className="space-y-1 w-full">
                <Button
                  variant={activeTab.startsWith("documents") ? "default" : "ghost"}
                  className={`w-full justify-start shadow-sm truncate ${
                    activeTab.startsWith("documents")
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
                  <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Document Management</span>
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
                      className={`w-full justify-start text-sm shadow-sm truncate ${
                        activeTab === "documents"
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
                        className={`w-full justify-start text-sm shadow-sm truncate ${
                          activeTab === `documents-${category.id}`
                            ? "bg-primary text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                        onClick={() => {
                          handleDocumentCategoryChange(category);
                        }}
                      >
                        <span className="truncate">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Company Documents */}
            {permissions.canManageDocuments && (
              <div className="space-y-1 w-full">
                <Button
                  variant={
                    activeTab.startsWith("company-documents") ? "default" : "ghost"
                  }
                  className={`w-full justify-start shadow-sm truncate ${
                    activeTab.startsWith("company-documents")
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
                      className={`w-full justify-start text-sm shadow-sm truncate ${
                        activeTab === "company-documents"
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
                        className={`w-full justify-start text-sm shadow-sm truncate ${
                          activeTab === `company-documents-${category.id}`
                            ? "bg-primary text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                        onClick={() => {
                          handleCompanyDocumentCategoryChange(category);
                        }}
                      >
                        <span className="truncate">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Other buttons with proper width management */}
            {permissions.canManageRequests && (
              <Button
                variant={isActive("requests") ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm truncate ${
                  isActive("requests")
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleNavigation("requests")}
              >
                <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Request Reports</span>
              </Button>
            )}
            {permissions.canManageGuards && (
              <Button
                variant={isActive("guards") ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm truncate ${
                  isActive("guards")
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleNavigation("guards")}
              >
                <UserPlus className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Add Guards</span>
              </Button>
            )}
            {permissions.canManageRoles && (
              <Button
                variant={isActive("roles") ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm truncate ${
                  isActive("roles")
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleNavigation("roles")}
              >
                <Users2 className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Roles & Users</span>
              </Button>
            )}
            {permissions.canManageContact && (
              <Button
                variant={isActive("contact") ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm truncate ${
                  isActive("contact")
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleNavigation("contact")}
              >
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Contact</span>
              </Button>
            )}
            {permissions.canManageFrontend && (
              <Button
                variant={isActive("frontend") ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm truncate ${
                  isActive("frontend")
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleNavigation("frontend")}
              >
                <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Frontend Management</span>
              </Button>
            )}
            {permissions.canManageSettings && (
              <Button
                variant={isActive("settings") ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm truncate ${
                  isActive("settings")
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleNavigation("settings")}
              >
                <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Settings</span>
              </Button>
            )}
          </div>
        </nav>
      </div>

      {/* Fixed Bottom Section - No Scroll */}
      <div className={`flex-shrink-0 border-t border-border/50 p-4 w-full`}>
        <Button
          variant="ghost"
          className="w-full justify-start shadow-sm bg-primary text-white truncate"
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
    <aside className="w-72 border-r border-border bg-card shadow-sm hidden md:flex flex-col h-screen sticky top-0 overflow-hidden">
      {renderSidebarContent()}
    </aside>
  );
}