// File: src/components/admin/components/Dialogs/TestimonialsDialog.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Video, Upload, Trash2 } from "lucide-react";
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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!newTestimonial.quote.trim()) {
      newErrors.quote = "Quote is required";
    }

    if (!newTestimonial.author.trim()) {
      newErrors.author = "Author name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
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
    setErrors({});
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("video/")) {
        onError("Please select a valid video file");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        onError("Video size should be less than 50MB");
        return;
      }

      setVideoFile(file);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
  };

  const isFormValid = 
    newTestimonial.quote.trim() && 
    newTestimonial.author.trim() && 
    !submitting;

  return (
    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-primary" />
          Add Testimonial
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Quote */}
        <div className="space-y-2">
          <Label htmlFor="testimonial-quote" className="text-sm font-medium">
            Quote <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="testimonial-quote"
            value={newTestimonial.quote}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
            placeholder="Best security team we've worked with. Their professionalism and attention to detail is exceptional."
            rows={3}
            className={errors.quote ? 'border-destructive' : ''}
            disabled={submitting}
          />
          {errors.quote && (
            <p className="text-xs text-destructive">{errors.quote}</p>
          )}
          <p className="text-xs text-muted-foreground">
            What the client said about your services
          </p>
        </div>

        {/* Author Name */}
        <div className="space-y-2">
          <Label htmlFor="testimonial-author" className="text-sm font-medium">
            Author Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="testimonial-author"
            value={newTestimonial.author}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
            placeholder="John Doe"
            className={errors.author ? 'border-destructive' : ''}
            disabled={submitting}
          />
          {errors.author && (
            <p className="text-xs text-destructive">{errors.author}</p>
          )}
        </div>

        {/* Position and Company */}
        <div className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="testimonial-company" className="text-sm font-medium">
              Company
            </Label>
            <Input
              id="testimonial-company"
              value={newTestimonial.company}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
              placeholder="ABC Corporation"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Video Testimonial */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            Video Testimonial
            <Badge variant="outline" className="text-xs">
              Optional
            </Badge>
          </Label>
          
          {videoFile ? (
            <div className="space-y-2">
              <div className="border rounded-lg p-4 flex items-center gap-3">
                <Video className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{videoFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeVideo}
                className="w-full cursor-pointer text-destructive"
                disabled={submitting}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remove Video
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <Video className="h-8 w-8 text-gray-400" />
                <div className="space-y-1">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('testimonial-video').click()}
                    className="gap-2 cursor-pointer"
                    disabled={submitting}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Video
                  </Button>
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    MP4, MOV up to 50MB
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <Input
            id="testimonial-video"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="hidden"
            disabled={submitting}
          />
        </div>
      </div>

      <DialogFooter className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={submitting}
          className="flex-1 cursor-pointer"
        >
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="flex-1 bg-primary hover:bg-primary/90 cursor-pointer"
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