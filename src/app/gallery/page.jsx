"use client";

import { useMemo, useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  PlayCircle,
  Image,
  Video,
  Users,
  Calendar,
  Shield,
  ZoomIn,
  ZoomOut,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  Minimize,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const TAGS = ["All", "Events", "Training", "Patrols", "Team", "Facilities"];
import { useRef } from "react";
// Tag icons mapping
const TAG_ICONS = {
  All: Image,
  Events: Calendar,
  Training: Users,
  Patrols: Shield,
  Team: Users,
  Facilities: Video,
};

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

  // Component के अंदर यह state और functions add करें:
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Navigation functions
  const handleNext = () => {
    if (currentMediaIndex < current.mediaFiles?.length - 1) {
      setCurrentMediaIndex((prev) => prev + 1);
      setZoomLevel(1); // Reset zoom on navigation
    }
  };

  const handlePrevious = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex((prev) => prev - 1);
      setZoomLevel(1); // Reset zoom on navigation
    }
  };

  // Zoom functions
  const handleZoom = (factor) => {
    setZoomLevel((prev) => {
      const newZoom = factor === 1 ? 1 : prev * factor;
      return Math.max(0.1, Math.min(5, newZoom)); // Limit zoom between 10% and 500%
    });
  };

  const handleWheelZoom = (e) => {
    if (current.type !== "image") return;

    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomOrigin({ x, y });

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    handleZoom(delta);
  };

  // Fullscreen function
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };
  // New states for panning functionality
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Mouse event handlers for dragging
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Calculate max drag based on zoom level
    const maxDrag = 200 * (zoomLevel - 1);

    setPanOffset({
      x: Math.max(-maxDrag, Math.min(maxDrag, newX)),
      y: Math.max(-maxDrag, Math.min(maxDrag, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart, zoomLevel]);

  // Reset pan when zoom changes or image changes
  useEffect(() => {
    setPanOffset({ x: 0, y: 0 });
  }, [currentMediaIndex, zoomLevel, current]);

  // Updated reset function for modal
  useEffect(() => {
    setCurrentMediaIndex(0);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setIsFullscreen(false);
  }, [current, open]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;

      switch (e.key) {
        case "ArrowLeft":
          handlePrevious();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "Escape":
          setOpen(false);
          break;
        case " ":
          // Space bar to play/pause video
          if (current?.type === "video") {
            const video = document.querySelector("video");
            if (video) {
              video.paused ? video.play() : video.pause();
            }
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, current, currentMediaIndex]);

  // Reset states when modal closes or current changes
  useEffect(() => {
    setCurrentMediaIndex(0);
    setZoomLevel(1);
    setZoomOrigin({ x: 50, y: 50 });
  }, [current, open]);

  // Skeleton Loading Component
  const GallerySkeleton = () => (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 [column-fill:_balance]">
      {[...Array(9)].map((_, index) => (
        <div
          key={index}
          className="mb-4 sm:mb-6 break-inside-avoid w-full animate-pulse"
        >
          <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-md">
            {/* Image Skeleton */}
            <div className="w-full aspect-[4/5] bg-border rounded-2xl"></div>

            {/* Content Skeleton */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4">
              <div className="space-y-2 w-full">
                <div className="h-4 bg-primary/30 rounded w-3/4"></div>
                <div className="h-3 bg-primary/20 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-background to-muted/20">
      <SEOHead
        title="Gallery — ACME Protection Services"
        description="Explore our comprehensive gallery featuring security events, professional training sessions, patrol operations, and team activities."
      />

      {/* Enhanced Header */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Image className="h-4 w-4" />
              Visual Showcase
            </div> */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Our <span className="text-primary">Security</span> Gallery
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Witness our commitment to excellence through events, training
              sessions, patrol operations, and team activities.
            </p>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mt-6"></div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Filters */}
      <section className="py-6 sm:py-10 sticky top-13 z-40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
          >
            {TAGS.map((tag) => {
              const Icon = TAG_ICONS[tag];
              return (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActive(tag)}
                  className={`relative cursor-pointer h-10 sm:h-11 px-4 sm:px-6 rounded-full border text-sm font-medium transition-all duration-300 flex items-center gap-2 group ${
                    active === tag
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                      : "bg-card text-muted-foreground hover:bg-card/80 hover:text-foreground border-border hover:border-primary/30"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      active === tag ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  {tag}
                  {active === tag && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-primary/20 -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Masonry Gallery */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <GallerySkeleton />
          ) : (
            <motion.div
              layout
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 [column-fill:_balance]"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((item, index) => (
                  <motion.figure
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    className="mb-4 sm:mb-6 break-inside-avoid w-full group cursor-pointer"
                  >
                    <div
                      onClick={() => {
                        setCurrent(item);
                        setOpen(true);
                      }}
                      className="relative block w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg hover:shadow-2xl transition-all duration-500 group"
                    >
                      {/* Media Container */}
                      <div className="relative overflow-hidden">
                        {/* Video Preview with Thumbnail */}
                        {item.type === "video" ? (
                          <div className="relative w-full aspect-[4/5] bg-black">
                            {/* Simple Video Element with First Frame Capture */}
                            <video
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              muted
                              playsInline
                              preload="metadata"
                              crossOrigin="anonymous"
                              onLoadedData={(e) => {
                                // Capture first frame when video loads
                                e.target.currentTime = 0.1;
                              }}
                              onSeeked={(e) => {
                                // Video is now showing the first frame
                                e.target.style.opacity = "1";
                              }}
                              onError={(e) => {
                                // Show fallback if video fails
                                e.target.style.display = "none";
                                const fallback = e.target.nextElementSibling;
                                if (fallback) fallback.style.display = "flex";
                              }}
                              style={{ opacity: 0 }}
                            >
                              <source
                                src={item.video || item.mediaFiles?.[0]}
                                type="video/mp4"
                              />
                              <source
                                src={item.video || item.mediaFiles?.[0]}
                                type="video/webm"
                              />
                              Your browser does not support the video tag.
                            </video>

                            {/* Fallback - Only shows if video fails */}
                            <div
                              className="absolute inset-0 hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
                              style={{ display: "none" }}
                            >
                              <div className="text-center text-white/70">
                                <PlayCircle className="h-12 w-12 mx-auto mb-2 opacity-60" />
                                <p className="text-xs">Video</p>
                              </div>
                            </div>

                            {/* Hover Video Player */}
                            <video
                              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              muted
                              loop
                              playsInline
                              preload="none"
                              onMouseEnter={(e) => {
                                e.target.play().catch(() => {
                                  // Auto-play failed, might need user interaction
                                  console.log("Auto-play failed");
                                });
                              }}
                              onMouseLeave={(e) => {
                                e.target.pause();
                                e.target.currentTime = 0;
                              }}
                            >
                              <source
                                src={item.video || item.mediaFiles?.[0]}
                                type="video/mp4"
                              />
                              <source
                                src={item.video || item.mediaFiles?.[0]}
                                type="video/webm"
                              />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : (
                          /* Image Preview */
                          <img
                            src={item.mediaFiles?.[0] || "/placeholder.svg"}
                            alt={item.caption}
                            loading="lazy"
                            className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                          />
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4 sm:p-6">
                          <div className="text-primary-foreground">
                            <h3 className="text-sm sm:text-base font-semibold mb-2 drop-shadow-lg">
                              {item.caption}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-primary-foreground/80">
                              <span className="bg-primary/20 px-2 py-1 rounded-full capitalize">
                                {item.tag}
                              </span>
                              <span>{item.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Type Indicator */}
                        {item.type === "video" && (
                          <>
                            <div className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded-lg shadow-lg">
                              Video
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-primary/20 backdrop-blur-sm text-white p-4 rounded-full transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-2xl">
                                <PlayCircle className="h-8 w-8 fill-white" />
                              </div>
                            </div>

                            {/* Video Duration Badge */}
                            {item.duration && (
                              <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-lg">
                                {item.duration}
                              </div>
                            )}
                          </>
                        )}

                        {/* Image Count for Multiple Images */}
                        {item.mediaFiles &&
                          item.mediaFiles.length > 1 &&
                          item.type !== "video" && (
                            <div className="absolute top-3 right-3 bg-background/90 text-foreground text-xs font-medium px-2 py-1 rounded-lg shadow-lg">
                              +{item.mediaFiles.length - 1}
                            </div>
                          )}
                      </div>
                    </div>
                  </motion.figure>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 sm:py-20"
            >
              <div className="max-w-md mx-auto">
                <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No items found
                </h3>
                <p className="text-muted-foreground mb-6">
                  No gallery items available for the selected category.
                </p>
                <button
                  onClick={() => setActive("All")}
                  className="inline-flex cursor-pointer items-center gap-2 text-primary hover:underline font-medium"
                >
                  View all gallery items
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Enhanced Modal with Controls */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full sm:max-w-6xl sm:max-h-[90vh] sm:rounded-3xl p-0 bg-background/95 backdrop-blur-lg border-border/20 shadow-2xl mx-auto overflow-hidden flex flex-col">
          {current && (
            <div className="flex flex-col h-full">
              {/* Header with Controls */}
              <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border/20 bg-background">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-foreground truncate max-w-xs">
                    {current.caption}
                  </h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full capitalize text-xs">
                    {current.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Zoom Controls - Only for images */}
                  {current.type === "image" && (
                    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                      <button
                        onClick={() => handleZoom(0.8)}
                        className="p-2 cursor-pointer hover:bg-background rounded-md transition-colors"
                        title="Zoom Out"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setZoomLevel(1);
                          setPanOffset({ x: 0, y: 0 });
                        }}
                        className="p-2 hover:bg-background rounded-md transition-colors text-xs"
                        title="Reset Zoom"
                      >
                        {Math.round(zoomLevel * 100)}%
                      </button>
                      <button
                        onClick={() => handleZoom(1.2)}
                        className="p-2 hover:bg-background cursor-pointer rounded-md transition-colors"
                        title="Zoom In"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 hover:bg-muted rounded-md transition-colors"
                    title="Close"
                  >
                    <X className="h-5 w-5 hidden" />
                  </button>
                </div>
              </div>

              {/* Media Display Area */}
              <div className="flex-1 min-h-0 relative bg-transparent flex items-center justify-center overflow-hidden">
                {/* Navigation Arrows - Show only for multiple media files */}
                {current.mediaFiles && current.mediaFiles.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevious}
                      className={`absolute left-4 z-20 cursor-pointer bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all transform hover:scale-110 ${
                        currentMediaIndex === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title="Previous"
                      disabled={currentMediaIndex === 0}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                      onClick={handleNext}
                      className={`absolute right-4 z-20 cursor-pointer bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all transform hover:scale-110 ${
                        currentMediaIndex === current.mediaFiles.length - 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title="Next"
                      disabled={
                        currentMediaIndex === current.mediaFiles.length - 1
                      }
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Media Container */}
                <div
                  className={`w-full h-full flex items-center justify-center ${
                    current.type === "image" && zoomLevel > 1
                      ? "overflow-auto cursor-grab active:cursor-grabbing"
                      : "overflow-hidden"
                  }`}
                  onWheel={
                    current.type === "image" ? handleWheelZoom : undefined
                  }
                  onMouseDown={
                    current.type === "image" ? handleMouseDown : undefined
                  }
                  ref={containerRef}
                >
                  {current.type === "video" ? (
                    <div className="w-full h-full max-w-full max-h-full rounded-lg overflow-hidden flex items-center justify-center bg-black">
                      {/* Video Player with Controls */}
                      <video
                        controls
                        autoPlay
                        className="w-full h-full max-w-full max-h-full object-contain"
                        poster={current.thumbnail || current.mediaFiles?.[0]}
                        onLoadStart={() => console.log("Video loading...")}
                        onError={(e) => console.error("Video error:", e)}
                      >
                        <source
                          src={current.video || current.mediaFiles?.[0]}
                          type="video/mp4"
                        />
                        <source
                          src={current.video || current.mediaFiles?.[0]}
                          type="video/webm"
                        />
                        Your browser does not support the video tag.
                      </video>

                      {/* Fallback if video doesn't load */}
                      {!current.video && !current.mediaFiles?.[0] && (
                        <div className="text-white text-center p-8">
                          <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p>Video not available</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Image with pan and zoom functionality
                    <motion.div
                      className="relative"
                      style={{
                        scale: zoomLevel,
                        x: panOffset.x,
                        y: panOffset.y,
                      }}
                      drag={zoomLevel > 1}
                      dragConstraints={{
                        left: -100 * (zoomLevel - 1),
                        right: 100 * (zoomLevel - 1),
                        top: -100 * (zoomLevel - 1),
                        bottom: 100 * (zoomLevel - 1),
                      }}
                      dragElastic={0.1}
                    >
                      <img
                        src={
                          current.mediaFiles?.[currentMediaIndex] ||
                          "/placeholder.svg"
                        }
                        alt={current.caption}
                        className="max-w-full max-h-full object-contain select-none"
                        draggable={false}
                        onLoad={() => console.log("Image loaded")}
                        onError={(e) => {
                          console.error("Image failed to load");
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                    </motion.div>
                  )}
                </div>

                {/* Media Counter */}
                {current.mediaFiles && current.mediaFiles.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-2 rounded-full text-sm z-20">
                    {currentMediaIndex + 1} / {current.mediaFiles.length}
                  </div>
                )}
              </div>

              {/* Footer with Info */}
              <div className="flex-shrink-0 p-4 bg-background border-t border-border/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-2">
                      {current.date && (
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="h-3 w-3" />
                          {current.date}
                        </span>
                      )}
                      {current.type === "video" && (
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Video className="h-3 w-3" />
                          Video
                        </span>
                      )}
                      {current.type === "image" && (
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Image className="h-3 w-3" />
                          Image • {Math.round(zoomLevel * 100)}%
                        </span>
                      )}
                    </div>
                    {current.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {current.description}
                      </p>
                    )}
                  </div>

                  {/* Additional Controls */}
                  <div className="flex items-center gap-2">
                    {/* Download Button */}
                    {current.type === "image" && (
                      <a
                        href={current.mediaFiles?.[currentMediaIndex]}
                        download={`${current.caption || "image"}.jpg`}
                        className="p-2 hover:bg-muted rounded-md transition-colors"
                        title="Download Image"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}

                    {/* Fullscreen Button */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-muted cursor-pointer rounded-md transition-colors"
                      title="Fullscreen"
                    >
                      {isFullscreen ? (
                        <Minimize className="h-4 w-4" />
                      ) : (
                        <Maximize className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
