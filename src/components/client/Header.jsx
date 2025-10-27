// Updated File: src/components/client/Header.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  Bell,
  Search,
  User,
  Menu,
  FileText,
  Mail,
  Setting,
  Settings,
} from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import ClientProfileDialog from "./ClientProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import RequestDocumentDialog from "./RequestDocumentDialog";
import ContactSupportDialog from "./ContactSupportDialog";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header({
  activeTab,
  setActiveTab,
  documentCategories = [],
  companyDocumentCategories = [], // DEFAULT VALUE ADD KAREN
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMobile, setOpenMobile] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
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
    <header className="border-b border-border/20 bg-card/80 backdrop-blur-sm shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet open={openMobile} onOpenChange={setOpenMobile}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <MobileSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                documentCategories={documentCategories}
                companyDocumentCategories={companyDocumentCategories} // YEH PASS KAREN
              />
            </Sheet>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <span className="text-primary font-bold text-sm">AS</span>
              </div>
              <h1 className="text-xl font-bold text-foreground hidden sm:block">
                Client Panel
              </h1>
            </div>
          </div>

          {/* Center - Search */}

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenContact(true)}
              className="text-foreground hover:text-primary transition-colors hidden sm:flex"
            >
              <Mail className="h-4 w-4 mr-1 text-primary" />
              <span>Support</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenRequestDoc(true)}
              className="text-foreground hover:text-primary transition-colors hidden sm:flex"
            >
              <FileText className="h-4 w-4 mr-1 text-primary" />
              <span>Request Doc</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="text-foreground hover:text-primary transition-colors"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Profile Section */}
            <div
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => setOpenProfile(true)}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials(user?.name || "Client User")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-left">
                <p className="text-sm font-medium text-foreground truncate max-w-32">
                  {user?.name || "Client User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role || "Client"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ClientProfileDialog
        open={openProfile}
        onOpenChange={setOpenProfile}
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
