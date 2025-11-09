// File: src/components/admin/components/Dialogs/TestimonialsDialog.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Video } from "lucide-react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const TestimonialsDialog = ({ onSuccess, onError, uploadFile }) => {
  const [newTestimonial, setNewTestimonial] = useState({
    quote: "",
    author: "",
    position: "",
    company: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newTestimonial.quote.trim() || !newTestimonial.author.trim()) {
      onError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      let videoUrl = "";
      if (videoFile) {
        videoUrl = await uploadFile(videoFile);
      }

      const testimonialData = {
        ...newTestimonial,
        video: videoUrl,
      };

      const response = await fetch("/api/frontend/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialData),
      });

      if (response.ok) {
        onSuccess();
        resetForm();
      } else {
        throw new Error("Failed to add testimonial");
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewTestimonial({
      quote: "",
      author: "",
      position: "",
      company: "",
    });
    setVideoFile(null);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Add Testimonial
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="testimonial-quote" className="flex items-center gap-2">
            Quote <span className="text-destructive">*</span>
          </Label>
          <Input
            id="testimonial-quote"
            value={newTestimonial.quote}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
            placeholder="Best security team we've worked with"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            What the client said about your services
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="testimonial-author" className="flex items-center gap-2">
            Author Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="testimonial-author"
            value={newTestimonial.author}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
            placeholder="John D."
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="testimonial-position" className="flex items-center gap-2">
              Position
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
            </Label>
            <Input
              id="testimonial-position"
              value={newTestimonial.position}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, position: e.target.value })}
              placeholder="Security Manager"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonial-company" className="flex items-center gap-2">
              Company
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
            </Label>
            <Input
              id="testimonial-company"
              value={newTestimonial.company}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
              placeholder="ABC Corporation"
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="testimonial-video" className="flex items-center gap-2">
            Video Testimonial
            <Badge variant="outline" className="text-xs">
              Optional
            </Badge>
          </Label>
          <Input
            id="testimonial-video"
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Video className="h-3 w-3" />
            MP4, MOV up to 50MB
          </p>
        </div>
      </div>

      <DialogFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={resetForm}
          disabled={submitting}
        >
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || !newTestimonial.quote || !newTestimonial.author}
          className="bg-primary hover:bg-primary/90"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding Testimonial...
            </>
          ) : (
            'Add Testimonial'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default TestimonialsDialog;