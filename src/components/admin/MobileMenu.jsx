// File: src/component/admin/MobileMenu.jsx
"use client";

import { Button } from "@/components/ui/button";
import { SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Shield,
  Users,
  FileText,
  UserPlus,
  Palette,
  Mail,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";

export default function MobileMenu({ activeTab, setActiveTab }) {
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
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("dashboard")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "clients" ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("clients")}
            >
              <Users className="h-4 w-4 mr-2" />
              Client Management
            </Button>
            <Button
              variant={activeTab === "documents" ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("documents")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Document Management
            </Button>
            <Button
              variant={activeTab === "requests" ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("requests")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Request Reports
            </Button>
            <Button
              variant={activeTab === "guards" ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("guards")}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Guards
            </Button>
            <Button
              variant={activeTab === "frontend" ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("frontend")}
            >
              <Palette className="h-4 w-4 mr-2" />
              Frontend
            </Button>
            <Button
              variant={activeTab === "contact" ? "default" : "ghost"}
              className="w-full justify-start shadow-sm text-white data-[variant=default]:bg-primary"
              onClick={() => setActiveTab("contact")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
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
