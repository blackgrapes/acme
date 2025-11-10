// File: src/components/admin/components/Dialogs/GalleryDialog.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, ImageIcon, Trash2, Upload } from "lucide-react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GalleryDialog = ({ onSuccess, onError, uploadFile }) => {
  const [newItem, setNewItem] = useState({
    tag: "",
    caption: "",
    type: "image",
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!newItem.caption.trim()) {
      newErrors.caption = "Caption is required";
    }

    if (!newItem.tag) {
      newErrors.tag = "Please select a tag";
    }

    if (mediaFiles.length === 0) {
      newErrors.mediaFiles = "Please select at least one media file";
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
      let uploadedUrls = [];
      for (const file of mediaFiles) {
        const url = await uploadFile(file);
        uploadedUrls.push(url);
      }

      const galleryData = {
        ...newItem,
        mediaFiles: uploadedUrls, // Changed back to mediaFiles as per working version
      };

      const response = await fetch("/api/frontend/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(galleryData),
      });

      if (response.ok) {
        onSuccess();
        resetForm();
      } else {
        throw new Error("Failed to add gallery item");
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewItem({
      tag: "",
      caption: "",
      type: "image",
    });
    setMediaFiles([]);
    setMediaPreviews([]);
    setErrors({});
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // File validation
    const maxSize = newItem.type === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    const validFiles = [];
    const previewPromises = [];

    files.forEach((file) => {
      // Type validation
      const isCorrectType = newItem.type === "image" 
        ? file.type.startsWith("image/")
        : file.type.startsWith("video/");
      
      // Size validation
      const isWithinSize = file.size <= maxSize;

      if (isCorrectType && isWithinSize) {
        validFiles.push(file);
        
        // Create preview for images
        if (newItem.type === "image") {
          const promise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                url: e.target.result,
                name: file.name,
                type: "image"
              });
            };
            reader.readAsDataURL(file);
          });
          previewPromises.push(promise);
        } else {
          // For videos, just show file info
          previewPromises.push(Promise.resolve({
            url: null,
            name: file.name,
            type: "video"
          }));
        }
      }
    });

    if (validFiles.length !== files.length) {
      onError(`Some files were skipped. Please select only ${newItem.type} files within size limits.`);
    }

    // Set files immediately
    setMediaFiles(validFiles);

    // Wait for all previews to load
    if (previewPromises.length > 0) {
      Promise.all(previewPromises).then(previews => {
        setMediaPreviews(previews);
      });
    } else {
      setMediaPreviews([]);
    }
  };

  const removeMediaFile = (index) => {
    const newFiles = [...mediaFiles];
    const newPreviews = [...mediaPreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setMediaFiles(newFiles);
    setMediaPreviews(newPreviews);
  };

  const handleMediaTypeChange = (value) => {
    setNewItem({
      ...newItem,
      type: value,
      tag: "",
    });
    setMediaFiles([]);
    setMediaPreviews([]);
  };

  const isFormValid =
    newItem.caption.trim() &&
    newItem.tag &&
    mediaFiles.length > 0 &&
    !submitting;

  return (
    <DialogContent className="max-w-md bg-white max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg">
          <ImageIcon className="h-5 w-5 text-primary" />
          Add Gallery Item
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Media Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Media Type</Label>
          <Select
            value={newItem.type}
            onValueChange={handleMediaTypeChange}
            disabled={submitting}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tag */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Tag <span className="text-destructive">*</span>
          </Label>
          <Select
            value={newItem.tag}
            onValueChange={(value) => setNewItem({ ...newItem, tag: value })}
            disabled={submitting}
          >
            <SelectTrigger className={errors.tag ? "border-destructive" : ""}>
              <SelectValue placeholder="Select tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="patrols">Patrols</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
            </SelectContent>
          </Select>
          {errors.tag && (
            <p className="text-xs text-destructive">{errors.tag}</p>
          )}
        </div>

        {/* Media Files Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              Media Files
              <Badge variant="outline" className="text-xs">
                Required
              </Badge>
            </Label>
            <span className="text-xs text-muted-foreground">
              {mediaFiles.length} selected
            </span>
          </div>

          {mediaFiles.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {mediaFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative border rounded-lg p-2 group"
                  >
                    {newItem.type === "video" ? (
                      <div className="flex flex-col items-center justify-center h-20 bg-muted rounded">
                        <VideoIcon className="h-6 w-6 text-muted-foreground" />
                        <p className="text-xs text-center mt-1 truncate w-full">
                          {file.name}
                        </p>
                      </div>
                    ) : (
                      mediaPreviews[index]?.url ? (
                        <img
                          src={mediaPreviews[index].url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-20 bg-muted rounded">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          <p className="text-xs text-center mt-1">Loading...</p>
                        </div>
                      )
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeMediaFile(index)}
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMediaFiles([]);
                  setMediaPreviews([]);
                }}
                className="w-full text-destructive cursor-pointer"
                disabled={submitting}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <div className="space-y-1">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("gallery-files").click()}
                    className="gap-2 cursor-pointer"
                    disabled={submitting}
                  >
                    <Upload className="h-4 w-4 cursor-pointer" />
                    Upload {newItem.type === "image" ? "Images" : "Videos"}
                  </Button>
                  <p className="text-xs text-gray-500">
                    {newItem.type === "image"
                      ? "PNG, JPG, WEBP up to 5MB each"
                      : "MP4, MOV up to 50MB each"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Input
            id="gallery-files"
            type="file"
            multiple
            accept={newItem.type === "image" ? "image/*" : "video/*"}
            onChange={handleFileChange}
            className="hidden cursor-pointer"
            disabled={submitting}
          />

          {errors.mediaFiles && (
            <p className="text-xs text-destructive">{errors.mediaFiles}</p>
          )}
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <Label htmlFor="caption" className="text-sm font-medium">
            Caption <span className="text-destructive">*</span>
          </Label>
          <Input
            id="caption"
            value={newItem.caption}
            onChange={(e) =>
              setNewItem({ ...newItem, caption: e.target.value })
            }
            placeholder="Security Training Session"
            className={errors.caption ? "border-destructive cursor-pointer" : "cursor-pointer"}
            disabled={submitting}
          />
          {errors.caption && (
            <p className="text-xs text-destructive">{errors.caption}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Brief description of the gallery item
          </p>
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
          className="flex-1 cursor-pointer bg-primary hover:bg-primary/90"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding Item...
            </>
          ) : (
            "Add Gallery Item"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

// Simple video icon component
const VideoIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

export default GalleryDialog;