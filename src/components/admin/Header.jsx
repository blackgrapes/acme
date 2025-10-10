// File: src/component/admin/Header.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Settings, Shield, User } from "lucide-react";
import { SettingsDialog } from "@/components/SettingsDialog"; // Assuming this is external
import MobileMenu from "./MobileMenu";
import { useState } from "react";

export default function Header({
  activeTab,
  setActiveTab,
  settingsOpen,
  setSettingsOpen,
  openAdminDialog,
  setOpenAdminDialog,
}) {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <MobileMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            </Sheet>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="text-primary hover:text-primary transition-colors"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <SettingsDialog
              open={settingsOpen}
              onOpenChange={setSettingsOpen}
            />
            <div
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
              onClick={() => setOpenAdminDialog(true)}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1 hidden md:block">
                <p className="font-medium text-foreground truncate">
                  Sarah Johnson
                </p>
                <p className="text-xs text-secondary">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
