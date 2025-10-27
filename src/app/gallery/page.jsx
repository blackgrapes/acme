"use client";

import { useMemo, useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TAGS = ["All", "Events", "Training", "Patrols", "Team"];

export default function Gallery() {
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/frontend/gallery");
      const data = await response.json();
      setGalleryItems(data.filter((item) => item.showOnHome));
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(
    () =>
      active === "All"
        ? galleryItems
        : galleryItems.filter((i) => i.tag === active.toLowerCase()),
    [active, galleryItems]
  );

  if (loading) {
    return (
      <div className="font-sans">
        <SEOHead title="Gallery — ACME" description="Our gallery." />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-pulse">Loading gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <SEOHead
        title="Gallery — ACME"
        description="Events, Training, Patrols, and Team gallery with video highlights."
      />

      {/* Header */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Our <span className="text-primary">Gallery</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-secondary">
            Explore highlights from events, trainings, and patrols.
          </p>
          <div className="w-16 sm:w-20 h-1 bg-primary mx-auto mt-4 sm:mt-5 rounded-full"></div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 sm:py-12 mb-8 sm:mb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`relative h-9 sm:h-10 px-4 sm:px-6 rounded-full border text-sm font-medium transition-all 
                  ${
                    active === t
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-card text-secondary hover:bg-card/50 border-border"
                  }`}
              >
                {t}
                {active === t && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-primary/20 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 [column-fill:_balance]"
          >
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.figure
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 sm:mb-6 break-inside-avoid w-full"
                >
                  <button
                    onClick={() => {
                      setCurrent(item);
                      setOpen(true);
                    }}
                    className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-card shadow-md hover:shadow-xl transition-all"
                  >
                    <img
                      src={item.mediaFiles?.[0] || "/placeholder.svg"}
                      alt={item.caption}
                      loading="lazy"
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-3 sm:p-4">
                      <span className="text-primary-foreground text-xs sm:text-sm font-medium drop-shadow">
                        {item.caption}
                      </span>
                    </div>
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="h-12 sm:h-16 w-12 sm:w-16 text-primary-foreground/90 drop-shadow-lg group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                  </button>
                </motion.figure>
              ))}
            </AnimatePresence>
          </motion.div>
          {filtered.length === 0 && (
            <p className="text-center text-secondary py-12">
              No items found for this category.
            </p>
          )}
        </div>
      </section>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl sm:max-w-5xl sm:rounded-2xl p-4 bg-black/95 text-primary-foreground border border-border/10 mx-auto">
          {current &&
            (current.type === "video" ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                <iframe
                  title={current.caption}
                  className="w-full h-full"
                  src={current.video}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <img
                src={current.mediaFiles?.[0] || "/placeholder.svg"}
                alt={current.caption}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            ))}
          {current && (
            <div className="mt-4 text-center text-xs sm:text-sm text-secondary">
              {current.caption}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
