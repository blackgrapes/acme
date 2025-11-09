// File: src/components/admin/components/Dialogs/GalleryDialog.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, ImageIcon } from "lucide-react";
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
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newItem.caption.trim()) {
      onError("Please fill in the caption field");
      return;
    }

    if (mediaFiles.length === 0) {
      onError("Please select at least one media file");
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
        mediaFiles: uploadedUrls,
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
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types based on selected media type
    const validFiles = files.filter(file => {
      if (newItem.type === "image") {
        return file.type.startsWith("image/");
      } else if (newItem.type === "video") {
        return file.type.startsWith("video/");
      }
      return false;
    });

    if (validFiles.length !== files.length) {
      onError(`Some files were skipped. Please select only ${newItem.type} files.`);
    }

    setMediaFiles(validFiles);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Add Gallery Item
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Media Type</Label>
          <Select
            value={newItem.type}
            onValueChange={(value) => setNewItem({ ...newItem, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tag</Label>
          <Select
            value={newItem.tag}
            onValueChange={(value) => setNewItem({ ...newItem, tag: value })}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="gallery-files" className="flex items-center gap-2">
            Media Files
            <Badge variant="outline" className="text-xs">
              Required
            </Badge>
          </Label>
          <Input
            id="gallery-files"
            type="file"
            multiple
            accept={newItem.type === "image" ? "image/*" : "video/*"}
            onChange={handleFileChange}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            {mediaFiles.length} file(s) selected
            {newItem.type === "image" && " - PNG, JPG, WEBP up to 5MB each"}
            {newItem.type === "video" && " - MP4, MOV up to 50MB each"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caption" className="flex items-center gap-2">
            Caption <span className="text-destructive">*</span>
          </Label>
          <Input
            id="caption"
            value={newItem.caption}
            onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
            placeholder="Security Training Session"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Brief description of the gallery item
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
          disabled={submitting || !newItem.caption || mediaFiles.length === 0}
          className="bg-primary hover:bg-primary/90"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding Item...
            </>
          ) : (
            'Add Gallery Item'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default GalleryDialog;