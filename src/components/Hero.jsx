"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, UserCheck, FileCheck2 } from "lucide-react";

export function Hero() {
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

  const [typedTitle, setTypedTitle] = useState("");
  const [headIndex, setHeadIndex] = useState(0);
  const [paraIndex, setParaIndex] = useState(0);

  // Typing effect
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

  return (
    <section className="relative min-h-[75vh] flex items-center">
      <div className="container mx-auto grid md:grid-cols-2 items-center gap-6 sm:gap-8 relative px-4">
        {/* Left Column */}
        <motion.div
          className="flex flex-col justify-center space-y-4 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.span
            className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium mb-4 justify-center md:justify-start"
            style={{
              backgroundColor: `hsl(var(--primary) / 0.05)`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-primary">Trusted Security Partner</span>
          </motion.span>

          {/* Heading */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug"
            style={{ color: `hsl(var(--foreground))` }}
          >
            {typedTitle}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            key={paraIndex}
            className="text-base sm:text-lg max-w-xl"
            style={{ color: `hsl(var(--secondary))` }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {paragraphs[paraIndex]}
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
            <Button
              className="rounded-full px-6 py-2"
              style={{
                backgroundColor: `hsl(var(--primary))`,
                color: `hsl(var(--background))`,
              }}
            >
              <Shield className="h-4 w-4 mr-2" /> Client Portal Login
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-6 py-2 border"
              style={{
                color: `hsl(var(--foreground))`,
                borderColor: `hsl(var(--border))`,
              }}
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
            {[
              {
                icon: (
                  <UserCheck
                    className="h-4 w-4"
                    style={{ color: `hsl(var(--primary))` }}
                  />
                ),
                text: "200+ Vetted Guards",
              },
              {
                icon: (
                  <FileCheck2
                    className="h-4 w-4"
                    style={{ color: `hsl(var(--primary))` }}
                  />
                ),
                text: "ISO Certified",
              },
              {
                icon: (
                  <Shield
                    className="h-4 w-4"
                    style={{ color: `hsl(var(--primary))` }}
                  />
                ),
                text: "120+ Clients",
              },
            ].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-3 py-1 bg-card rounded-full shadow-sm border"
                style={{ borderColor: `hsl(var(--border))` }}
              >
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          className="flex justify-center md:justify-end relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
        >
          <div
            className="absolute -inset-12 blur-3xl rounded-full animate-pulse -z-10"
            style={{ backgroundColor: `hsl(var(--primary) / 0.1)` }}
          />
          <motion.img
            src="/gaurd_image1-Photoroom.png"
            alt="Guard Illustration"
            className="max-h-[450px] w-auto drop-shadow-2xl relative z-10"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
      {/* Bottom Wave + Trust Bar */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        {/* Wave Shape */}
        <svg
          className="w-[90%] mx-auto h-16 sm:h-20 text-primary"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,192C672,203,768,181,864,154.7C960,128,1056,96,1152,112C1248,128,1344,192,1392,224L1440,256L1440,320L0,320Z"
          ></path>
        </svg>

        {/* Optional Trust Bar */}
        <div className="absolute bottom-0 flex justify-center w-[90%] mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70">
            {/* Trust items go here */}
          </div>
        </div>
      </div>
    </section>
  );
}
