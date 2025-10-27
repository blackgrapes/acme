"use client";

import SEOHead from "@/components/SEOHead";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

export default function Clients() {
  const [currentClients, setCurrentClients] = useState([]);
  const [pastClients, setPastClients] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFrontendData();
  }, []);

  const fetchFrontendData = async () => {
    try {
      setLoading(true);

      // Fetch clients (both current and past - you might want to add a 'type' field to distinguish)
      const clientsResponse = await fetch("/api/frontend/clients");
      const clientsData = await clientsResponse.json();

      // For now, split into current and past based on showOnHome flag
      // You might want to add a 'type' field (current/past) to your Client model
      const current = clientsData.filter((client) => client.showOnHome);
      const past = clientsData.filter((client) => !client.showOnHome);

      setCurrentClients(current);
      setPastClients(past);

      // Fetch testimonials
      const testimonialsResponse = await fetch("/api/frontend/testimonials");
      const testimonialsData = await testimonialsResponse.json();
      setTestimonials(testimonialsData.filter((t) => t.showOnHome));
    } catch (error) {
      console.error("Error fetching frontend data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="font-sans">
        <SEOHead
          title="Clients — ACME"
          description="Our valued clients and testimonials."
        />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-pulse">Loading clients...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <SEOHead
        title="Clients — ACME"
        description="Current and past clients with testimonials. Become a client."
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-primary/10 via-background to-card border-border">
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground">
            Our <span className="text-primary">Clients</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-secondary max-w-2xl mx-auto">
            We're trusted by enterprises, campuses, and events across India to
            safeguard people and assets with professionalism and reliability.
          </p>
          <div className="w-20 sm:w-24 h-1 bg-primary mx-auto mt-4 sm:mt-6 rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          {/* Current Clients */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground text-center">
              Some of our clients
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {currentClients.map((client) => (
                <div
                  key={client._id}
                  className="group relative rounded-2xl bg-card/90 backdrop-blur-sm p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 w-full"
                >
                  <img
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    className="mx-auto w-full max-w-[150px] h-auto"
                    loading="lazy"
                  />
                  {client.quote && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/60 rounded-2xl">
                      <p className="text-primary-foreground text-xs sm:text-sm px-3 text-center">
                        "{client.quote}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {currentClients.length === 0 && (
              <p className="text-center text-secondary">
                No current clients to display.
              </p>
            )}
          </div>

          {/* Past Clients */}
          {pastClients.length > 0 && (
            <div className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground text-center">
                Some of our past clients
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {pastClients.map((client) => (
                  <div
                    key={client._id}
                    className="rounded-2xl bg-muted p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all w-full"
                  >
                    <img
                      src={client.logo || "/placeholder.svg"}
                      alt={client.name}
                      className="mx-auto w-full max-w-[150px] h-auto opacity-80"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials */}
          <section className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Quote className="h-5 w-5 text-primary" />
                Testimonials
              </h2>
              <a
                href="/contact"
                className="text-primary font-medium hover:underline text-sm sm:text-base mt-2 sm:mt-0"
              >
                Become a Client
              </a>
            </div>
            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={testimonial._id}
                    className="pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="rounded-2xl my-2 border-border bg-gradient-to-br from-card to-muted p-3 sm:p-4 flex flex-col justify-between h-[150px] sm:h-[170px] shadow-sm hover:shadow-md transition-all">
                      <p className="text-xs sm:text-sm leading-tight text-foreground flex-1">
                        "{testimonial.quote}"
                      </p>
                      <div className="text-xs sm:text-sm text-secondary mt-2">
                        {testimonial.author}
                      </div>
                      {testimonial.video && (
                        <button
                          onClick={() => {
                            setVideo(testimonial.video);
                            setOpen(true);
                          }}
                          className="mt-2 h-7 sm:h-8 px-3 sm:px-4 rounded-full bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium shadow transition-all self-start"
                        >
                          Watch Now
                        </button>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            {testimonials.length === 0 && (
              <p className="text-center text-secondary py-8">
                No testimonials to display.
              </p>
            )}
          </section>
        </div>
      </section>

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
