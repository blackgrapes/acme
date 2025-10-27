"use client";

import SEOHead from "@/components/SEOHead";
import Link from "next/link";
import {
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  UserPlus,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";

// Fallback icons in case service doesn't have one defined
const serviceIcons = {
  pso: UserCheck,
  guard: Shield,
  officer: UserCog,
  supervisor: Users,
  "lady-guard": UserPlus,
  gunmen: ShieldCheck,
  bodyguards: ShieldCheck,
};

export default function WeProvide() {
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
      setServices(servicesData.filter((service) => service.showOnHome));
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="font-sans">
        <SEOHead
          title="We Provide — ACME"
          description="Our security services."
        />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-pulse">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <SEOHead
        title="We Provide — ACME"
        description="Personal Security Officers, Security Guards, Supervisors, Gunmen, Lady Guards & more."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-background to-card border-border">
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground">
            We <span className="text-primary">Provide</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-secondary max-w-3xl mx-auto">
            Trusted, trained, and tailored security solutions for{" "}
            <span className="font-semibold text-primary">individuals</span>,{" "}
            <span className="font-semibold text-primary">businesses</span>, and{" "}
            <span className="font-semibold text-primary">events</span>. Our team
            ensures safety, discipline, and peace of mind — everywhere, anytime.
          </p>
          <div className="w-20 sm:w-24 h-1 bg-primary mx-auto mt-4 sm:mt-6 rounded-full"></div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => {
              const IconComponent = serviceIcons[service.slug] || ShieldCheck;
              return (
                <article
                  key={service._id}
                  className="group relative rounded-2xl border-border bg-card/90 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-primary/40 transition-all duration-500 overflow-hidden w-full flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                    <img
                      src={service.img || "/placeholder.svg"}
                      alt={service.title}
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition line-clamp-2">
                        {service.title}
                      </h2>
                      <p className="mt-2 text-sm text-secondary line-clamp-3">
                        {service.summary}
                      </p>

                      <ul className="mt-3 text-sm text-secondary space-y-1">
                        {service.benefits?.map((benefit, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 line-clamp-1"
                          >
                            <span className="text-primary mt-1 flex-shrink-0">
                              ✔
                            </span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 text-primary text-sm font-semibold mt-4 sm:mt-6 group-hover:underline"
                    >
                      View details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13.5 4.5l6 6-6 6M4.5 12h15"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          {services.length === 0 && (
            <p className="text-center text-secondary py-12">
              No services to display.
            </p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-primary/5 via-background to-card border-border">
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Your Safety, Our <span className="text-primary">Priority</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-secondary max-w-2xl mx-auto">
            From{" "}
            <span className="font-medium text-foreground">
              individual protection
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              large-scale event security
            </span>
            , our team is always ready to stand by your side. Let us design a
            plan that fits your world.
          </p>
          <Link
            href="/contact"
            className="mt-6 sm:mt-8 inline-block rounded-full px-6 sm:px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium transition"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
