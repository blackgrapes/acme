"use client";


import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Moon,
  Building2,
  Users,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";


export default function ServiceDetail() {
  const { slug } = useParams();

  const services = {
    guarding: {
      icon: Shield,
      title: "Professional Guarding Services",
      description:
        "Comprehensive on-site security guard services ensuring round-the-clock protection for your premises.",
      features: [
        "24/7 on-site presence",
        "Access control and monitoring",
        "Incident reporting and documentation",
        "Emergency response protocols",
        "Regular training and certification",
        "Customized security plans",
      ],
      benefits: [
        "Visible deterrent to potential threats",
        "Immediate response to incidents",
        "Professional and courteous service",
        "Detailed activity logs and reports",
      ],
    },
    "night-patrol": {
      icon: Moon,
      title: "Night Patrol Services",
      description:
        "Scheduled night patrols with comprehensive incident reporting to maintain security during vulnerable hours.",
      features: [
        "Regular patrol schedules",
        "Detailed incident logging",
        "Alarm response services",
        "Property inspection",
        "Mobile patrol units",
        "GPS tracking and reporting",
      ],
      benefits: [
        "Enhanced nighttime security",
        "Rapid incident response",
        "Cost-effective protection",
        "Peace of mind during off-hours",
      ],
    },
    "corporate-security": {
      icon: Building2,
      title: "Corporate Security Solutions",
      description:
        "Complete corporate security management including reception, access control, and executive protection.",
      features: [
        "Reception and lobby management",
        "Visitor registration and escorts",
        "Access control systems",
        "Executive protection services",
        "Conference and meeting security",
        "Emergency evacuation planning",
      ],
      benefits: [
        "Professional corporate image",
        "Enhanced access control",
        "Improved employee safety",
        "Comprehensive security coverage",
      ],
    },
    "event-security": {
      icon: Users,
      title: "Event Security Services",
      description:
        "Professional event security with expert crowd control, VIP protection, and emergency management.",
      features: [
        "Crowd management and control",
        "VIP and celebrity protection",
        "Entry point security",
        "Bag checks and screening",
        "Emergency response teams",
        "Event planning consultation",
      ],
      benefits: [
        "Safe and secure events",
        "Professional crowd management",
        "VIP safety assurance",
        "Comprehensive event coverage",
      ],
    },
  };

  const service = services[slug || ""] || services.guarding;
  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {service.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <div className="mb-8">
              <Icon className="h-20 w-20 text-primary mb-6" />
              <h2 className="text-3xl font-bold mb-4">Service Features</h2>
              <ul className="space-y-3">
                {service.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Key Benefits</h2>
              <ul className="space-y-3">
                {service.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="text-xl font-bold mb-4">
                Interested in this service?
              </h3>
              <p className="text-muted-foreground mb-6">
                Contact us today to discuss your security needs and get a
                customized quote.
              </p>
              <Link href="/contact">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Request a Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
