// File: src/components/client/Header.jsx - MOBILE OPTIMIZED
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Mail, FileText, Settings, Menu, User, Download, Palette, MessageSquare, HelpCircle } from "lucide-react";
import UnifiedSidebar from "./UnifiedSidebar";
import ClientProfileDialog from "./ClientProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import ContactSupportDialog from "./ContactSupportDialog";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import DocumentRequestModal from "./DocumentRequestModal";

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
 
  const [openContact, setOpenContact] = useState(false);
  const { user } = useAuth();
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const getUserInitials = (name) => {
    if (!name) return "CL";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ✅ UPDATED: PDF Download handler
  const handleDownloadManual = () => {
    try {
      console.log("📥 Downloading Client Guide PDF...");
      
      // Create a link element
      const link = document.createElement('a');
      
      // Set the PDF file path (public folder se)
      const pdfPath = '/Acme_Client_Portal_Manual.pdf';
      
      // Set link properties
      link.href = pdfPath;
      link.download = 'Client_Portal_User_Guide.pdf'; // Downloaded file name
      link.target = '_blank';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Optional: Show success message
      console.log("✅ PDF download initiated");
      
      // Optional: You can add toast notification here
      // toast({
      //   title: "Download Started",
      //   description: "Client Guide PDF is downloading...",
      // });
      
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);
      
      // Fallback: Open in new tab if download fails
      window.open('/client_guide.pdf', '_blank');
    }
  };

  return (
    <header className="border-b border-border/20 bg-card/95 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">

          {/* Left Section - Extreme Left */}
          <div className="flex items-center gap-4 flex-1 justify-start">
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

            {/* Logo & Brand - Mobile Optimized */}
            <div className="flex items-center">
              <div className="relative">
                <Image
                  src="/acme_logo.png"
                  alt="ACME Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <h1 className="text-lg font-bold text-foreground leading-tight">
                  Client Portal
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  Secure Document Access
                </p>
              </div>
              <div className="sm:hidden flex flex-col">
                <h1 className="text-base font-bold text-foreground">
                  Portal
                </h1>
                <p className="text-[10px] text-muted-foreground">
                  Documents
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Extreme Right with Mobile Optimizations */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
            
            {/* MOBILE: Only Icons without text */}
            <div className="flex items-center gap-1 sm:hidden">

              {/* Document Request Icon for Mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenRequestDoc(true)}
                className="h-9 w-9 cursor-pointer rounded-full"
                title="Request Document"
              >
                <FileText className="h-4 w-4" />
              </Button>

              {/* User Guide Icon for Mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownloadManual}
                className="h-9 w-9 cursor-pointer rounded-full"
                title="User Guide"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>

            {/* DESKTOP: Full buttons with text */}
            <div className="hidden sm:flex items-center gap-3">
              {/* User Guide Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadManual}
                className="cursor-pointer items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">User Guide</span>
              </Button>

              {/* Document Request Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRequestModalOpen(true)}
                className="cursor-pointer items-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Document</span>
              </Button>
            </div>

            {/* Theme Settings Icon - For both mobile and desktop */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="h-9 w-9 sm:h-10 sm:w-10 cursor-pointer rounded-full hover:bg-muted/50"
              title="Theme Settings"
            >
              <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Profile Section */}
            <div
              className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/20 group"
              // onClick={() => setOpenClientDialog(true)}
            >
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-background group-hover:border-primary/20 transition-colors">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs sm:text-sm font-bold">
                  {getUserInitials(user?.name || "Client User")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start text-left">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {user?.name || "Client User"}
                </p>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-muted-foreground group-hover:text-primary/70 transition-colors" />
                  <p className="text-xs text-muted-foreground font-medium group-hover:text-primary/70 transition-colors">
                    {user?.role || "Client"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen} 
      />

      {/* Other Dialogs */}
      {/* <ClientProfileDialog
        open={openClientDialog}
        onOpenChange={setOpenClientDialog}
        user={user}
      /> */}
      <DocumentRequestModal
        open={requestModalOpen}
        onOpenChange={setRequestModalOpen}
        clientId={user?._id}
        clientName={user?.name}
        clientEmail={user?.email}
        clientCompany={user?.companyName}
      />
      <ContactSupportDialog open={openContact} onOpenChange={setOpenContact} />
    </header>
  );
}