// File: src/components/admin/components/Dialogs/WeProvideDialog.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Shield } from "lucide-react";
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
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newService.title.trim() || !newService.summary.trim() || !newService.slug.trim()) {
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
    });
    setImageFile(null);
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...newService.benefits];
    newBenefits[index] = value;
    setNewService({ ...newService, benefits: newBenefits });
  };

  const addBenefit = () => {
    if (newService.benefits.length < 10) {
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

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Add New Service
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                Service Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                placeholder="Personal Security Officer"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                This will be displayed as the main title
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary" className="flex items-center gap-2">
                Short Summary <span className="text-destructive">*</span>
              </Label>
              <Input
                id="summary"
                value={newService.summary}
                onChange={(e) => setNewService({ ...newService, summary: e.target.value })}
                placeholder="Professional personal security services"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Keep it short and descriptive
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="flex items-center gap-2">
                URL Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                value={newService.slug}
                onChange={(e) => setNewService({ ...newService, slug: e.target.value })}
                placeholder="personal-security"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Used in website URLs. Use lowercase and hyphens
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  Benefits
                  <Badge variant="outline" className="text-xs">
                    Optional
                  </Badge>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBenefit}
                  disabled={newService.benefits.length >= 10}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Benefit
                </Button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
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
                        className="h-10 w-10 flex-shrink-0 text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {newService.benefits.length >= 10 && (
                <p className="text-xs text-amber-600">Maximum 10 benefits allowed</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-image" className="flex items-center gap-2">
                Service Image
                <Badge variant="outline" className="text-xs">
                  Optional
                </Badge>
              </Label>
              <Input
                id="service-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP up to 5MB
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={resetForm}
          disabled={submitting}
        >
          Reset Form
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || !newService.title || !newService.summary || !newService.slug}
          className="bg-primary hover:bg-primary/90"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding Service...
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