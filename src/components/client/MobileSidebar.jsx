// File: components/client/MobileSidebar.jsx
"use client";

import { Button } from "@/components/ui/button";
import { SheetContent } from "@/components/ui/sheet";
import {
  Home,
  FileText,
  AlertTriangle,
  Folder,
  Users,
  User,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileSidebar({ activeTab, setActiveTab }) {
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
         
          <Button
            variant={activeTab === "documents" ? "default" : "ghost"}
            className={`w-full justify-start shadow-sm ${
              activeTab === "documents" ? "bg-primary text-white" : "text-white"
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
                : "text-white"
            }`}
            onClick={() => setActiveTab("management")}
          >
            <Users className="h-4 w-4 mr-2" />
            Management
          </Button>
        </div>
       
      </nav>
    </SheetContent>
  );
}
