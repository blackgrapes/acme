// File: src/components/client/MobileSidebar.jsx
"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileSidebar({ activeTab, setActiveTab, documentCategories }) {
  const [documentDropdownOpen, setDocumentDropdownOpen] = useState(true);

  const toggleDocumentDropdown = () => {
    setDocumentDropdownOpen(!documentDropdownOpen);
  };

  const router = useRouter();

  const userInfo = {
    name: "John Smith",
    email: "client@example.com",
  };

  return (
    <SheetContent
      side="left"
      className="w-64 p-0 bg-card border-r border-border shadow-sm"
    >
      <nav className="p-4 space-y-1 flex flex-col h-full m-2">
        <div className="space-y-1 mb-8">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab === "overview" ? "bg-primary text-white" : "text-white"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <Home className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === "service-reports" ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab === "service-reports"
                ? "bg-primary text-white"
                : "text-white"
            }`}
            onClick={() => setActiveTab("service-reports")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Service Reports
          </Button>

          <div className="space-y-1">
            <Button
              variant={activeTab === "documents" ? "default" : "ghost"}
              className={`w-full justify-start shadow-sm ${
                activeTab === "documents"
                  ? "bg-primary text-white"
                  : "text-white"
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
                            : "bg-primary text-white"
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

          <Button
            variant={activeTab === "management" ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab === "management"
                ? "bg-primary text-white"
                : "text-white"
            }`}
            onClick={() => setActiveTab("management")}
          >
            <Users className="h-4 w-4 mr-2" />
            Management
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
  );
}