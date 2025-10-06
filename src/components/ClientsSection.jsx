"use client";

import { motion } from "framer-motion";

export function ClientsSection() {
  const clients = [
    "/placeholder.svg",
    "/founder.png",
    "/john.jpg",
    "/jane.jpeg",
    "/ravi.jpg",
    // Add more client logo paths as needed
  ];

  return (
    <section className="container py-12 sm:py-16 md:py-20 px-4 mx-auto">
      {/* Heading */}
      <div className="text-center space-y-4 sm:space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Trusted by <span className="text-primary">Leading Organizations</span>
        </h2>
        <p className="text-secondary max-w-2xl mx-auto">
          We’re proud to partner with top corporates, institutions, and
          enterprises across industries.
        </p>
        <div className="w-20 sm:w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden mt-12 sm:mt-16 relative max-w-8xl mx-auto">
        <motion.div
          className="flex space-x-6 sm:space-x-8 lg:space-x-10 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          }}
        >
          {[...clients, ...clients].map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-36 sm:w-40 md:w-44 h-20 sm:h-24 md:h-28 bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-sm 
                       flex justify-center items-center p-4 sm:p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <img
                src={logo}
                alt={`Client ${i}`}
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
