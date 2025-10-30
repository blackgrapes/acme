// File: src/app/admin-dashboard/settings/page.jsx
"use client";

import { useState } from "react";
import SettingsManagement from "@/components/admin/SettingsManagement";

export default function SettingsPage() {
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: 30,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
  });
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: 587,
  });
  const [frontendCategories, setFrontendCategories] = useState([
    { id: "services", name: "Services" },
    { id: "gallery", name: "Gallery" },
    { id: "clients", name: "Clients" },
    { id: "testimonials", name: "Testimonials" },
  ]);

  return (
    <SettingsManagement
      companyInfo={companyInfo}
      securitySettings={securitySettings}
      notificationSettings={notificationSettings}
      emailSettings={emailSettings}
      frontendCategories={frontendCategories}
    />
  );
}
