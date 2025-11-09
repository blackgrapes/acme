// File: src/components/admin/components/Dialogs/ClientsDialog.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users } from "lucide-react";
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
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newClient.name.trim()) {
      onError("Please fill in the client name");
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
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Add Client
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="client-name" className="flex items-center gap-2">
            Client Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="client-name"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            placeholder="ABC Corporation"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            The name of the client or company
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client-logo" className="flex items-center gap-2">
            Client Logo
            <Badge variant="outline" className="text-xs">
              Recommended
            </Badge>
          </Label>
          <Input
            id="client-logo"
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP up to 5MB. Square aspect ratio works best
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client-quote" className="flex items-center gap-2">
            Testimonial Quote
            <Badge variant="outline" className="text-xs">
              Optional
            </Badge>
          </Label>
          <Input
            id="client-quote"
            value={newClient.quote}
            onChange={(e) => setNewClient({ ...newClient, quote: e.target.value })}
            placeholder="Excellent security services!"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Client testimonial or quote about your services
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
          disabled={submitting || !newClient.name}
          className="bg-primary hover:bg-primary/90"
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