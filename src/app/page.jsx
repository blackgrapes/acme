"use client";

import { useEffect, useState } from "react";
import SEOHead from "@/components/site/SEOHead";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "./../components/Hero";
import IntroSection from "./../components/MissionSection";
import WhyChooseUsSection from "./../components/WhyChooseSection";
import ServicesSection from "./../components/ServicesSection";
import PresenceSection from "./../components/PresenceSection";
import ClientsSection from "./../components/ClientsSection";
import CTASection from "./../components/CTASection";
import VideoModal from "./../components/VideoModal";

const headings = [
  "ACME Protection Services Pvt. Ltd.",
  "Your Trusted Security Partner",
  "Safeguarding What Matters Most",
];

const paragraphs = [
  "Safeguarding businesses, people, and events with unmatched vigilance and professionalism.",
  "Delivering peace of mind through reliable, certified, and well-trained guards.",
  "Protecting organizations and communities with modern security solutions.",
];

export default function HomePage() {
  const [typedTitle, setTypedTitle] = useState("");
  const [headIndex, setHeadIndex] = useState(0);
  const [paraIndex, setParaIndex] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(true);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Typing effect for headings
  useEffect(() => {
    let i = 0;
    const fullText = headings[headIndex];
    setTypedTitle(""); // reset before typing new
    const typing = setInterval(() => {
      setTypedTitle(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(typing);
    }, 80);

    // auto switch text every 4s
    const switchText = setTimeout(() => {
      setHeadIndex((prev) => (prev + 1) % headings.length);
      setParaIndex((prev) => (prev + 1) % paragraphs.length);
    }, 4000);

    return () => {
      clearInterval(typing);
      clearTimeout(switchText);
    };
  }, [headIndex]);

  // fade toggle for subtitle (paragraphs)
  useEffect(() => {
    const subtitleTimer = setInterval(() => {
      setSubtitleVisible((prev) => !prev);
    }, 4000);
    return () => clearInterval(subtitleTimer);
  }, []);

  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">
      <SEOHead
        title="ACME Protection Services Pvt. Ltd. — Professional Security Guards & Patrols"
        description="Trusted security solutions for offices, events, and residential communities. Trained personnel, 24/7 support, and compliance-first operations. Contact us."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "ACME Protection Services Pvt. Ltd.",
          image:
            "https://images.pexels.com/photos/4870835/pexels-photo-4870835.jpeg?auto=compress&cs=tinysrgb&w=1200",
          telephone: "+91-XXXXXXXXXX",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Office address line",
            addressLocality: "City",
            addressRegion: "State",
            postalCode: "PIN",
            addressCountry: "IN",
          },
          url: typeof window !== "undefined" ? window.location.origin : "",
          priceRange: "₹₹",
          openingHours: "Mo-Fr 09:00-18:00",
        }}
      />

      <HeroSection 
        typedTitle={typedTitle} 
        paragraphs={paragraphs} 
        paraIndex={paraIndex} 
      />
      
      <IntroSection />
      
      <WhyChooseUsSection setIsVideoOpen={setIsVideoOpen} />
      
      <ServicesSection setIsVideoOpen={setIsVideoOpen} />
      
      <PresenceSection />
      
      <ClientsSection />
      
      <CTASection />
      
      <VideoModal isVideoOpen={isVideoOpen} setIsVideoOpen={setIsVideoOpen} />
    </div>
  );
}