import {Hero} from "@/components/Hero";
import {ServicesSection} from "@/components/ServicesSection";
import {WhyChooseSection} from "@/components/WhyChooseSection";
import {PresenceSection} from "@/components/PresenceSection";
import {MissionSection} from "@/components/MissionSection";
import {ClientsSection} from "@/components/ClientsSection";
import {CTASection} from "@/components/CTASection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <Header />
      <Hero />
      <MissionSection />
      <WhyChooseSection />
      <ServicesSection />
      <PresenceSection />
      <ClientsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
