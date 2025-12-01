import { motion } from "framer-motion";
import { Shield, Building2, FileCheck2 } from "lucide-react";

function IconCard({ title, text, icon, className }) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${className}`}>
      <div className="inline-flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="mt-2 font-semibold text-sm md:text-base">{title}</div>
      <div className="text-xs md:text-sm text-muted-foreground">{text}</div>
    </div>
  );
}

export default function IntroSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 mt-8 md:mt-12 lg:mt-16">
      <div className="container mx-auto">
        <div className="rounded-2xl md:rounded-3xl bg-linear-to-br from-white via-gray-50 to-gray-100 border border-gray-200 overflow-hidden grid md:grid-cols-2 min-h-[400px] md:min-h-[500px] shadow-lg">
          {/* Left Content */}
          <div className="p-6 md:p-10 lg:p-14 flex flex-col justify-center order-2 md:order-1">
            <h2 className="text-lg sm:text-xl md:text-4xl lg:text-3xl font-extrabold leading-tight text-gray-900 text-center md:text-left">
              Professional{" "}
              <span className="text-primary">Security Solutions</span>
              <br className="hidden md:block" /> for companies, apartment,
              warehouse, corporate etc.
            </h2>
            <p className="mt-4 md:mt-5 text-gray-600 text-base md:text-lg leading-relaxed max-w-xl text-center md:text-left">
              We provide{" "}
              <span className="font-medium text-gray-900">
                on-site guarding
              </span>
              ,<span className="font-medium text-gray-900"> night patrols</span>
              ,
              <span className="font-medium text-gray-900"> event security</span>
              , and customized protection plans backed by
              <span className="font-medium text-gray-900">
                {" "}
                training & compliance
              </span>
              .
            </p>

            {/* Features */}
            <div className="mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <IconCard
                title="Mission"
                icon={<Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />}
                text="Protect with integrity."
                className="bg-white/70 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-md hover:scale-105 transition-all"
              />
              <IconCard
                title="Vision"
                icon={
                  <Building2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                }
                text="Safer communities."
                className="bg-white/70 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-md hover:scale-105 transition-all"
              />
              <IconCard
                title="Values"
                icon={
                  <FileCheck2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                }
                text="Trust & transparency."
                className="bg-white/70 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-md hover:scale-105 transition-all"
              />
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[250px] sm:h-[300px] md:h-full order-1 md:order-2">
            <img
              src="/whychooseus.jpg"
              alt="Corporate security team"
              className="w-full h-full object-cover md:rounded-tl-[4rem]"
              loading="lazy"
            />
            {/* Overlay gradient for style */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent md:rounded-tl-[4rem]" />
          </div>
        </div>
      </div>
    </section>
  );
}