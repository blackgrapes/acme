// File: components/client/DesktopSidebar.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Home, FileText, AlertTriangle, Folder, Users } from "lucide-react";
import { User } from "lucide-react";

export default function DesktopSidebar({ activeTab, setActiveTab }) {
  const userInfo = {
    name: "John Smith",
    email: "client@example.com",
  };

  return (
    <aside className="w-64 border-r border-border bg-card shadow-sm hidden md:block">
      <nav className="p-4 space-y-1 flex flex-col h-full">
        <div className="space-y-1">
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

         

          <Button
            variant={activeTab === "documents" ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab === "documents"
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("documents")}
          >
            <Folder className="h-4 w-4 mr-2" />
            Documents
          </Button>

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
        </div>

        {/* User Profile - Desktop - Without Sign Out */}
        
      </nav>
    </aside>
  );
}
