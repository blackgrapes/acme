// File: src/app/admin-dashboard/contact/page.jsx
"use client";

import { useState } from "react";
import ContactManagement from "@/components/admin/ContactManagement";

export default function ContactPage() {
  const [contactTab, setContactTab] = useState("inquiries");

  return (
    <ContactManagement contactTab={contactTab} setContactTab={setContactTab} />
  );
}
