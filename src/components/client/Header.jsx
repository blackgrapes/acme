// File: src/components/client/Header.jsx - UPDATED
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Mail, FileText, Settings, Menu, User } from "lucide-react";
import UnifiedSidebar from "./UnifiedSidebar";
import ClientProfileDialog from "./ClientProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import RequestDocumentDialog from "./RequestDocumentDialog";
import ContactSupportDialog from "./ContactSupportDialog";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function Header({
  activeTab,
  setActiveTab,
  settingsOpen,
  setSettingsOpen,
  openClientDialog,
  setOpenClientDialog,
  documentCategories = [],
  companyDocumentCategories = [],
}) {
  const [openMobile, setOpenMobile] = useState(false);
  const [openRequestDoc, setOpenRequestDoc] = useState(false);
  const [openContact, setOpenContact] = useState(false);
  const { user } = useAuth();

  const getUserInitials = (name) => {
    if (!name) return "CL";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b border-border/20 bg-card/95 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">

          {/* Left Section - Extreme Left */}
          <div className="flex items-center gap-6 flex-1 justify-start">
            {/* Mobile Menu */}
            <Sheet open={openMobile} onOpenChange={setOpenMobile}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden cursor-pointer h-10 w-10"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <UnifiedSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                documentCategories={documentCategories}
                companyDocumentCategories={companyDocumentCategories}
                isMobile={true}
                onNavigate={() => setOpenMobile(false)}
              />
            </Sheet>

            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                <span className="text-primary font-bold text-lg">AS</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <h1 className="text-lg font-bold text-foreground leading-tight">
                  Client Portal
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  Secure Document Access
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Extreme Right */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* Support Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenContact(true)}
              className="hidden lg:flex cursor-pointer items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">Support</span>
            </Button>

            {/* Request Document Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenRequestDoc(true)}
              className="hidden lg:flex cursor-pointer items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Request Doc</span>
            </Button>

            {/* Settings Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="h-10 w-10 cursor-pointer rounded-full hover:bg-muted/50"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Profile */}
            <div
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border/20"
              onClick={() => setOpenClientDialog(true)}
            >
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold">
                  {getUserInitials(user?.name || "Client User")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden xl:flex flex-col items-start text-left">
                <p className="text-sm font-semibold text-foreground">
                  {user?.name || "Client User"}
                </p>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground font-medium">
                    {user?.role || "Client"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ClientProfileDialog
        open={openClientDialog}
        onOpenChange={setOpenClientDialog}
        user={user}
      />
      <RequestDocumentDialog
        open={openRequestDoc}
        onOpenChange={setOpenRequestDoc}
      />
      <ContactSupportDialog open={openContact} onOpenChange={setOpenContact} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
}