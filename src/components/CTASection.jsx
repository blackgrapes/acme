"use client";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="container py-10 sm:py-12 md:py-14 px-4 mx-auto">
      <div className="rounded-2xl bg-primary text-white px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row md:items-center justify-center md:justify-between gap-3 sm:gap-4 max-w-8xl mx-auto">
        <div className="text-base sm:text-lg md:text-xl font-semibold text-center md:text-left">
          Secure your workplace with ACME Protection today!
        </div>
        <div className="flex gap-3 flex-wrap justify-center md:justify-end">
          <Button className="rounded-full bg-card text-primary hover:bg-card/90">
            Contact Us
          </Button>
          <Button variant="secondary" className="rounded-full">
            Request a Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
