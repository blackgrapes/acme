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
  Star,
  CheckCircle,
  Settings,
  Monitor,
  MapPin,
  IndianRupee,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Link from "next/link";
import { useState, useEffect } from "react";
import TestimonialCard from "@/components/TestimonialCard";

export default function WhyChooseUs() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/frontend/testimonials");
      const data = await response.json();
      setTestimonials(data.filter((t) => t.showOnHome));
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const reasons = [
    {
      icon: ShieldCheck,
      title: "Trusted Security Expertise",
      desc: "Over 37+ years of delivering reliable and compliant protection services.",
      badge: "Premium",
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
      badge: "Certified",
    },
    {
      icon: Clock,
      title: "On-Time Response",
      desc: "Quick deployment and proactive monitoring at all times.",
    },
    {
      icon: Target,
      title: "Customized Solutions",
      desc: "Tailored security plans designed specifically for your business needs and risks.",
      badge: "Flexible",
    },

    {
      icon: Settings,
      title: "Customized Solutions",
      desc: "Tailored security plans designed specifically for your business needs.",
      badge: "Flexible",
    },

    {
      icon: Monitor,
      title: "Advanced Technology",
      desc: "Latest surveillance and monitoring equipment for comprehensive security.",
      badge: "Tech",
    },
    {
      icon: MapPin,
      title: "Pan-India Coverage",
      desc: "Security services available across multiple cities and states in India.",
      badge: "Nationwide",
    },

    {
      icon: IndianRupee,
      title: "Cost-Effective Plans",
      desc: "Competitive pricing without compromising on quality and reliability.",
      badge: "Affordable",
    },
  ];

  const steps = [
    {
      icon: Building2,
      title: "Understanding Needs",
      desc: "We carefully assess your security requirements and risks.",
      step: "01",
    },
    {
      icon: Target,
      title: "Custom Strategy",
      desc: "We design tailored security solutions that fit your business.",
      step: "02",
    },
    {
      icon: ShieldCheck,
      title: "Implementation",
      desc: "Deployment of trained staff and advanced monitoring tools.",
      step: "03",
    },
    {
      icon: Handshake,
      title: "Ongoing Partnership",
      desc: "Continuous improvement, training, and dedicated support.",
      step: "04",
    },
  ];

  // Skeleton Loading Components
  const ReasonSkeleton = () => (
    <div className="rounded-2xl border border-border bg-card p-6 animate-pulse">
      <div className="h-10 w-10 bg-border rounded-full mb-4"></div>
      <div className="h-4 bg-border rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-border rounded w-full mb-1"></div>
      <div className="h-3 bg-border rounded w-2/3"></div>
    </div>
  );

  const TestimonialSkeleton = () => (
    <div className="rounded-xl border border-border bg-card p-6 animate-pulse h-full flex flex-col">
      {/* Stars Skeleton */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 w-4 bg-border rounded-full"></div>
        ))}
      </div>

      {/* Content Skeleton - Random height for video/text variation */}
      <div className="flex-1 space-y-3">
        <div className={`h-4 bg-border rounded w-full`}></div>
        <div className={`h-4 bg-border rounded w-4/5`}></div>
        <div className={`h-4 bg-border rounded w-3/4`}></div>
      </div>

      {/* Author Skeleton */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="space-y-2">
          <div className="h-3 bg-border rounded w-20"></div>
          <div className="h-2 bg-border rounded w-16"></div>
        </div>
        <div className="h-6 bg-border rounded w-16"></div>
      </div>
    </div>
  );

  const StatSkeleton = () => (
    <div className="text-center animate-pulse">
      <div className="h-8 bg-border rounded w-16 mx-auto mb-2"></div>
      <div className="h-4 bg-border rounded w-24 mx-auto"></div>
    </div>
  );

  return (
    <div className="font-sans">
      <SEOHead
        title="Why Choose Us — ACME Protection Services"
        description="Discover why leading organizations trust ACME Protection Services for premium security solutions. 37+ years experience, certified professionals, 24/7 support."
      />

      {/* Hero Header */}
      <section className="py-6 sm:py-11 lg:py-15 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          {/* <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            Trusted by 500+ Corporate Clients
          </div> */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Why <span className="text-primary">Choose ACME</span> Protection?
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience security excellence with 37+ years of trusted service,
            certified professionals, and round-the-clock protection for your
            business.
          </p>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mt-8"></div>
        </div>
      </section>

      {/* Key Benefits Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Our Key <span className="text-primary">Advantages</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive security solutions designed to meet your unique
              business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <div
                  key={index}
                  className="group relative rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {reason.badge && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                      {reason.badge}
                    </span>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        {reason.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {reason.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section with Skeleton */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Our <span className="text-primary">Impact</span> in Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground">37+</h2>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Years of Experience
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground">200+</h2>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Clients
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground">
                      3000+
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Trained Professionals
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground">24/7</h2>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Support Availability
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Our <span className="text-primary">4-Step</span> Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A systematic approach to delivering customized security solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="group relative text-center p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  <div className="p-4 bg-primary/10 rounded-full inline-flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials with Skeleton */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              What Our <span className="text-primary">Clients</span> Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - hear from businesses we protect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <>
                <TestimonialSkeleton />
                <TestimonialSkeleton />
                <TestimonialSkeleton />
              </>
            ) : testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <div className="text-muted-foreground mb-4">
                  No testimonials available at the moment.
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  Be the first to share your experience
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-8 sm:p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Ready to Secure Your Business?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Join 200+ satisfied clients who trust ACME for their security
                needs. Get a customized security assessment and quote today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                >
                  Get Free Consultation
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
                >
                  View Our Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
