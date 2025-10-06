"use client";

import SEOHead from "@/components/SEOHead";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Quote } from "lucide-react";

const CURRENT = Array.from({ length: 8 }).map((_, i) => ({
  id: `c${i}`,
  logo: `https://dummyimage.com/200x100/edf2f7/000000.png&text=Client+${i + 1}`,
  quote: "ACME elevated our security posture across sites.",
}));

const PAST = Array.from({ length: 6 }).map((_, i) => ({
  id: `p${i}`,
  logo: `https://dummyimage.com/200x100/f1f5f9/000000.png&text=Past+${i + 1}`,
}));

const TESTIMONIALS = [
  { id: "t1", quote: "Reliable team with quick escalation handling.", author: "Operations Head, TechCorp", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "t2", quote: "Professional guards and clear reporting.", author: "Admin Manager, FinServe" },
  { id: "t3", quote: "Great at event security and VIP handling.", author: "Events Lead, ExpoCo" },
];

export default function Clients() {
const [open, setOpen] = useState(false);
const [video, setVideo] = useState(null);


  return (
    <div className="font-sans">
      <SEOHead
        title="Clients — ACME"
        description="Current and past clients with testimonials. Become a client."
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-primary/10 via-white to-slate-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center py-16 md:py-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Our <span className="text-primary">Clients</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We’re trusted by enterprises, campuses, and events across India to
            safeguard people and assets with professionalism and reliability.
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        {/* Current Clients */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Some of our clients
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {CURRENT.map((c) => (
              <div
                key={c.id}
                className="group relative rounded-2xl bg-white/70 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <img
                  src={c.logo}
                  alt={`Client ${c.id}`}
                  className="mx-auto"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/60 rounded-2xl">
                  <p className="text-white text-sm px-3 text-center">
                    “{c.quote}”
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Past Clients */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
            Some of our past clients
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {PAST.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl bg-slate-50 p-6 shadow-lg hover:shadow-2xl transition"
              >
                <img
                  src={c.logo}
                  alt={`Past ${c.id}`}
                  className="mx-auto opacity-80"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Quote className="h-6 w-6 text-primary" />
              Testimonials
            </h2>
            <a
              href="#contact"
              className="text-primary font-medium hover:underline"
            >
              Become a Client
            </a>
          </div>

          <Carousel className="relative">
            <CarouselContent>
              {TESTIMONIALS.map((t) => (
                <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="rounded-2xl border bg-gradient-to-br from-white to-slate-50 p-6 flex flex-col justify-between min-h-[140px] sm:min-h-[160px] shadow-sm hover:shadow-md transition">
                    <p className="text-base leading-relaxed">“{t.quote}”</p>
                    <div className="text-sm text-muted-foreground mt-3">
                      {t.author}
                    </div>
                    {t.video && (
                      <button
                        onClick={() => {
                          setVideo(t.video);
                          setOpen(true);
                        }}
                        className="mt-4 h-8 px-4 sm:h-9 sm:px-5 rounded-full bg-primary text-white text-sm font-medium shadow hover:opacity-90 transition"
                      >
                        Watch Video
                      </button>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      </div>

      {/* Video Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:rounded-2xl p-0 overflow-hidden max-w-4xl mx-auto">
          {video && (
            <div className="aspect-video w-full">
              <iframe
                title="Client testimonial"
                className="w-full h-full"
                src={video}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
