import {Hero} from "@/components/Hero";
import {ServicesSection} from "@/components/ServicesSection";
import {WhyChooseSection} from "@/components/WhyChooseSection";
import {PresenceSection} from "@/components/PresenceSection";
import {MissionSection} from "@/components/MissionSection";
import {ClientsSection} from "@/components/ClientsSection";
import {CTASection} from "@/components/CTASection";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <MissionSection />
      <WhyChooseSection />
      <ServicesSection />
      <PresenceSection />
      <ClientsSection />
      <CTASection />
    </main>
  );
}
