// File: src/components/admin/Header.jsx - CORRECTED
"use client";

import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Settings, Shield, User } from "lucide-react";
import { SettingsDialog } from "@/components/SettingsDialog";
import MobileMenu from "./MobileMenu";
import AdminProfileDialog from "./AdminProfileDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Header({
  activeTab,
  setActiveTab,
  settingsOpen,
  setSettingsOpen,
  openAdminDialog,
  setOpenAdminDialog,
  documentCategories = [],
  companyDocumentCategories = [], // YEH ADD KAREN
}) {
  const { user } = useAuth();

  const getUserInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b border-border/20 bg-card/80 backdrop-blur-sm shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet>
              <MobileMenu
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                documentCategories={documentCategories}
                companyDocumentCategories={companyDocumentCategories} // YEH ADD KAREN
              />
            </Sheet>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground hidden sm:block">
                Elite Security Admin
              </h1>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2">
            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="h-9 w-9 rounded-full hover:bg-muted/50"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <SettingsDialog
              open={settingsOpen}
              onOpenChange={setSettingsOpen}
            />

            {/* Profile */}
            <div
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => setOpenAdminDialog(true)}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials(user?.name || "Admin User")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-left">
                <p className="text-sm font-medium text-foreground truncate max-w-32">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role || "Administrator"}
                </p>
              </div>
            </div>
            <AdminProfileDialog
              open={openAdminDialog}
              onOpenChange={setOpenAdminDialog}
              user={user}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
