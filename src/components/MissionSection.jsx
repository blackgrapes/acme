"use client";

import { Shield, Building2, FileCheck2 } from "lucide-react";

function IconCard({ title, icon, text, className }) {
  return (
    <div className={`${className} text-foreground text-center`}>
      <div className="flex justify-center items-center gap-2 mb-2">{icon}</div>
      <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      <p className="text-secondary mt-1 text-xs">{text}</p>
    </div>
  );
}

export function MissionSection() {
  return (
    <section className="container mx-auto mt-8 md:mt-12 px-4">
      <div
        className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[350px] shadow-lg"
        style={{
          background: `linear-gradient(to bottom right, hsl(var(--background)), hsl(var(--card)))`,
        }}
      >
        {/* Left Content */}
        <div className="p-4 md:p-8 lg:p-10 xl:p-14 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold leading-tight text-foreground max-w-2xl">
            Professional{" "}
            <span className="text-primary">Security Solutions</span>
            <br className="hidden md:block" /> for Workplaces & Events
          </h2>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed max-w-xl text-secondary">
            We provide{" "}
            <span className="font-medium text-foreground">
              on-site guarding
            </span>
            , <span className="font-medium text-foreground">night patrols</span>
            ,{" "}
            <span className="font-medium text-foreground">event security</span>,
            and customized protection plans backed by{" "}
            <span className="font-medium text-foreground">
              training & compliance
            </span>
            .
          </p>

          {/* Features */}
          <div className="mt-5 md:mt-6 lg:mt-8 w-full grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            <IconCard
              title="Mission"
              icon={
                <Shield className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-primary" />
              }
              text="Protect with integrity."
              className="bg-card/70 backdrop-blur-md rounded-2xl p-2 shadow-sm hover:shadow-md hover:scale-105 transition-all"
            />
            <IconCard
              title="Vision"
              icon={
                <Building2 className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-primary" />
              }
              text="Safer communities."
              className="bg-card/70 backdrop-blur-md rounded-2xl p-2 shadow-sm hover:shadow-md hover:scale-105 transition-all"
            />
            <IconCard
              title="Values"
              icon={
                <FileCheck2 className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-primary" />
              }
              text="Trust & transparency."
              className="bg-card/70 backdrop-blur-md rounded-2xl p-2 shadow-sm hover:shadow-md hover:scale-105 transition-all"
            />
          </div>
        </div>

        {/* Right Image */}
        <div className="relative h-[200px] sm:h-[250px] md:h-full">
          <img
            src="https://images.pexels.com/photos/433502/pexels-photo-433502.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Corporate security team"
            className="w-full h-full object-cover rounded-b-3xl md:rounded-l-3xl"
            loading="lazy"
          />
          {/* Overlay gradient for style */}
          <div
            className="absolute inset-0 rounded-b-3xl md:rounded-l-3xl md:rounded-br-none"
            style={{
              background: `linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.1), transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
