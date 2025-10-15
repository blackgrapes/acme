// Updated File: src/components/admin/MobileMenu.jsx
"use client";

import { useState } from "react";
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

export default function MobileMenu({
  activeTab,
  setActiveTab,
  documentCategories = [],
}) {
  const [documentDropdownOpen, setDocumentDropdownOpen] = useState(false);

  const toggleDocumentDropdown = () => {
    setDocumentDropdownOpen(!documentDropdownOpen);
  };

  const isActive = (tab) => activeTab === tab;

  const handleDocumentClick = () => {
    setActiveTab("documents-all");
    toggleDocumentDropdown();
  };

  return (
    <>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-64 p-0 bg-card border-r border-border shadow-sm"
      >
        <nav className="p-4 space-y-1 flex flex-col h-full">
          <div className="space-y-1 mb-8">
            <Button
              variant={isActive("dashboard") ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("dashboard")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Dashboard
            </Button>

            <Button
              variant={isActive("clients") ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("clients")}
            >
              <Users className="h-4 w-4 mr-2" />
              Client Management
            </Button>

            {/* Documents Dropdown */}
            <div className="space-y-1">
              <Button
                variant={
                  activeTab.startsWith("documents") ? "default" : "ghost"
                }
                className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
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
                            className="w-full justify-start text-sm shadow-sm text-white data-[variant=default]:bg-primary"
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
                        className="w-full justify-start text-sm shadow-sm text-white data-[variant=default]:bg-primary"
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
                    className="w-full justify-start text-sm shadow-sm text-white data-[variant=default]:bg-primary"
                    onClick={() => setActiveTab("documents-add-tab")}
                  >
                    + Add New Tab
                  </Button>
                </div>
              </div>
            </div>

            <Button
              variant={isActive("requests") ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("requests")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Request Reports
            </Button>

            <Button
              variant={isActive("guards") ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("guards")}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Guards
            </Button>

            <Button
              variant={isActive("roles") ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("roles")}
            >
              <Users2 className="h-4 w-4 mr-2" />
              Roles & Users
            </Button>

            <Button
              variant={isActive("contact") ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("contact")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>

            <Button
              variant={isActive("settings") ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
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
      </SheetContent>
    </>
  );
}
