// File: src/app/admin-dashboard/settings/page.jsx
"use client";

import { useState } from "react";
import FrontendManagement from "@/components/admin/FrontendManagement";

export default function SettingsPage() {
  
  const [frontendCategories, setFrontendCategories] = useState([
    { id: "services", name: "Services" },
    { id: "gallery", name: "Gallery" },
    { id: "clients", name: "Clients" },
    { id: "testimonials", name: "Testimonials" },
  ]);

  return (
    <FrontendManagement
      settings={frontendCategories}
    />
  );
}
