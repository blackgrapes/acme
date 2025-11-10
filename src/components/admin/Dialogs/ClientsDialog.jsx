// File: src/components/admin/components/Dialogs/ClientsDialog.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Upload, Trash2, ImageIcon } from "lucide-react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ClientsDialog = ({ onSuccess, onError, uploadFile }) => {
  const [newClient, setNewClient] = useState({
    name: "",
    quote: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!newClient.name.trim()) {
      newErrors.name = "Client name is required";
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
      let logoUrl = "";
      if (logoFile) {
        logoUrl = await uploadFile(logoFile);
      }

      const clientData = {
        ...newClient,
        logo: logoUrl,
      };

      const response = await fetch("/api/frontend/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        onSuccess();
        resetForm();
      } else {
        throw new Error("Failed to add client");
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewClient({
      name: "",
      quote: "",
    });
    setLogoFile(null);
    setLogoPreview(null);
    setErrors({});
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        onError("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        onError("Image size should be less than 5MB");
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const isFormValid = newClient.name.trim() && !submitting;

  return (
    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Add Client
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Client Name */}
        <div className="space-y-2">
          <Label htmlFor="client-name" className="text-sm font-medium">
            Client Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="client-name"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            placeholder="ABC Corporation"
            className={errors.name ? 'border-destructive' : ''}
            disabled={submitting}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
          <p className="text-xs text-muted-foreground">
            The name of the client or company
          </p>
        </div>

        {/* Client Logo */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            Client Logo
            <Badge variant="outline" className="text-xs">
              Recommended
            </Badge>
          </Label>
          
          {logoPreview ? (
            <div className="space-y-2">
              <div className="border rounded-lg p-4 flex flex-col items-center">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-32 h-32 object-contain rounded"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {logoFile?.name}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeLogo}
                className="w-full text-destructive cursor-pointer justify-center"
                disabled={submitting}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remove Logo
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <div className="space-y-1">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('client-logo').click()}
                    className="gap-2 cursor-pointer"
                    disabled={submitting}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP up to 5MB. Square aspect ratio works best
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <Input
            id="client-logo"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
            disabled={submitting}
          />
        </div>

        {/* Testimonial Quote */}
        <div className="space-y-2">
          <Label htmlFor="client-quote" className="text-sm font-medium flex items-center gap-2">
            Testimonial Quote
            <Badge variant="outline" className="text-xs">
              Optional
            </Badge>
          </Label>
          <Input
            id="client-quote"
            value={newClient.quote}
            onChange={(e) => setNewClient({ ...newClient, quote: e.target.value })}
            placeholder="Excellent security services! Our team feels much safer now."
            disabled={submitting}
          />
          <p className="text-xs text-muted-foreground">
            Client testimonial or quote about your services
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
          className="flex-1 bg-primary hover:bg-primary/90 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding Client...
            </>
          ) : (
            'Add Client'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ClientsDialog;