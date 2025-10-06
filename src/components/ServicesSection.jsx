"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PlayCircle, ArrowRight } from "lucide-react";
import { Shield, Users, Clock, UserCheck } from "lucide-react"; // Example icons; replace as needed

export function ServicesSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const services = [
    {
      title: "Personal Security Officer",
      desc: "24x7 personal protection with discreet and professional escort services.",
      icon: <UserCheck className="h-8 w-8" />,
      href: "/services/personal-security-officer",
    },
    {
      title: "Security Guard",
      desc: "On-site guards for property protection and access control.",
      icon: <Shield className="h-8 w-8" />,
      href: "/services/security-guard",
    },
    {
      title: "Security Supervisor",
      desc: "Expert supervision and team management for efficient operations.",
      icon: <Users className="h-8 w-8" />,
      href: "/services/security-supervisor",
    },
    {
      title: "Security Gunmen",
      desc: "Armed response for high-risk environments and rapid defense.",
      icon: <Clock className="h-8 w-8" />,
      href: "/services/security-gunmen",
    },
  ];

  return (
    <section className="container py-12 sm:py-16 md:py-20 px-4 mx-auto">
      {/* Heading + CTA */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mb-8 sm:mb-12 text-center sm:text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-0">
          Our Services
        </h2>
        <Link
          href="/services"
          className="text-primary inline-flex items-center gap-2 font-medium hover:underline text-sm"
        >
          View All Services <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
        {services.map((s, idx) => (
          <motion.div
            key={s.title}
            className="bg-card rounded-3xl p-4 sm:p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 cursor-pointer flex flex-col w-full max-w-sm"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
          >
            {/* Icon */}
            <div className="bg-primary p-3 sm:p-4 sm:p-5 text-white rounded-full mb-3 sm:mb-4 sm:mb-5 flex items-center justify-center shadow-md self-start">
              {s.icon}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2 text-left">
              {s.title}
            </h3>

            {/* Description */}
            <p className="text-secondary text-sm text-left flex-1">{s.desc}</p>

            {/* Learn More */}
            <Link
              href={s.href}
              className="mt-4 text-primary font-medium hover:underline text-sm self-start"
            >
              Learn More →
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Optional CTA Video like Why Choose Us */}
      <motion.div
        className="mt-12 sm:mt-16 w-full flex items-center gap-3 sm:gap-4 rounded-3xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all cursor-pointer justify-center bg-card max-w-2xl mx-auto"
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsVideoOpen(true)}
      >
        <PlayCircle className="h-10 sm:h-12 w-10 sm:w-12 text-primary flex-shrink-0" />
        <div className="text-left">
          <div className="font-semibold text-foreground">
            Watch how we deliver our services
          </div>
          <div className="text-sm text-secondary">
            30–60 seconds service highlight
          </div>
        </div>
      </motion.div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-full max-w-3xl bg-black rounded-xl shadow-lg overflow-hidden">
            <button
              className="absolute top-3 right-3 text-primary-foreground text-2xl font-bold z-50"
              onClick={() => setIsVideoOpen(false)}
            >
              ×
            </button>
            <iframe
              className="w-full h-[400px] md:h-[500px]"
              src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1"
              title="Service Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}
