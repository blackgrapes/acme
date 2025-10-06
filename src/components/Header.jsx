"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Shield, Settings, LogIn } from "lucide-react";
import { useState } from "react";
import { SettingsDialog } from "./SettingsDialog";
import { useTheme } from "@/contexts/ThemeContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "We Provide" },
  { to: "/why-choose-us", label: "Why Choose Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/clients", label: "Clients" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const location = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { palette } = useTheme();

  const isActive = (path) => location === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-primary transition-colors"
          >
            <Shield className="h-6 w-6 text-primary transition-colors" /> ACME
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            {/* Settings Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="text-foreground hover:text-primary transition-colors"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Client Portal Login */}
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full px-5 bg-primary text-white hover:bg-primary/90 transition-colors">
                  <LogIn className="h-4 w-4 mr-1" /> Client Portal Login
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:rounded-2xl text-white">
                <DialogHeader>
                  <DialogTitle>Client Portal Login</DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setLoginOpen(false);
                  }}
                >
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full h-11 rounded-md border px-3 border-border"
                  />
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full h-11 rounded-md border px-3 border-border"
                  />
                  <Button
                    type="submit"
                    className="w-full rounded-full bg-primary hover:bg-primary/90 transition-colors"
                  >
                    Login
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Demo only. Hook up auth later.
                  </p>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
