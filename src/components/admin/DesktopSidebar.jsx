// File: src/component/admin/DesktopSidebar.jsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  FileText,
  UserPlus,
  Palette,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";

export default function DesktopSidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 border-r border-border bg-card shadow-sm hidden md:block">
      <nav className="p-4 space-y-1 flex flex-col h-full">
        <div className="space-y-1">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab === "dashboard"
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Shield className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "clients" ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab === "clients"
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("clients")}
          >
            <Users className="h-4 w-4 mr-2" />
            Client Management
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
            <FileText className="h-4 w-4 mr-2" />
            Document Management
          </Button>
          <Button
            variant={activeTab === "requests" ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab === "requests"
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Request Reports
          </Button>
          <Button
            variant={activeTab === "guards" ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab === "guards"
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("guards")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Guards
          </Button>
          <Button
            variant={activeTab === "frontend" ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab === "frontend"
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("frontend")}
          >
            <Palette className="h-4 w-4 mr-2" />
            Frontend
          </Button>
          <Button
            variant={activeTab === "contact" ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab === "contact"
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab === "settings"
                ? "bg-primary text-white"
                : "text-primary-foreground"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
        <div className="mt-auto space-y-1 pt-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start shadow-sm text-white bg-parimary"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>
    </aside>
  );
}
