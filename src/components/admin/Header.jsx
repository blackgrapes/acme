// File: src/components/admin/Header.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Settings, Shield, User, Bell } from "lucide-react";
import { SettingsDialog } from "@/components/SettingsDialog";
import MobileMenu from "./MobileMenu";
import AdminProfileDialog from "./AdminProfileDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function Header({
  activeTab,
  setActiveTab,
  settingsOpen,
  setSettingsOpen,
  openAdminDialog,
  setOpenAdminDialog,
  documentCategories,
  frontendCategories,
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
                frontendCategories={frontendCategories}
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
            {/* Notifications */}
            

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
                <AvatarImage src="/profile-avatar.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  SJ
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-left">
                <p className="text-sm font-medium text-foreground truncate max-w-32">
                  Sarah Johnson
                </p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            <AdminProfileDialog
              open={openAdminDialog}
              onOpenChange={setOpenAdminDialog}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
