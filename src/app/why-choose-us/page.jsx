"use client";

import {
  ShieldCheck,
  Users,
  Award,
  Headphones,
  Clock,
  Building2,
  Target,
  Handshake,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Link from "next/link";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: ShieldCheck,
      title: "Trusted Security Expertise",
      desc: "Over 10+ years of delivering reliable and compliant protection services.",
    },
    {
      icon: Users,
      title: "Skilled Workforce",
      desc: "Professionally trained guards and staff equipped with the latest protocols.",
    },
    {
      icon: Award,
      title: "Certified & Compliant",
      desc: "Fully licensed under PASARA, GST registered, and MSME certified.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Round-the-clock customer support ensuring peace of mind.",
    },
    {
      icon: Clock,
      title: "On-Time Response",
      desc: "Quick deployment and proactive monitoring at all times.",
    },
  ];

  const steps = [
    {
      icon: Building2,
      title: "Understanding Needs",
      desc: "We carefully assess your security requirements and risks.",
    },
    {
      icon: Target,
      title: "Custom Strategy",
      desc: "We design tailored security solutions that fit your business.",
    },
    {
      icon: ShieldCheck,
      title: "Implementation",
      desc: "Deployment of trained staff and advanced monitoring tools.",
    },
    {
      icon: Handshake,
      title: "Ongoing Partnership",
      desc: "Continuous improvement, training, and dedicated support.",
    },
  ];

  const testimonials = [
    {
      quote:
        "ACME’s professionalism and response time are unmatched. They make us feel secure 24/7.",
      name: "Operations Head, TechCorp",
    },
    {
      quote:
        "We trust ACME for all our branches across India. Truly reliable security partners.",
      name: "Admin Manager, GlobalBank",
    },
    {
      quote:
        "Their guards are well-trained and courteous. It’s rare to find such consistency.",
      name: "HR Director, EduCare Group",
    },
  ];

  return (
    <div className="font-sans">
      <SEOHead
        title="Why Choose Us — ACME"
        description="Discover why leading organizations trust ACME Protection Services for security solutions."
      />

      {/* Heading */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground">
            Why <span className="text-primary">Choose Us</span>
          </h1>
          <p className="mt-4 text-secondary text-base sm:text-lg">
            Trusted by corporates, institutions, and enterprises across India
            for reliable protection and compliance.
          </p>
          <div className="w-16 sm:w-20 h-1 bg-primary mx-auto rounded-full mt-4 sm:mt-6"></div>
        </div>
      </section>

      {/* Reasons Grid */}
      <section className="py-8 sm:py-12 lg:py-16 mb-12 sm:mb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl  border-border bg-card shadow-sm p-4 sm:p-6 hover:shadow-md transition-all w-full flex flex-col items-center"
                >
                  <Icon className="h-8 sm:h-10 w-8 sm:w-10 text-primary mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-base sm:text-lg text-foreground text-center">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm text-secondary text-center">
                    {r.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-12 lg:py-16 mb-12 sm:mb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                10+
              </h2>
              <p className="text-sm text-secondary mt-2">Years of Experience</p>
            </div>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                500+
              </h2>
              <p className="text-sm text-secondary mt-2">Corporate Clients</p>
            </div>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                2000+
              </h2>
              <p className="text-sm text-secondary mt-2">
                Trained Professionals
              </p>
            </div>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                24/7
              </h2>
              <p className="text-sm text-secondary mt-2">
                Support Availability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-8 sm:py-12 lg:py-16 mb-12 sm:mb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 lg:mb-10 text-foreground">
            Our Approach
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="text-center p-4 sm:p-6 rounded-xl  border-border bg-card shadow-md hover:shadow-lg transition-all w-full flex flex-col items-center"
                >
                  <Icon className="h-8 sm:h-10 w-8 sm:w-10 text-primary mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-secondary text-center">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-12 lg:py-16 mb-12 sm:mb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 lg:mb-10 text-foreground">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl  border-border bg-card shadow-sm p-4 sm:p-6 hover:shadow-md transition-all w-full"
              >
                <p className="text-sm text-secondary italic">"{t.quote}"</p>
                <div className="mt-4 text-xs font-medium text-foreground">
                  — {t.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 sm:py-12 lg:py-16 bg-primary/5 rounded-2xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">
            Ready to Secure Your Business?
          </h2>
          <p className="text-secondary mb-4 sm:mb-6 text-sm sm:text-base">
            Partner with ACME Protection Services and experience peace of mind
            with trusted security solutions.
          </p>
          <Link
            href="/contact"
            className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-primary text-white font-medium hover:opacity-90 transition"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}
