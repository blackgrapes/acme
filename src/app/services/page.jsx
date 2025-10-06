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

export default function WeProvide() {
  const services = [
    {
      slug: "pso",
      title: "Personal Security Officer",
      summary:
        "24x7 personal protection — escorting clients like a shadow while respecting personal & professional space.",
      benefits: [
        "Crowd control & family protection",
        "Extreme security coverage",
        "Discreet presence",
      ],
      icon: UserCheck,
      img: "/Personal.jpg",
    },
    {
      slug: "guard",
      title: "Security Guard",
      summary:
        "On-site guards ensuring rules, laws, and company policies are enforced with quick response.",
      benefits: ["Protect property", "Emergency handling", "Access control"],
      icon: Shield,
      img: "/SecurityGuard.jpg",
    },
    {
      slug: "officer",
      title: "Security Officer",
      summary:
        "Manage security devices, enforce compliance, and implement preventive safety measures.",
      benefits: [
        "Risk prevention",
        "Policy enforcement",
        "Security compliance",
      ],
      icon: UserCog,
      img: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=800&q=80",
    },
    {
      slug: "supervisor",
      title: "Security Supervisor",
      summary:
        "Supervise, train, and evaluate security teams to ensure discipline and efficiency.",
      benefits: [
        "Team supervision",
        "Training programs",
        "Performance evaluation",
      ],
      icon: Users,
      img: "/SecuritySupervisor.png",
    },
    {
      slug: "lady-guard",
      title: "Lady Security Guard",
      summary:
        "Specialized female guards for access control, patrolling, and women safety monitoring.",
      benefits: [
        "Access control for women",
        "Surveillance monitoring",
        "Security checks",
      ],
      icon: UserPlus,
      img: "/LadySecurityGuard.webp",
    },
    {
      slug: "gunmen",
      title: "Security Gunmen",
      summary:
        "Armed gunmen for high-risk zones, harassment prevention, and rapid defense actions.",
      benefits: ["Armed response", "Protect people & assets", "24/7 patrols"],
      icon: ShieldCheck,
      img: "/SecurityGunmen.png",
    },
    {
      slug: "bodyguards",
      title: "Ex-men Security Guard & Bodyguards",
      summary:
        "Elite ex-men bodyguards ensuring discipline, briefing, and VIP/Crowd protection.",
      benefits: ["Discipline enforcement", "Crowd control", "VIP security"],
      icon: ShieldCheck,
      img: "/Ex-men.jpg",
    },
  ];

  return (
    <div className="font-sans md:p-12 px-4">
      <SEOHead
        title="We Provide — ACME"
        description="Personal Security Officers, Security Guards, Supervisors, Gunmen, Lady Guards & more."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-background to-card  border-border">
        <div className="container text-center py-12 sm:py-16 md:py-20">
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
      <section className="container py-12 sm:py-16 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-items-center max-w-7xl mx-auto">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.slug}
                className="group relative rounded-2xl  border-border bg-card/90 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-primary/40 transition-all duration-500 overflow-hidden w-full sm:w-[320px] md:w-[360px] lg:w-[380px] flex flex-col"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition">
                      {s.title}
                    </h2>
                    <p className="mt-2 text-sm text-secondary line-clamp-3">
                      {s.summary}
                    </p>

                    <ul className="mt-3 text-sm text-secondary space-y-1">
                      {s.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="text-primary mt-1">✔</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/services/${s.slug}`}
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
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-primary/5 via-background to-card border-t border-border">
        <div className="container text-center py-12 sm:py-16 md:py-20">
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
