// File: src/components/admin/components/Dialogs/WeProvideDialog.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Shield, Upload, ImageIcon } from "lucide-react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const WeProvideDialog = ({ onSuccess, onError, uploadFile }) => {
  const [newService, setNewService] = useState({
    title: "",
    summary: "",
    benefits: [""],
    slug: "",
    order: 0,
    showOnHome: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!newService.title.trim()) {
      newErrors.title = "Service title is required";
    }

    if (!newService.summary.trim()) {
      newErrors.summary = "Summary is required";
    }

    if (!newService.slug.trim()) {
      newErrors.slug = "URL slug is required";
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
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadFile(imageFile);
      }

      const serviceData = {
        ...newService,
        benefits: newService.benefits.filter((b) => b.trim() !== ""),
        img: imageUrl,
        order: parseInt(newService.order) || 0,
      };

      const response = await fetch("/api/frontend/weprovide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (response.ok) {
        onSuccess();
        resetForm();
      } else {
        throw new Error("Failed to add service");
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewService({
      title: "",
      summary: "",
      benefits: [""],
      slug: "",
      order: 0,
      showOnHome: true
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...newService.benefits];
    newBenefits[index] = value;
    setNewService({ ...newService, benefits: newBenefits });
  };

  const addBenefit = () => {
    if (newService.benefits.length < 5) {
      setNewService({
        ...newService,
        benefits: [...newService.benefits, ""],
      });
    }
  };

  const removeBenefit = (index) => {
    if (newService.benefits.length > 1) {
      setNewService({
        ...newService,
        benefits: newService.benefits.filter((_, i) => i !== index),
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const generateSlug = () => {
    if (newService.title && !newService.slug) {
      const slug = newService.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setNewService({ ...newService, slug });
    }
  };

  return (
    <DialogContent className="max-w-md bg-white max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-primary" />
          Add New Service
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Service Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Service Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={newService.title}
            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
            onBlur={generateSlug}
            placeholder="Personal Security Officer"
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title}</p>
          )}
        </div>

        {/* Service Summary */}
        <div className="space-y-2">
          <Label htmlFor="summary" className="text-sm font-medium">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="summary"
            value={newService.summary}
            onChange={(e) => setNewService({ ...newService, summary: e.target.value })}
            placeholder="Describe your service..."
            rows={3}
            className={errors.summary ? 'border-destructive' : ''}
          />
          {errors.summary && (
            <p className="text-xs text-destructive">{errors.summary}</p>
          )}
        </div>

        {/* URL Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-sm font-medium">
            URL Slug <span className="text-destructive">*</span>
          </Label>
          <Input
            id="slug"
            value={newService.slug}
            onChange={(e) => setNewService({ ...newService, slug: e.target.value })}
            placeholder="personal-security"
            className={errors.slug ? 'border-destructive' : ''}
          />
          {errors.slug && (
            <p className="text-xs text-destructive">{errors.slug}</p>
          )}
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Benefits (Optional)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBenefit}
              disabled={newService.benefits.length >= 5}
              className="h-7 text-xs cursor-pointer"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {newService.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  placeholder={`Benefit ${index + 1}`}
                  className="flex-1"
                />
                {newService.benefits.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeBenefit(index)}
                    className="h-9 w-9 p-0 cursor-pointer text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Service Image */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Service Image (Optional)</Label>
          {imagePreview ? (
            <div className="space-y-2">
              <div className="border rounded-lg p-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeImage}
                className="w-full text-destructive"
              >
                <Trash2 className="h-3 w-3 cursor-pointer mr-1" />
                Remove Image
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <ImageIcon className="h-6 w-6 text-gray-400" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('service-image').click()}
                  className="gap-1 cursor-pointer"
                >
                  <Upload className="h-3 w-3 cursor-pointer" />
                  Upload Image
                </Button>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>
          )}
          <Input
            id="service-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Display Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="order" className="text-sm font-medium">
              Display Order
            </Label>
            <Input
              id="order"
              type="number"
              min="0"
              value={newService.order}
              onChange={(e) => setNewService({ ...newService, order: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Visibility</Label>
            <div className="flex items-center gap-2 p-2 border rounded-lg">
              <input
                type="checkbox"
                id="showOnHome"
                checked={newService.showOnHome}
                onChange={(e) => setNewService({ ...newService, showOnHome: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="showOnHome" className="text-sm">
                Show on Homepage
              </Label>
            </div>
          </div>
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
          disabled={submitting || !newService.title || !newService.summary || !newService.slug}
          className="flex-1 bg-primary hover:bg-primary/90 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Service'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default WeProvideDialog;