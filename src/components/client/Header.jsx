// File: src/component/client/Header.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  LogOut,
  Settings,
  Shield,
  User,
  Menu,
  FileText,
  Mail,
} from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import ClientProfileDialog from "./ClientProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import RequestDocumentDialog from "./RequestDocumentDialog";
import ContactSupportDialog from "./ContactSupportDialog";
import { useState } from "react";

export default function Header({ activeTab, setActiveTab }) {
  const [openMobile, setOpenMobile] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openRequestDoc, setOpenRequestDoc] = useState(false);
  const [openContact, setOpenContact] = useState(false);

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet open={openMobile} onOpenChange={setOpenMobile}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <MobileSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </Sheet>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">
                Client Panel
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenContact(true)}
              className="text-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4 mr-1 text-primary" />
              <span className="hidden md:inline">Support</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenRequestDoc(true)}
              className="text-foreground hover:text-primary transition-colors"
            >
              <FileText className="h-4 w-4 mr-1 text-primary" />
              <span className="hidden md:inline">Request Doc</span>
            </Button>
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
              onClick={() => setOpenProfile(true)}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1 hidden md:block">
                <p className="font-medium text-foreground truncate">
                  John Smith
                </p>
                <p className="text-xs text-secondary">Client</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ClientProfileDialog open={openProfile} onOpenChange={setOpenProfile} />
      <RequestDocumentDialog
        open={openRequestDoc}
        onOpenChange={setOpenRequestDoc}
      />
      <ContactSupportDialog open={openContact} onOpenChange={setOpenContact} />
    </header>
  );
}
