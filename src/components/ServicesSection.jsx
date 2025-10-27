"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  PlayCircle,
  ArrowRight,
  Shield,
  Users,
  Clock,
  UserCheck,
} from "lucide-react";

// Fallback icons
const serviceIcons = {
  pso: UserCheck,
  guard: Shield,
  officer: Users,
  supervisor: Users,
  "lady-guard": UserCheck,
  gunmen: Shield,
  bodyguards: Shield,
};

export function ServicesSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/frontend/weprovide");
      const servicesData = await response.json();
      // Only show services that are marked to show on home, limit to 4 for the section
      const homeServices = servicesData
        .filter((service) => service.showOnHome)
        .slice(0, 4);
      setServices(homeServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state with same structure
  if (loading) {
    return (
      <section className="w-full border-border bg-background">
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          {/* Heading + CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mb-10 sm:mb-14 text-center sm:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-0">
              Our <span className="text-primary">Services</span>
            </h2>
            <div className="text-primary inline-flex items-center gap-2 font-medium text-sm sm:text-base mt-2 sm:mt-0">
              View All Services <ArrowRight className="h-4 w-4" />
            </div>
          </motion.div>

          {/* Loading skeleton for cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(4)].map((_, idx) => (
              <motion.div
                key={idx}
                className="bg-card rounded-3xl p-6 sm:p-8 shadow-lg transition-all duration-300 flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
              >
                <div className="bg-primary p-4 text-white rounded-full mb-5 flex items-center justify-center shadow-md self-start animate-pulse">
                  <div className="h-8 w-8"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
              </motion.div>
            ))}
          </div>

          {/* Loading skeleton for CTA video */}
          <motion.div className="mt-12 sm:mt-16 w-full flex items-center gap-3 sm:gap-4 rounded-3xl p-4 sm:p-5 shadow-md bg-card max-w-2xl mx-auto animate-pulse">
            <div className="h-10 sm:h-12 w-10 sm:w-12 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div className="text-left flex-1">
              <div className="h-5 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // If no services, don't show the section
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="w-full border-border bg-background">
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        {/* Heading + CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mb-10 sm:mb-14 text-center sm:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-0">
            Our <span className="text-primary">Services</span>
          </h2>
          <Link
            href="/services"
            className="text-primary inline-flex items-center gap-2 font-medium hover:underline text-sm sm:text-base mt-2 sm:mt-0"
          >
            View All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.map((service, idx) => {
            const IconComponent = serviceIcons[service.slug] || Shield;
            return (
              <motion.div
                key={service._id}
                className="bg-card rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
              >
                {/* Icon */}
                <div className="bg-primary p-4 text-white rounded-full mb-5 flex items-center justify-center shadow-md self-start">
                  <IconComponent className="h-8 w-8" />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-secondary text-sm flex-1">
                  {service.summary}
                </p>

                {/* Learn More */}
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 text-primary font-medium hover:underline text-sm"
                >
                  Learn More →
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Optional CTA Video */}
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
                className="absolute top-3 right-3 text-white text-2xl font-bold z-50"
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
      </div>
    </section>
  );
}
