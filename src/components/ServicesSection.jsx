"use client";

import { motion } from "framer-motion";
import { Shield, Siren, Briefcase, MapPin, ArrowRight, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";

// Icon mapping function
const getServiceIcon = (iconName) => {
  const iconMap = {
    shield: <Shield className="h-5 w-5" />,
    siren: <Siren className="h-5 w-5" />,
    briefcase: <Briefcase className="h-5 w-5" />,
    mapPin: <MapPin className="h-5 w-5" />,
  };
  return iconMap[iconName] || <Shield className="h-5 w-5" />;
};

export default function ServicesSection({ setIsVideoOpen }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchServices();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          {/* Heading + CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-0 text-center sm:text-left">
              Our Services
            </h2>
            <a
              href="/services"
              className="text-primary inline-flex items-center gap-2 font-medium hover:underline text-sm"
            >
              View All Services <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Loading Skeleton */}
          <div className="grid gap-4 md:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg p-4 md:p-6 lg:p-8 animate-pulse"
              >
                <div className="bg-gray-200 p-3 md:p-4 lg:p-5 rounded-full mb-3 md:mb-4 lg:mb-5 w-12 h-12"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mt-1"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no services found, show fallback
  if (services.length === 0) {
    return (
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          {/* Heading + CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-0 text-center sm:text-left">
              Our Services
            </h2>
            <a
              href="/services"
              className="text-primary inline-flex items-center gap-2 font-medium hover:underline text-sm"
            >
              View All Services <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          <div className="text-center py-8">
            <p className="text-gray-500">No services available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        {/* Heading + CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-0 text-center sm:text-left">
            Our Services
          </h2>
          <a
            href="/services"
            className="text-primary inline-flex items-center gap-2 font-medium hover:underline text-sm"
          >
            View All Services <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid gap-4 md:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, idx) => (
            <motion.div
              key={service._id || service.title}
              className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 md:hover:-translate-y-3 cursor-pointer flex flex-col p-4 md:p-6 lg:p-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
            >
              {/* Icon */}
              <div className="bg-primary p-3 md:p-4 lg:p-5 text-white rounded-full mb-3 md:mb-4 lg:mb-5 flex items-center justify-center shadow-md self-start">
                {getServiceIcon(service.iconName)}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg md:text-xl mb-1 md:mb-2 text-gray-900 text-left">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-xs md:text-sm text-left">
                {service.desc || service.description}
              </p>

              {/* Learn More */}
              <a
                href={`/services/${service.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="mt-3 md:mt-4 text-primary font-medium hover:underline text-xs md:text-sm self-start"
              >
                Learn More →
              </a>
            </motion.div>
          ))}
        </div>

        {/* Optional CTA Video like Why Choose Us */}
        <motion.div
          className="mt-10 w-full flex items-center gap-4 rounded-3xl border border-gray-200 p-6 shadow-md hover:shadow-xl transition-shadow cursor-pointer justify-center bg-white mx-auto"
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsVideoOpen(true)}
        >
          <PlayCircle className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-primary" />
          <div>
            <div className="font-semibold text-gray-900 text-sm md:text-base">
              Watch how we deliver our services
            </div>
            <div className="text-gray-500 text-xs md:text-sm">
              30–60 seconds service highlight
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}