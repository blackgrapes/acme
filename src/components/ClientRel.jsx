"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ClientRel({ children }) {
  const pathname = usePathname();

  // Check if current route is a dashboard (including sub-routes)
  const isDashboard =
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/client-dashboard");

  return (
    <>
      {!isDashboard && <Header />}
      <main className="min-h-screen flex flex-col bg-background">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}
