"use client";

import { useEffect, useState } from "react";
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
  "Your Trusted Security Partner Since 1988",
  "Safeguarding People, Property & Peace of Mind",
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
    setTypedTitle("");
    const typing = setInterval(() => {
      setTypedTitle(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(typing);
    }, 80);

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