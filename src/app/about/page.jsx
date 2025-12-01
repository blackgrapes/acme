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
  ShieldCheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const timelineData = [
  {
    year: "1988",
    title: "Company Founded",
    description:
      "Mr. V.P. Lohiya commenced operations under the name ACME Protection Services Pvt. Ltd., laying the foundation for modern security services.",
    icon: <RocketIcon className="h-5 w-5 text-white" />,
  },
  {
    year: "2002",
    title: "Incorporation & Business Start",
    description:
      "Officially incorporated and commenced full-scale operations in security services for corporate and residential clients.",
    icon: <BuildingIcon className="h-5 w-5 text-white" />,
  },
  {
    year: "2010",
    title: "Expanded Operations",
    description:
      "Started structured business operations with multiple security service offerings for corporates and residential complexes.",
    icon: <MedalIcon className="h-5 w-5 text-white" />,
  },
  {
    year: "2016",
    title: "Corporate Expansion",
    description:
      "Secured large-scale contracts and expanded the client base across industrial, residential, and corporate sectors.",
    icon: <BuildingIcon className="h-5 w-5 text-white" />,
  },
  {
    year: "2020",
    title: "Business Recognition",
    description:
      "Recognized for excellence in service standards and compliance with national quality and safety norms.",
    icon: <ShieldCheckIcon className="h-5 w-5 text-white" />,
  },
  {
    year: "2021",
    title: "ISO 9001:2015 Certification",
    description:
      "Achieved ISO 9001:2015 certification for Quality Management Systems covering housekeeping, labor, and security services.",
    icon: <MedalIcon className="h-5 w-5 text-white" />,
  },
  {
    year: "2022",
    title: "Employee Well-being & Digital Processes",
    description:
      "Introduced specialized training, wellness programs, and advanced digital monitoring for clients and operations.",
    icon: <HeartIcon className="h-5 w-5 text-white" />,
  },
  {
    year: "2023",
    title: "Modernization & Digital Growth",
    description:
      "Enhanced digital solutions and modern management systems to improve client experience and operational efficiency.",
    icon: <LaptopIcon className="h-5 w-5 text-white" />,
  },
  {
    year: "2025",
    title: "Present-Day Leadership",
    description:
      "ACME continues to serve hundreds of clients across multiple sectors with highly trained personnel and innovative security solutions.",
    icon: <ShieldCheckIcon className="h-5 w-5 text-white" />,
  },
];

export default function AboutPage() {
  return (
    <main className="w-full bg-background text-foreground">
      <SEOHead
        title="About ACME Protection"
        description="Learn about ACME Protection Services Pvt. Ltd.—our mission, values, and journey."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-white to-slate-50 border-b border-border">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground">
            About <span className="text-primary">ACME Protection</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-7xl mx-auto text-lg">
            Mr.V.P. Lohiya commenced operations of the company under the name of
            ACME Protection Services Pvt. Ltd. during the year 1988. Since then
            the company has come a long way in enhancing its competence and
            skills, with the support of our dedicated, devoted and disciplined
            security professionals, who have implemented and executed the
            polices and directives of the company in letter and spirit.
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>
      </section>

      {/* Mission / Vision / Services */}
      <section className="container mx-auto px-4 py-20 grid md:grid-cols-3 gap-10 text-center">
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
      <section className=" border-border bg-background">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Meet Our Leadership
            </h2>
            {/* <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              ACME has been established to serve the ever-increasing commercial,
              industrial, and housing security requirements. Our leadership
              ensures high quality, prompt investigative action, and a
              client-first approach.
            </p> */}
            <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Founder Spotlight */}
          <div className="flex flex-col md:flex-row items-center gap-10 bg-card rounded-2xl shadow-xl p-8 md:p-12 mb-20">
            <div className="flex-shrink-0">
              <img
                src="/founder.png"
                alt="Mr. V.P Lohiya"
                className="w-48 h-48 object-cover rounded-2xl shadow-xl"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-foreground">
                Mr. V.P Lohiya
              </h3>
              <p className="text-primary font-medium">Founder & Chairman</p>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                ACME has been established to serve the ever increasing
                commercial industrial and housing security requirements. The
                company ensures high quality, appropriate and prompt
                investigative action, while dealing in cases concerning clients.
                We treat clients as our business associates and work towards
                their well being.
              </p>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                To provide clients complete, timely and objective security, ACME
                employs unique mix of investigative, business research
                techniques and management skills. In addition, we train all
                security personnel at ACME training School, and ensure
                deployment of appropriate person for the job.
              </p>
            </div>
          </div>

          {/* Other Leaders */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <LeaderCard
              img="/operationHead.jpg"
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
      <section className=" border-border bg-card">
        <div className="container mx-auto px-4 py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-16">
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
                <h3 className="text-lg font-bold text-foreground mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
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
      <section className="bg-primary/10 border-t border-border">
        <div className="container mx-auto px-4 py-20 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatCard number="37+" label="Years of Experience" />
          <StatCard number="200+" label="Corporate Clients" />
          <StatCard number="3000+" label="Trained Professionals" />
          <StatCard number="24/7" label="Support Availability" />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 text-center py-24">
        <h2 className="text-3xl font-bold text-foreground">
          Partner with ACME Protection
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mt-3 mb-10">
          From enterprises to residential communities, we provide peace of mind
          through uncompromised security solutions.
        </p>
        <Link href="/contact" className="rounded-full px-6 py-3 bg-primary hover:bg-primary/90 text-white">
          Request a Consultation
        </Link> 
      </section>
    </main>
  );
}

/* ----- Components ----- */
function OverviewCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-lg hover:shadow-xl transition-transform hover:-translate-y-0.5">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{text}</p>
    </div>
  );
}

function TimelineCard({ item, align }) {
  return (
    <div
      className={`bg-card p-6 rounded-xl shadow-xl max-w-md w-full text-${
        align === "right" ? "right" : "left"
      }`}
    >
      <p className="text-primary text-sm font-semibold">{item.year}</p>
      <h3 className="text-lg font-bold text-foreground mt-1 mb-2">
        {item.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {item.description}
      </p>
    </div>
  );
}

function ValueCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-lg hover:shadow-xl transition-transform hover:-translate-y-0.5 text-center">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-lg text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{text}</p>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="bg-card rounded-xl py-8 shadow-md">
      <h3 className="text-4xl font-extrabold text-primary">{number}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function LeaderCard({ img, name, role }) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition">
      <img
        src={img}
        alt={name}
        className="w-28 h-28 mx-auto rounded-full object-cover mb-4 shadow-xl"
      />
      <h4 className="font-semibold text-foreground">{name}</h4>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  );
}
