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

export function Footer() {
  const [time, setTime] = useState("");

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
    <footer className="border-border border-t bg-background">
      <div className="container py-8 sm:py-12 lg:py-14 px-4 mx-auto grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            ACME Protection Services Pvt. Ltd.
          </h3>
          <p className="text-sm text-secondary">
            Leading security solutions provider with 10+ years of trusted
            service across India.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-secondary">
            <BadgeCheck className="h-4 w-4 text-primary" /> MSME
            <BadgeCheck className="h-4 w-4 text-primary" /> GST
            <BadgeCheck className="h-4 w-4 text-primary" /> PASARA
          </div>
          {/* Live Clock */}
          <div className="text-sm font-medium flex items-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            {time || "Loading..."}
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
            <li>
              <Link
                href="/whychooseus"
                className="flex items-center gap-2 text-secondary hover:text-foreground transition-colors"
              >
                <FileText className="h-4 w-4 text-primary" /> Why Choose Us
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
              <MapPin className="h-4 w-4 text-primary" /> Office address line,
              City, State, PIN
            </p>
            <p className="text-sm flex items-center gap-2 text-secondary">
              <Phone className="h-4 w-4 text-primary" /> +91-XXXXXXXXXX
            </p>
            <p className="text-sm flex items-center gap-2 text-secondary">
              <Mail className="h-4 w-4 text-primary" />{" "}
              contact@acme-security.example
            </p>
          </div>

          <div className="flex gap-4">
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
          </div>

          <div className="text-xs text-secondary flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> We respect your privacy.
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-border border-t">
        <div className="container px-4 mx-auto py-4 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary">
          <p>
            © {new Date().getFullYear()} ACME Protection Services Pvt. Ltd. All
            rights reserved.
          </p>
          <p>Empowering businesses with trusted security solutions.</p>
        </div>
      </div>
    </footer>
  );
}
