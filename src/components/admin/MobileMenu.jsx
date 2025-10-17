// Updated File: src/components/admin/MobileMenu.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Shield,
  Users,
  FileText,
  UserPlus,
  Mail,
  Settings,
  Menu,
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  Separator,
  Users2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function MobileMenu({
  activeTab,
  setActiveTab,
  documentCategories = [],
}) {
  const [documentDropdownOpen, setDocumentDropdownOpen] = useState(false);
  const { hasPermission } = useAuth(); // Get permissions
  const router = useRouter();

  const toggleDocumentDropdown = () => {
    setDocumentDropdownOpen(!documentDropdownOpen);
  };

  const isActive = (tab) => activeTab === tab;

  const handleDocumentClick = () => {
    setActiveTab("documents-all");
    toggleDocumentDropdown();
  };

 const handleLogout = async () => {
   try {
     await fetch("/api/auth/logout", {
       method: "POST",
       credentials: "include",
     });
     localStorage.removeItem("authToken"); // Also clear fallback
     router.push("/login");
   } catch (error) {
     console.error("Logout error:", error);
   }
 };

  // Permission checks
  const canViewDashboard = hasPermission("dashboard-read");
  const canManageClients = hasPermission("clients-read");
  const canManageDocuments = hasPermission("documents-read");
  const canManageRequests = hasPermission("requests-read");
  const canManageGuards = hasPermission("guards-read");
  const canManageRoles = hasPermission("roles-read");
  const canManageContact = hasPermission("contact-read");
  const canManageSettings = hasPermission("settings-read");

  return (
    <>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-64 p-0 bg-primary border-r border-border shadow-sm"
      >
        <nav className="p-4 space-y-1 flex flex-col h-full overflow-y-auto">
          <div className="space-y-1 mb-8">
            {canViewDashboard && (
              <Button
                variant={isActive("dashboard") ? "default" : "ghost"}
                className="w-full justify-start shadow-sm text-primary-foreground data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
                onClick={() => setActiveTab("dashboard")}
              >
                <Shield className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            )}

            {canManageClients && (
              <Button
                variant={isActive("clients") ? "default" : "ghost"}
                className="w-full justify-start shadow-sm text-primary-foreground data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
                onClick={() => setActiveTab("clients")}
              >
                <Users className="h-4 w-4 mr-2" />
                Client Management
              </Button>
            )}

            {/* Documents Dropdown */}
            {canManageDocuments && (
              <div className="space-y-1">
                <Button
                  variant={
                    activeTab.startsWith("documents") ? "default" : "ghost"
                  }
                  className="w-full justify-start shadow-sm text-primary-foreground data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
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
                          const isActive =
                            activeTab === `documents-${childSlug}`;
                          return (
                            <Button
                              key={`${category.id}-${index}`}
                              variant={isActive ? "default" : "ghost"}
                              className="w-full justify-start text-sm shadow-sm text-primary-foreground data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
                              onClick={() =>
                                setActiveTab(`documents-${childSlug}`)
                              }
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
                          className="w-full justify-start text-sm shadow-sm text-primary-foreground data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
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
                    {hasPermission("documents-create") && (
                      <Button
                        variant={
                          activeTab === "documents-add-tab"
                            ? "default"
                            : "ghost"
                        }
                        className="w-full justify-start text-sm shadow-sm text-primary-foreground data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
                        onClick={() => setActiveTab("documents-add-tab")}
                      >
                        <Plus className="h-3 w-3 mr-2" />
                        Add New Tab
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {canManageRequests && (
              <Button
                variant={isActive("requests") ? "default" : "ghost"}
                className="w-full justify-start shadow-sm text-primary-foreground data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
                onClick={() => setActiveTab("requests")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Request Reports
              </Button>
            )}

            {canManageGuards && (
              <Button
                variant={isActive("guards") ? "default" : "ghost"}
                className="w-full justify-start shadow-sm text-primary-foreground data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
                onClick={() => setActiveTab("guards")}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Guards
              </Button>
            )}

            {canManageRoles && (
              <Button
                variant={isActive("roles") ? "default" : "ghost"}
                className="w-full justify-start shadow-sm text-primary-foreground data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
                onClick={() => setActiveTab("roles")}
              >
                <Users2 className="h-4 w-4 mr-2" />
                Roles & Users
              </Button>
            )}

            {canManageContact && (
              <Button
                variant={isActive("contact") ? "default" : "ghost"}
                className="w-full justify-start shadow-sm text-primary-foreground data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
                onClick={() => setActiveTab("contact")}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
            )}

            {canManageSettings && (
              <Button
                variant={isActive("settings") ? "default" : "ghost"}
                className="w-full justify-start shadow-sm text-primary-foreground data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            )}
          </div>

          <div className="mt-auto space-y-1 pt-4 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full justify-start shadow-sm text-primary-foreground hover:bg-primary/10 data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </nav>
      </SheetContent>
    </>
  );
}
