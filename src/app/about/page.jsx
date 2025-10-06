"use client";

import React from "react";
import SEOHead from "@/components/SEOHead";
import {
  RocketIcon,
  BuildingIcon,
  MedalIcon,
  HeartIcon,
  LaptopIcon,
  Shield,
  Users,
  FileCheck2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const timelineData = [
  {
    year: "2016",
    title: "Founded ACME Protection",
    description:
      "Started with a vision to provide reliable and modern security solutions for businesses and communities.",
    icon: <RocketIcon className="h-5 w-5 text-white" />,
  },
  {
    year: "2018",
    title: "Corporate Expansion",
    description:
      "Secured large-scale contracts with corporates and residential complexes across the city.",
    icon: <BuildingIcon className="h-5 w-5 text-white" />,
  },
  {
    year: "2020",
    title: "Recognized for Excellence",
    description:
      "Achieved national compliance certifications and industry recognition for best practices.",
    icon: <MedalIcon className="h-5 w-5 text-white" />,
  },
  {
    year: "2022",
    title: "Employee Well-being",
    description:
      "Introduced specialized training and wellness programs for our workforce.",
    icon: <HeartIcon className="h-5 w-5 text-white" />,
  },
  {
    year: "2024",
    title: "Digital Transformation",
    description:
      "Launched advanced digital monitoring and client portals for seamless reporting.",
    icon: <LaptopIcon className="h-5 w-5 text-white" />,
  },
];

export default function AboutPage() {
  return (
    <div className="fon md:ml-2 md:p-16t-sans">
      <SEOHead
        title="About ACME Protection"
        description="Learn about ACME Protection Services Pvt. Ltd.—our mission, values, and journey."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-white to-slate-50">
        <div className="container py-20 text-center relative">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 relative z-10">
            About <span className="text-primary">ACME Protection</span>
          </h1>
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent z-0 rounded-b-xl"></div>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg relative z-10">
            Safeguarding businesses, communities, and people with trusted
            security solutions since 2016.
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full relative z-10"></div>
        </div>
      </section>

      {/* Mission / Vision / Services */}
      <section className="container py-20 grid md:grid-cols-3 gap-10 text-center">
        <OverviewCard
          icon={<Shield className="h-6 w-6" />}
          title="Our Mission"
          text="To create safe and secure environments where businesses and communities thrive."
        />
        <OverviewCard
          icon={<RocketIcon className="h-6 w-6" />}
          title="Our Vision"
          text="To be India’s most trusted security partner with innovation and compliance."
        />
        <OverviewCard
          icon={<BuildingIcon className="h-6 w-6" />}
          title="What We Do"
          text="From corporate offices to residential complexes, we deliver 24/7 security and monitoring."
        />
      </section>

      {/* Leadership Section */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Meet Our Leadership
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              ACME has been established to serve the ever-increasing commercial,
              industrial, and housing security requirements. Our leadership
              ensures high quality, prompt investigative action, and a
              client-first approach.
            </p>
            <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Founder Spotlight */}
          <div className="flex flex-col md:flex-row items-center gap-10 bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-20">
            <div className="flex-shrink-0">
              <img
                src="/founder.png"
                alt="Mr. V.P Lohiya"
                className="w-48 h-48 object-cover rounded-2xl shadow-xl"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900">
                Mr. V.P Lohiya
              </h3>
              <p className="text-primary font-medium">Founder & Chairman</p>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                ACME was founded with a mission to provide complete, timely, and
                objective security services. We treat clients as business
                associates and work tirelessly for their well-being.
              </p>
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                By employing a unique mix of investigative skills, business
                research, and management techniques, we ensure uncompromised
                protection. All security personnel are trained at ACME Training
                School to guarantee the right person for every job.
              </p>
            </div>
          </div>

          {/* Other Leaders */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <LeaderCard
              img="/john.jpg"
              name="John Doe"
              role="Chief Operating Officer"
            />
            <LeaderCard
              img="/jane.jpeg"
              name="Jane Smith"
              role="Head of Operations"
            />
            <LeaderCard
              img="/ravi.jpg"
              name="Ravi Kumar"
              role="Training Director"
            />
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-24 px-4 sm:px-6 lg:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Our Journey
          </h2>

          {/* Desktop Timeline */}
          <div className="hidden md:grid relative grid-cols-9 gap-4">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary z-0" />
            {timelineData.map((item, index) => (
              <div key={index} className="contents">
                <div
                  className={`col-span-4 ${
                    index % 2 === 0 ? "flex justify-end" : ""
                  }`}
                >
                  {index % 2 === 0 && (
                    <TimelineCard item={item} align="right" />
                  )}
                </div>
                <div className="col-span-1 flex items-center justify-center z-10 relative">
                  <div className="w-10 h-10 rounded-full bg-primary shadow-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <div
                  className={`col-span-4 ${
                    index % 2 !== 0 ? "flex justify-start" : ""
                  }`}
                >
                  {index % 2 !== 0 && <TimelineCard item={item} align="left" />}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-10">
            {timelineData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-white p-6 rounded-xl shadow-xl"
              >
                <div className="w-10 h-10 mb-4 rounded-full bg-primary flex items-center justify-center">
                  {item.icon}
                </div>
                <p className="text-primary text-sm font-semibold">
                  {item.year}
                </p>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container py-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Core Values
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <ValueCard
            icon={<Shield className="h-5 w-5 text-white" />}
            title="Integrity"
            text="We do the right thing—always."
          />
          <ValueCard
            icon={<Users className="h-5 w-5 text-white" />}
            title="Trust"
            text="Trusted by clients across industries."
          />
          <ValueCard
            icon={<FileCheck2 className="h-5 w-5 text-white" />}
            title="Transparency"
            text="Clear SLAs and reporting."
          />
          <ValueCard
            icon={<CheckCircle2 className="h-5 w-5 text-white" />}
            title="Safety"
            text="Safety-first protocols and training."
          />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary/20">
        <div className="container py-20 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatCard number="10+" label="Years of Experience" />
          <StatCard number="500+" label="Corporate Clients" />
          <StatCard number="2000+" label="Trained Professionals" />
          <StatCard number="24/7" label="Support Availability" />
        </div>
      </section>

      {/* CTA */}
      <section className="container text-center py-24">
        <h2 className="text-3xl font-bold">Partner with ACME Protection</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mt-3">
          From enterprises to residential communities, we provide peace of mind
          through uncompromised security solutions.
        </p>
        <Button className="mt-8 rounded-full px-6 py-3 bg-primary hover:bg-primary/90 text-white">
          Request a Consultation
        </Button>
      </section>
    </div>
  );
}

/* ----- Components ----- */
function OverviewCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl hover:shadow-xl transition-transform hover:-translate-y-0.5">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{text}</p>
    </div>
  );
}

function TimelineCard({ item, align }) {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-${
        align === "right" ? "right" : "left"
      }`}
    >
      <p className="text-primary text-sm font-semibold">{item.year}</p>
      <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">
        {item.title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {item.description}
      </p>
    </div>
  );
}

function ValueCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl hover:shadow-xl transition-transform hover:-translate-y-0.5 text-center">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{text}</p>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="bg-primary/20 rounded-xl py-8">
      <h3 className="text-4xl font-extrabold text-primary">{number}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function LeaderCard({ img, name, role }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-xl text-center hover:shadow-xl transition">
      <img
        src={img}
        alt={name}
        className="w-28 h-28 mx-auto rounded-full object-cover mb-4 shadow-xl"
      />
      <h4 className="font-semibold text-gray-900">{name}</h4>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  );
}
