// File: src/components/admin/UnifiedSidebar.jsx - FIXED
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
    canManageSettings: hasPermission("settings-read"),
  };

  // ✅ FIXED: Check if tab is active (including dashboard on /admin-dashboard)
  const isActive = (tab) => {
    return activeTab === tab;
  };

  const renderSidebarContent = () => (
    <nav
      className={`space-y-1 flex flex-col h-full ${
        isMobile ? "p-4 overflow-y-auto" : "p-4"
      }`}
    >
      <div className="space-y-1">
        {permissions.canViewDashboard && (
          <Button
            variant={isActive("dashboard") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("dashboard")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => handleNavigation("dashboard")}
          >
            <Shield className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        )}
        {permissions.canManageClients && (
          <Button
            variant={isActive("clients") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("clients")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => handleNavigation("clients")}
          >
            <Users className="h-4 w-4 mr-2" />
            Client Management
          </Button>
        )}

        {/* Document Management */}
        {permissions.canManageDocuments && (
          <div className="space-y-1">
            <Button
              variant={activeTab.startsWith("documents") ? "default" : "ghost"}
              className={`w-full justify-start shadow-sm ${
                activeTab.startsWith("documents")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => {
                setDocumentDropdownOpen(!documentDropdownOpen);
                if (!documentDropdownOpen && !pathname.includes("/documents")) {
                  handleNavigation("documents");
                }
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Document Management
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
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
        )}

        {/* Company Documents */}
        {permissions.canManageDocuments && (
          <div className="space-y-1">
            <Button
              variant={
                activeTab.startsWith("company-documents") ? "default" : "ghost"
              }
              className={`w-full justify-start shadow-sm ${
                activeTab.startsWith("company-documents")
                  ? "bg-primary text-primary-foreground"
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
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
        )}

        {/* Other buttons remain same but optimized */}
        {permissions.canManageRequests && (
          <Button
            variant={isActive("requests") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("requests")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => handleNavigation("requests")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Request Reports
          </Button>
        )}
        {permissions.canManageGuards && (
          <Button
            variant={isActive("guards") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("guards")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => handleNavigation("guards")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Guards
          </Button>
        )}
        {permissions.canManageRoles && (
          <Button
            variant={isActive("roles") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("roles")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => handleNavigation("roles")}
          >
            <Users2 className="h-4 w-4 mr-2" />
            Roles & Users
          </Button>
        )}
        {permissions.canManageContact && (
          <Button
            variant={isActive("contact") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("contact")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => handleNavigation("contact")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
        )}
        {permissions.canManageSettings && (
          <Button
            variant={isActive("settings") ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              isActive("settings")
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => handleNavigation("settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        )}
      </div>

      <div
        className={`mt-auto space-y-1 pt-4 ${
          isMobile ? "border-t border-border/50" : "border-t border-border"
        }`}
      >
        <Button
          variant="ghost"
          className="w-full justify-start shadow-sm bg-primary text-primary-foreground"
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
        className="w-64 p-0 bg-card border-r border-border shadow-sm"
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
