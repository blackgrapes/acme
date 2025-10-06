"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, UserCheck, Siren, FileCheck2, PlayCircle } from "lucide-react";

export function WhyChooseSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="py-20 mt-5">
      <div className="container mx-auto text-center space-y-16">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Why Choose <span className="text-primary">Our Company</span>?
          </h2>
          <p className="mt-3 text-secondary text-lg">
            Backed by experience, trusted by clients, and driven by a commitment
            to excellence in every project.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-10">
          {[
            { value: "800+", label: "Trained Professionals" },
            { value: "50,000+", label: "Training Hours Delivered" },
            { value: "12+", label: "Countries Reached" },
            { value: "90%", label: "Client Retention Rate" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <h4 className="text-4xl font-bold text-primary">{stat.value}</h4>
              <p className="text-secondary mt-2 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {[
            {
              icon: <Clock className="h-7 w-7 text-white" />,
              title: "Reliability",
              text: "24/7 operations with real-time incident response.",
            },
            {
              icon: <UserCheck className="h-7 w-7 text-white" />,
              title: "Trained Personnel",
              text: "Regularly vetted and certified security professionals.",
            },
            {
              icon: <Siren className="h-7 w-7 text-white" />,
              title: "Quick Response",
              text: "Rapid deployment & emergency escalation protocols.",
            },
            {
              icon: <FileCheck2 className="h-7 w-7 text-white" />,
              title: "Compliance",
              text: "Fully compliant with statutory & local regulations.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-card rounded-3xl shadow-xl p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 cursor-pointer  border-border"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
            >
              <div className="bg-primary p-5 rounded-full mb-5 flex items-center justify-center shadow-md">
                {item.icon}
              </div>
              <h3 className="font-semibold text-xl mb-2 text-foreground">
                {item.title}
              </h3>
              <p className="text-secondary text-sm">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Video CTA */}
        <motion.div
          className="mt-12 sm:mt-16 w-full flex items-center gap-3 sm:gap-4 rounded-3xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all cursor-pointer justify-center bg-card max-w-2xl mx-auto"
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsVideoOpen(true)}
        >
          <PlayCircle className="h-10 sm:h-12 w-10 sm:w-12 text-primary flex-shrink-0" />
          <div className="text-left">
            <div className="font-semibold text-foreground">
              Watch how we deliver our services
            </div>
            <div className="text-sm text-secondary">
              30–60 seconds service highlight
            </div>
          </div>
        </motion.div>

        {/* Video Modal */}
        {isVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="relative w-full max-w-3xl bg-black rounded-xl shadow-lg overflow-hidden">
              <button
                className="absolute top-3 right-3 text-white text-2xl font-bold z-50"
                onClick={() => setIsVideoOpen(false)}
              >
                ×
              </button>
              <iframe
                className="w-full h-[400px] md:h-[500px]"
                src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1"
                title="Training Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
