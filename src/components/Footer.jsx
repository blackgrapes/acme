"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Phone,
  Mail,
  MapPin,
  Info,
  Wrench,
  Users,
  FileText,
  MessageCircle,
  Lock,
  Shield,
  Twitter,
  Linkedin,
  Youtube,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { SettingsDialog } from "./SettingsDialog";
import { useTheme } from "@/contexts/ThemeContext";
import { Palette } from "lucide-react";

export function Footer() {
  const [time, setTime] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { palette } = useTheme();
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // India time in IST
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      };
      setTime(new Intl.DateTimeFormat("en-IN", options).format(now));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-border bg-background">
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                ACME Protection Services Pvt. Ltd.
              </h3>
              <p className="text-sm text-secondary">
                Leading security solutions provider with 37+ years of trusted
                service across India.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-secondary">
                <BadgeCheck className="h-4 w-4 text-primary"/>MSME
                <BadgeCheck className="h-4 w-4 text-primary"/>GST
                <BadgeCheck className="h-4 w-4 text-primary"/>PASARA
                <BadgeCheck className="h-4 w-4 text-primary"/>ISO
              </div>
              {/* Live Clock */}
              <div className="text-sm font-medium flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5" />
                {time || "Loading..."}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSettingsOpen(true)}
                  className="flex items-center cursor-pointer gap-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
                >
                  <Palette className="h-4 w-4" />
                  <span className="text-sm">Theme</span>
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-foreground">
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="flex items-center gap-2 text-secondary hover:text-foreground transition-colors"
                  >
                    <Info className="h-4 w-4 text-primary" /> About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="flex items-center gap-2 text-secondary hover:text-foreground transition-colors"
                  >
                    <Wrench className="h-4 w-4 text-primary" /> We Provide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clients"
                    className="flex items-center gap-2 text-secondary hover:text-foreground transition-colors"
                  >
                    <Users className="h-4 w-4 text-primary" /> Clients
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources / Legal */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-foreground">
                Resources
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 text-secondary hover:text-foreground transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-primary" /> Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/why-choose-us"
                    className="flex items-center gap-2 text-secondary hover:text-foreground transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" /> Why Choose Us
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/legal/privacy"
                    className="flex items-center gap-2 text-secondary hover:text-foreground transition-colors"
                  >
                    <Lock className="h-4 w-4 text-primary" /> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="flex items-center gap-2 text-secondary hover:text-foreground transition-colors"
                  >
                    <Lock className="h-4 w-4 text-primary" /> Terms & Conditions
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/admin-dashboard"
                    className="flex items-center gap-2 text-primary hover:text-foreground transition-colors"
                  >
                    <b>Admin</b>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/client-dashboard"
                    className="flex items-center gap-2 text-primary hover:text-foreground transition-colors"
                  >
                    <b>Client</b>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold mb-4 text-foreground">
                Get in Touch
              </h4>
              <div className="space-y-2">
                <p className="text-sm flex items-center gap-2 text-secondary">
                  <MapPin className="h-4 w-4 text-primary" /> 1st Floor Acme
                  House Opposite Central Market Bhiwadi Alwar
                  Bhiwadi-301019 Rajasthan India
                </p>
                <a
                  href="tel:+919314554244"
                  className="text-sm flex items-center gap-2 text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  <Phone className="h-4 w-4 text-primary" /> +91 9314554244
                </a>
                <a
                  href="mailto:protection.acme@gmail.com"
                  className="text-sm flex items-center gap-2 text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  <Mail className="h-4 w-4 text-primary" />{" "}
                  protection.acme@gmail.com
                </a>
              </div>

              {/* <div className="flex gap-4">
                <a
                  href="#"
                  aria-label="Twitter"
                  className="text-primary hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="text-primary hover:text-primary transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="text-primary hover:text-primary transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div> */}

              {/* <div className="text-xs text-secondary flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> We respect your
                privacy.
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <div className="border-t border-border">
  <div className="container mx-auto px-4 py-4 sm:py-6">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary">
      <p>
        © {new Date().getFullYear()} ACME Protection Services Pvt. Ltd.
        All rights reserved.
      </p>
      <div className="flex flex-col items-center md:items-end gap-1">
        <p>Empowering businesses with trusted security solutions.</p>
        <p>
          Developed by{" "}
          <a 
            href="https://blackgrapessoftech.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline transition-colors"
          >
            Black Grapes Softech
          </a>
        </p>
      </div>
    </div>
  </div>
</div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </footer>
  );
}
