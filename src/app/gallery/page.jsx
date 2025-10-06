"use client";

import { useMemo, useState } from "react";
import SEOHead from "@/components/SEOHead";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TAGS = ["All", "Events", "Training", "Patrols", "Team"];

const ITEMS = [
  {
    id: "1",
    tag: "Events",
    caption: "Corporate event security",
    src: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "2",
    tag: "Training",
    caption: "Drill and training",
    src: "https://images.pexels.com/photos/600022/pexels-photo-600022.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "3",
    tag: "Patrols",
    caption: "Night patrol route",
    src: "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "4",
    tag: "Team",
    caption: "ACME team",
    src: "https://images.pexels.com/photos/756742/pexels-photo-756742.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "5",
    tag: "Training",
    caption: "Training highlight",
    src: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    type: "video",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "6",
    tag: "Events",
    caption: "Entry screening",
    src: "https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "7",
    tag: "Patrols",
    caption: "Campus patrol",
    src: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "8",
    tag: "Team",
    caption: "Briefing",
    src: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export default function Gallery() {
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const filtered = useMemo(
    () => (active === "All" ? ITEMS : ITEMS.filter((i) => i.tag === active)),
    [active]
  );

  return (
    <div className="font-sans">
      <SEOHead
        title="Gallery — ACME"
        description="Events, Training, Patrols, and Team gallery with video highlights."
      />

      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center py-8 sm:py-12 md:py-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          Our <span className="text-primary">Gallery</span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-secondary max-w-3xl mx-auto">
          Explore highlights from events, trainings, and patrols.
        </p>
        <div className="w-16 sm:w-20 h-1 bg-primary mx-auto mt-4 sm:mt-5 rounded-full"></div>
      </header>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-8 sm:mb-12 flex flex-wrap justify-center gap-2 sm:gap-3">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`relative h-9 sm:h-10 px-4 sm:px-6 rounded-full border text-sm font-medium transition-all 
              ${
                active === t
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
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
      </section>

      {/* Masonry Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-4 py-8 sm:py-12 md:py-16">
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 [column-fill:_balance]"
        >
          <AnimatePresence>
            {filtered.map((i) => (
              <motion.figure
                key={i.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 sm:mb-6 break-inside-avoid w-full"
              >
                <button
                  onClick={() => {
                    setCurrent(i);
                    setOpen(true);
                  }}
                  className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-card shadow-md hover:shadow-xl transition-all"
                >
                  <img
                    src={i.src}
                    alt={i.caption}
                    loading="lazy"
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-3 sm:p-4">
                    <span className="text-primary-foreground text-xs sm:text-sm font-medium drop-shadow">
                      {i.caption}
                    </span>
                  </div>
                  {i.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="h-12 sm:h-16 w-12 sm:w-16 text-primary-foreground/90 drop-shadow-lg group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                </button>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>
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
                src={current.src}
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
