//File: src/components/admin/Header.jsx
// Professional Navbar with Perfect Left-Right Alignment
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Palette, Download, Menu, Shield } from "lucide-react";
import { SettingsDialog } from "@/components/SettingsDialog";
import UnifiedSidebar from "./UnifiedSidebar";
import AdminProfileDialog from "./AdminProfileDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export default function Header({
  activeTab,
  setActiveTab,
  settingsOpen,
  setSettingsOpen,
  openAdminDialog,
  setOpenAdminDialog,
  documentCategories = [],
  companyDocumentCategories = [],
  onDownloadManual,
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
    <header className="border-b border-border/20 bg-card/95 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          
          {/* Left Section - Extreme Left */}
          <div className="flex items-center gap-6 flex-1 justify-start">
            {/* Mobile Menu */}
            <Sheet>
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
              />
            </Sheet>

            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <Image
                src="/acme_logo.png"
                alt="ACME Logo"
                width={42}
                height={42}
                className="object-contain"
                priority
              />
              <div className="hidden sm:flex flex-col">
                <h1 className="text-lg font-bold text-foreground leading-tight">
                  Acme Admin
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  Management Portal
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Extreme Right */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* PDF Download Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownloadManual}
              className="hidden lg:flex cursor-pointer items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm font-medium">User Manual</span>
            </Button>

            {/* Theme Icon */}
<Button
  variant="ghost"
  size="icon"
  onClick={() => setSettingsOpen(true)}
  permission="settings-read"
  className="h-10 w-10 cursor-pointer rounded-full hover:bg-muted/50"
>
  <Palette className="h-5 w-5" />
</Button>

<SettingsDialog
  open={settingsOpen}
  onOpenChange={setSettingsOpen}
/>

{/* Logout Button */}
<Button
  variant="destructive"
  size="sm"
  onClick={() => console.log("Logout clicked")} // logout function yahan
  className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2"
>
  <span className="text-sm font-medium">Logout</span>
</Button>


            {/* Profile */}
            <div
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border/20"
              onClick={() => setOpenAdminDialog(true)}
            >
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold">
                  {getUserInitials(user?.name || "Admin User")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden xl:flex flex-col items-start text-left">
                <p className="text-sm font-semibold text-foreground">
                  {user?.name || "Admin User"}
                </p>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground font-medium">
                    {user?.role || "Administrator"}
                  </p>
                </div>
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