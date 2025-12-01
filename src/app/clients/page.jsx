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
import { Quote, Star, PlayCircle, Calendar, Sparkles, Shield } from "lucide-react";
import { motion } from "framer-motion";

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
      const clientsResponse = await fetch("/api/frontend/clients");
      const clientsData = await clientsResponse.json();

      // Filter clients based on isCurrent field
      const current = clientsData.filter((client) => client.isCurrent === true);
      const past = clientsData.filter((client) => client.isCurrent === false);

      setCurrentClients(current);
      setPastClients(past);

      const testimonialsResponse = await fetch("/api/frontend/testimonials");
      const testimonialsData = await testimonialsResponse.json();
      setTestimonials(testimonialsData.filter((t) => t.showOnHome));
    } catch (error) {
      console.error("Error fetching frontend data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Skeleton Components
  const ClientSkeleton = () => (
    <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg border border-border/50 h-full flex items-center justify-center animate-pulse">
      <div className="w-full h-20 bg-border rounded-lg"></div>
    </div>
  );

  const TestimonialSkeleton = () => (
    <div className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8 shadow-lg h-full flex flex-col animate-pulse">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 w-4 bg-border rounded-full"></div>
        ))}
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-border rounded w-full"></div>
        <div className="h-4 bg-border rounded w-4/5"></div>
        <div className="h-4 bg-border rounded w-3/4"></div>
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
        <div className="space-y-2">
          <div className="h-4 bg-border rounded w-20"></div>
          <div className="h-3 bg-border rounded w-16"></div>
        </div>
        <div className="h-8 bg-border rounded w-16"></div>
      </div>
    </div>
  );

  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-background to-muted/30">
      <SEOHead
        title="Our Clients — ACME Protection Services"
        description="Discover why leading corporate clients trust ACME Protection Services. Read testimonials and see our client portfolio."
      />

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6 leading-tight">
              Our <span className="text-primary">Valued</span> Clients
            </h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8 font-light"
            >
              Join leading enterprises, institutions, and organizations across India who trust 
              <span className="text-primary font-medium"> ACME </span>
              for comprehensive security solutions and peace of mind.
            </motion.p>

            {/* Divider */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-1.5 bg-primary mx-auto rounded-full mb-12"
            ></motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
            >
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-primary mb-2">37+</div>
                <div className="text-sm text-muted-foreground">Years of Excellence</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-primary mb-2">200+</div>
                <div className="text-sm text-muted-foreground">Satisfied Clients</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Security Support</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Current Clients Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          {/* Section Header - Always Visible */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-0.5 bg-primary/30"></div>
              <Sparkles className="h-8 w-8 text-primary" />
              <div className="w-12 h-0.5 bg-primary/30"></div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Current <span className="text-primary">Security Partners</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Organizations currently benefiting from our premium security solutions and 
              round-the-clock protection services
            </p>
          </motion.div>

          {/* Clients Grid with Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
            {loading ? (
              // Show skeletons when loading
              [...Array(10)].map((_, index) => (
                <ClientSkeleton key={index} />
              ))
            ) : currentClients.length > 0 ? (
              // Show actual clients when loaded
              currentClients.map((client, index) => (
                <motion.div
                  key={client._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-border/50 group-hover:border-primary/20 h-full flex items-center justify-center">
                    <img
                      src={client.logo || "/placeholder.svg"}
                      alt={client.name}
                      className="w-full h-auto max-w-[120px] sm:max-w-[140px] transition-all duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Hover Overlay */}
                    {client.quote && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/80 rounded-2xl flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm">
                        <div className="text-center text-primary-foreground">
                          <Quote className="h-6 w-6 mx-auto mb-2 opacity-80" />
                          <p className="text-xs sm:text-sm leading-tight font-medium">
                            "{client.quote}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Client Name Tooltip */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs font-medium px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {client.name}
                  </div>
                </motion.div>
              ))
            ) : (
              // Show empty state when no clients
              <div className="col-span-full text-center py-16">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-md mx-auto"
                >
                  <Sparkles className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-40" />
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    Building Our Partner Network
                  </h3>
                  <p className="text-muted-foreground text-lg mb-8">
                    We're currently onboarding new security partners. 
                    Our client portfolio will be updated soon with leading organizations.
                  </p>
                  {/* <a
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Become Our First Partner
                  </a> */}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Past Clients Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Section Header - Always Visible */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-0.5 bg-primary/30"></div>
              <Calendar className="h-8 w-8 text-primary" />
              <div className="w-12 h-0.5 bg-primary/30"></div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our <span className="text-primary">Alumni Network</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Esteemed organizations we've had the privilege to protect and serve over the years
            </p>
          </motion.div>

          {/* Past Clients Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {loading ? (
              // Show skeletons when loading
              [...Array(8)].map((_, index) => (
                <div key={index} className="bg-background/80 rounded-xl p-4 sm:p-6 shadow-sm border border-border/30 animate-pulse">
                  <div className="w-full h-16 bg-border rounded-lg"></div>
                </div>
              ))
            ) : pastClients.length > 0 ? (
              // Show actual past clients when loaded
              pastClients.map((client, index) => (
                <motion.div
                  key={client._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-background/80 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/30 group"
                >
                  <img
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    className="w-full h-auto max-w-[100px] mx-auto opacity-60 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                  
                  {/* Client Name */}
                  <div className="text-center mt-3">
                    <p className="text-xs text-muted-foreground font-medium truncate">
                      {client.name}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              // Show empty state when no past clients
              <div className="col-span-full text-center py-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-md mx-auto"
                >
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Rich History of Service
                  </h3>
                  <p className="text-muted-foreground">
                    Our alumni network represents decades of trusted security partnerships.
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-primary"></div>
              <Quote className="h-8 w-8 text-primary" />
              <div className="w-8 h-0.5 bg-primary"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Client <span className="text-primary">Testimonials</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Hear directly from organizations about their experience with ACME's security solutions
            </p>
          </motion.div>

          {loading ? (
            // Testimonials Skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[...Array(3)].map((_, index) => (
                <TestimonialSkeleton key={index} />
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            // Actual Testimonials Carousel
            <Carousel className="w-full max-w-7xl mx-auto">
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={testimonial._id}
                    className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full"
                    >
                      <div className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col group">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>

                        {/* Quote */}
                        <div className="flex-1">
                          <p className="text-foreground leading-relaxed mb-6 text-sm sm:text-base italic">
                            "{testimonial.quote}"
                          </p>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                          <div>
                            <div className="font-semibold text-foreground text-sm sm:text-base">
                              {testimonial.author}
                            </div>
                          </div>

                          {/* Video Button */}
                          {testimonial.video && (
                            <button
                              onClick={() => {
                                setVideo(testimonial.video);
                                setOpen(true);
                              }}
                              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg hover:shadow-xl transition-all group-hover:scale-105"
                            >
                              <PlayCircle className="h-4 w-4" />
                              Watch Video
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Custom Navigation */}
              <div className="flex items-center justify-center gap-4 mt-12">
                <CarouselPrevious className="relative static transform-none bg-primary text-white hover:bg-primary/90 border-0 h-12 w-12 rounded-full shadow-lg" />
                <CarouselNext className="relative static transform-none bg-primary text-white hover:bg-primary/90 border-0 h-12 w-12 rounded-full shadow-lg" />
              </div>
            </Carousel>
          ) : (
            // Empty Testimonials State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Quote className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-40" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Share Your Experience
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Be the first to share how ACME Protection Services has helped secure your organization.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Share Your Success Story
              </a>
            </motion.div>
          )}
        </div>
      </section>

      

      {/* Enhanced Video Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl sm:max-w-5xl sm:rounded-3xl p-0 bg-background/95 backdrop-blur-lg border-border/20 shadow-2xl mx-auto overflow-hidden">
          {video && (
            <div className="relative">
              <div className="aspect-video w-full bg-black">
                <iframe
                  title="Client testimonial"
                  className="w-full h-full"
                  src={video}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setOpen(false)}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}