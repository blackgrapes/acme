"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Users, Award } from "lucide-react";

export function WhyChooseSection() {
  const reasons = [
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Trusted Protection",
      desc: "We ensure safety with a professional and disciplined team, trained for every situation.",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Availability",
      desc: "Our guards and supervisors are available round the clock to keep you and your assets secure.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Team",
      desc: "Each member of our staff is verified, trained, and certified for real-world security challenges.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality Assurance",
      desc: "We maintain high operational standards with regular audits and performance monitoring.",
    },
  ];

  return (
    <section className="w-full  border-border bg-background">
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        {/* Heading */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mb-10 sm:mb-14 text-center sm:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Why <span className="text-primary">Choose Us</span>
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {reasons.map((r, idx) => (
            <motion.div
              key={r.title}
              className="bg-card rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
            >
              {/* Icon */}
              <div className="bg-primary p-4 text-white rounded-full mb-5 flex items-center justify-center shadow-md self-start">
                {r.icon}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {r.title}
              </h3>

              {/* Description */}
              <p className="text-secondary text-sm flex-1">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
