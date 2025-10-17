// Updated File: src/components/client/DesktopSidebar.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  Folder,
  Users,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function DesktopSidebar({
  activeTab,
  setActiveTab,
  documentCategories,
}) {
  const [documentDropdownOpen, setDocumentDropdownOpen] = useState(true);
  const { hasPermission } = useAuth(); // Client has limited perms, e.g., 'client-dashboard-read'
  const router = useRouter();

  const toggleDocumentDropdown = () => {
    setDocumentDropdownOpen(!documentDropdownOpen);
  };

const handleLogout = async () => {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("authToken"); // Also clear fallback
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

  // For client, assume basic access; customize if needed
  const canViewOverview = hasPermission("client-dashboard-read");
  const canViewServiceReports = hasPermission("client-dashboard-read"); // Same perm for simplicity
  const canViewDocuments = hasPermission("client-dashboard-read");
  const canViewManagement = hasPermission("client-dashboard-read");

  return (
    <aside className="w-64 border-r border-border bg-card shadow-sm hidden md:block">
      <nav className="p-4 space-y-1 flex flex-col h-full">
        <div className="space-y-1">
          {canViewOverview && (
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className={`w-full justify-start shadow-sm ${
                activeTab === "overview"
                  ? "bg-primary text-white"
                  : "text-primary-foreground"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <Home className="h-4 w-4 mr-2" />
              Overview
            </Button>
          )}

          {canViewServiceReports && (
            <Button
              variant={activeTab === "service-reports" ? "default" : "ghost"}
              className={`w-full justify-start shadow-sm ${
                activeTab === "service-reports"
                  ? "bg-primary text-white"
                  : "text-primary-foreground"
              }`}
              onClick={() => setActiveTab("service-reports")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Service Reports
            </Button>
          )}

          {canViewDocuments && (
            <div className="space-y-1">
              <Button
                variant={activeTab === "documents" ? "default" : "ghost"}
                className={`w-full justify-start shadow-sm ${
                  activeTab === "documents"
                    ? "bg-primary text-white"
                    : "text-primary-foreground"
                }`}
                onClick={() => {
                  setActiveTab("documents");
                  toggleDocumentDropdown();
                }}
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
                  {documentCategories.map((category) =>
                    category.children ? (
                      category.children.map((child, index) => (
                        <Button
                          key={`${category.id}-${index}`}
                          variant={
                            activeTab ===
                            `documents-${child
                              .replace(/\s+/g, "-")
                              .toLowerCase()}`
                              ? "default"
                              : "ghost"
                          }
                          className={`w-full justify-start text-sm shadow-sm ${
                            activeTab ===
                            `documents-${child
                              .replace(/\s+/g, "-")
                              .toLowerCase()}`
                              ? "bg-primary text-white"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          onClick={() =>
                            setActiveTab(
                              `documents-${child
                                .replace(/\s+/g, "-")
                                .toLowerCase()}`
                            )
                          }
                        >
                          {child}
                        </Button>
                      ))
                    ) : (
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
                        onClick={() => setActiveTab(`documents-${category.id}`)}
                      >
                        {category.name}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {canViewManagement && (
            <Button
              variant={activeTab === "management" ? "default" : "ghost"}
              className={`w-full justify-start shadow-sm ${
                activeTab === "management"
                  ? "bg-primary text-white"
                  : "text-primary-foreground"
              }`}
              onClick={() => setActiveTab("management")}
            >
              <Users className="h-4 w-4 mr-2" />
              Management
            </Button>
          )}
        </div>

        <div className="mt-auto space-y-1 pt-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start shadow-sm text-white bg-primary"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>
    </aside>
  );
}
