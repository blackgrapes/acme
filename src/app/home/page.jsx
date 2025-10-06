"use client";

import { Hero } from "@/components/Hero";
import { MissionSection } from "@/components/MissionSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { ServicesSection } from "@/components/ServicesSection";
import { PresenceSection } from "@/components/PresenceSection";
import { ClientsSection } from "@/components/ClientsSection";
import { CTASection } from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <MissionSection />
      <WhyChooseSection />
      <ServicesSection />
      <PresenceSection />
      <ClientsSection />
      <CTASection />
    </>
  );
}
