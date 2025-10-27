// Updated File: src/components/client/MobileSidebar.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function MobileSidebar({
  activeTab,
  setActiveTab,
  documentCategories = [],
  companyDocumentCategories = [], // DEFAULT VALUE ADD KAREN
}) {
  const [documentDropdownOpen, setDocumentDropdownOpen] = useState(true);
  const [companyDocumentDropdownOpen, setCompanyDocumentDropdownOpen] =
    useState(true);
  const { hasPermission } = useAuth();
  const router = useRouter();

  const toggleDocumentDropdown = () => {
    setDocumentDropdownOpen(!documentDropdownOpen);
  };

  const toggleCompanyDocumentDropdown = () => {
    setCompanyDocumentDropdownOpen(!companyDocumentDropdownOpen);
  };

  const isActive = (tab) => activeTab === tab;

  const handleDocumentClick = () => {
    setActiveTab("documents");
    toggleDocumentDropdown();
  };

  const handleCompanyDocumentClick = () => {
    setActiveTab("company-documents");
    toggleCompanyDocumentDropdown();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("authToken");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // For client, assume basic access
  const canViewOverview = hasPermission("client-dashboard-read");
  const canViewServiceReports = hasPermission("client-dashboard-read");
  const canViewDocuments = hasPermission("client-dashboard-read");
  const canViewCompanyDocuments = hasPermission("client-dashboard-read");
  const canViewManagement = hasPermission("client-dashboard-read");

  return (
    <SheetContent
      side="left"
      className="w-64 p-0 bg-white border-r border-border shadow-sm"
    >
      <nav className="p-4 space-y-1 flex flex-col h-full overflow-y-auto">
        <div className="space-y-1 mb-8">
          {canViewOverview && (
            <Button
              variant={isActive("overview") ? "default" : "ghost"}
              className="w-full justify-start shadow-sm data-[variant=default]:bg-primary data-[variant=default]:text-white"
              onClick={() => setActiveTab("overview")}
            >
              <Home className="h-4 w-4 mr-2" />
              Overview
            </Button>
          )}
          {canViewServiceReports && (
            <Button
              variant={isActive("service-reports") ? "default" : "ghost"}
              className="w-full justify-start shadow-sm data-[variant=default]:bg-primary data-[variant=default]:text-white"
              onClick={() => setActiveTab("service-reports")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Service Reports
            </Button>
          )}

          {/* Documents Dropdown */}
          {canViewDocuments && (
            <div className="space-y-1">
              <Button
                variant={
                  activeTab.startsWith("documents") ? "default" : "ghost"
                }
                className="w-full justify-start shadow-sm data-[variant=default]:bg-primary data-[variant=default]:text-white"
                onClick={handleDocumentClick}
              >
                <Folder className="h-4 w-4 mr-2" />
                Documents
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
                  <Button
                    variant={activeTab === "documents" ? "default" : "ghost"}
                    className="w-full justify-start text-sm shadow-sm data-[variant=default]:bg-primary data-[variant=default]:text-white"
                    onClick={() => setActiveTab("documents")}
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
                      className="w-full justify-start text-sm shadow-sm data-[variant=default]:bg-primary data-[variant=default]:text-white"
                      onClick={() => setActiveTab(`documents-${category.id}`)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Company Documents Dropdown */}
          {canViewCompanyDocuments && (
            <div className="space-y-1">
              <Button
                variant={
                  activeTab.startsWith("company-documents")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start shadow-sm data-[variant=default]:bg-primary data-[variant=default]:text-white"
                onClick={handleCompanyDocumentClick}
              >
                <Building className="h-4 w-4 mr-2" />
                Company Documents
                {companyDocumentDropdownOpen ? (
                  <ChevronDown className="h-4 w-4 ml-auto transition-transform duration-200" />
                ) : (
                  <ChevronRight className="h-4 w-4 ml-auto transition-transform duration-200" />
                )}
              </Button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  companyDocumentDropdownOpen
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="pl-6 space-y-1 pt-1">
                  <Button
                    variant={
                      activeTab === "company-documents" ? "default" : "ghost"
                    }
                    className="w-full justify-start text-sm shadow-sm data-[variant=default]:bg-primary data-[variant=default]:text-white"
                    onClick={() => setActiveTab("company-documents")}
                  >
                    All Company Documents
                  </Button>

                  {companyDocumentCategories &&
                    companyDocumentCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          activeTab === `company-documents-${category.id}`
                            ? "default"
                            : "ghost"
                        }
                        className="w-full justify-start text-sm shadow-sm data-[variant=default]:bg-primary data-[variant=default]:text-white"
                        onClick={() =>
                          setActiveTab(`company-documents-${category.id}`)
                        }
                      >
                        {category.name}
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {canViewManagement && (
            <Button
              variant={isActive("management") ? "default" : "ghost"}
              className="w-full justify-start shadow-sm  data-[variant=default]:bg-primary data-[variant=default]:text-white"
              onClick={() => setActiveTab("management")}
            >
              <Users className="h-4 w-4 mr-2" />
              Management
            </Button>
          )}
        </div>

        <div className="mt-auto space-y-1 pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            className="w-full justify-start shadow-sm text-white bg-primary data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>
    </SheetContent>
  );
}
