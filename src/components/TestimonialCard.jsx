"use client";

import { useState } from "react";
import { Star, Play, X, Volume2, VolumeX } from "lucide-react";

const TestimonialCard = ({ testimonial }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Check if it's a video testimonial
  const isVideoTestimonial = testimonial.videoUrl && testimonial.type === 'video';

  return (
    <>
      <div className="group relative rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Rating Stars - Show for both text and video testimonials */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className="h-4 w-4 fill-yellow-400 text-yellow-400" 
            />
          ))}
        </div>

        {/* Video Thumbnail or Text Content */}
        {isVideoTestimonial ? (
          <div className="flex-1">
            {/* Video Thumbnail */}
            <div 
              className="relative rounded-lg overflow-hidden mb-4 cursor-pointer group/video"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <video
                className="w-full h-48 object-cover group-hover/video:scale-105 transition-transform duration-300"
                poster={testimonial.thumbnail}
                muted
                loop
              >
                <source src={testimonial.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
                <div className="bg-primary/90 text-white p-4 rounded-full transform scale-90 group-hover/video:scale-100 transition-transform duration-300">
                  <Play className="h-6 w-6 fill-white" />
                </div>
              </div>
              
              {/* Video Badge */}
              <div className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
                Video
              </div>
            </div>

            {/* Quote (if available along with video) */}
            {testimonial.quote && (
              <p className="text-muted-foreground italic leading-relaxed mb-4 line-clamp-3">
                "{testimonial.quote}"
              </p>
            )}
          </div>
        ) : (
          /* Text Only Testimonial */
          <div className="flex-1">
            <p className="text-muted-foreground italic leading-relaxed mb-4">
              "{testimonial.quote}"
            </p>
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div>
            <span className="font-medium text-foreground text-sm block">
              {testimonial.author}
            </span>
            {testimonial.position && (
              <span className="text-xs text-muted-foreground">
                {testimonial.position}
              </span>
            )}
          </div>
          {testimonial.company && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {testimonial.company}
            </span>
          )}
        </div>

        {/* Click to play text for video testimonials */}
        {isVideoTestimonial && (
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="mt-3 text-xs text-primary hover:underline font-medium text-left"
          >
            Click to watch full testimonial
          </button>
        )}
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && isVideoTestimonial && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-foreground">
                  {testimonial.author}'s Testimonial
                </h3>
                {testimonial.company && (
                  <p className="text-sm text-muted-foreground">
                    {testimonial.company}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Mute/Unmute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                
                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsVideoModalOpen(false);
                    setIsMuted(true);
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="p-4">
              <video
                className="w-full rounded-lg"
                controls
                autoPlay
                muted={isMuted}
                poster={testimonial.thumbnail}
              >
                <source src={testimonial.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Quote below video (if available) */}
            {testimonial.quote && (
              <div className="p-4 border-t border-border">
                <p className="text-muted-foreground italic text-center">
                  "{testimonial.quote}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TestimonialCard;