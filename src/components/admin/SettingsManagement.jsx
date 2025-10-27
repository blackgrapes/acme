"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  Mail,
  AlertTriangle,
  Database,
  Palette,
  Plus,
  Minus,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

// Frontend Categories
const FRONTEND_CATEGORIES = [
  { id: "weprovide", name: "We Provide" },
  { id: "gallery", name: "Gallery" },
  { id: "clients", name: "Clients" },
  { id: "testimonials", name: "Testimonials" },
];

export default function SettingsManagement({
  companyInfo,
  securitySettings,
  notificationSettings,
  emailSettings,
}) {
  const [currentFrontendCategory, setCurrentFrontendCategory] = useState(
    FRONTEND_CATEGORIES[0]
  );

  // State for frontend data
  const [weProvideServices, setWeProvideServices] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data when category changes
  useEffect(() => {
    loadFrontendData();
  }, [currentFrontendCategory]);

  const loadFrontendData = async () => {
    setLoading(true);
    try {
      const endpoint = `/api/frontend/${currentFrontendCategory.id}`;
      const response = await fetch(endpoint);

      if (response.ok) {
        const data = await response.json();
        switch (currentFrontendCategory.id) {
          case "weprovide":
            setWeProvideServices(data);
            break;
          case "gallery":
            setGalleryItems(data);
            break;
          case "clients":
            setClients(data);
            break;
          case "testimonials":
            setTestimonials(data);
            break;
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Common upload function
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      return result.fileUrl;
    } catch (error) {
      throw new Error("File upload failed");
    }
  };

  // Common toggle function
  const handleToggleVisibility = async (endpoint, id, currentStatus) => {
    try {
      const response = await fetch(`/api/frontend/${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showOnHome: !currentStatus }),
      });

      if (response.ok) {
        toast({ title: "Success", description: "Visibility updated" });
        loadFrontendData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive",
      });
    }
  };

  // Common delete function
  const handleDeleteItem = async (endpoint, id, itemName) => {
    if (!confirm(`Are you sure you want to delete this ${itemName}?`)) return;

    try {
      const response = await fetch(`/api/frontend/${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({ title: "Success", description: `${itemName} deleted` });
        loadFrontendData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${itemName}`,
        variant: "destructive",
      });
    }
  };

  // We Provide Services Management
  const WeProvideContent = () => {
    const [benefits, setBenefits] = useState([""]);
    const [newService, setNewService] = useState({
      title: "",
      summary: "",
      benefits: [],
      slug: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddService = async () => {
      try {
        let imageUrl = "";
        if (imageFile) {
          imageUrl = await uploadFile(imageFile);
        }

        const serviceData = {
          ...newService,
          benefits: benefits.filter((b) => b.trim() !== ""),
          img: imageUrl,
        };

        const response = await fetch("/api/frontend/weprovide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Service added successfully",
          });
          setIsDialogOpen(false);
          resetForm();
          loadFrontendData();
        } else {
          throw new Error("Failed to add service");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    const resetForm = () => {
      setNewService({ title: "", summary: "", benefits: [], slug: "" });
      setBenefits([""]);
      setImageFile(null);
    };

    const addBenefit = () => setBenefits([...benefits, ""]);
    const removeBenefit = (index) => {
      if (benefits.length > 1) {
        setBenefits(benefits.filter((_, i) => i !== index));
      }
    };
    const updateBenefit = (index, value) => {
      const newBenefits = [...benefits];
      newBenefits[index] = value;
      setBenefits(newBenefits);
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>We Provide Services</CardTitle>
            <CardDescription>
              Manage services displayed on the frontend
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Service Title</Label>
                  <Input
                    placeholder="Personal Security Officer"
                    value={newService.title}
                    onChange={(e) =>
                      setNewService({ ...newService, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Summary</Label>
                  <Input
                    placeholder="Professional personal security for high-profile individuals"
                    value={newService.summary}
                    onChange={(e) =>
                      setNewService({ ...newService, summary: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Benefits</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addBenefit}
                      className="h-8"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Benefit
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Benefit ${index + 1}`}
                          value={benefit}
                          onChange={(e) => updateBenefit(index, e.target.value)}
                        />
                        {benefits.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeBenefit(index)}
                            className="h-10 w-10 flex-shrink-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Service Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    placeholder="pso"
                    value={newService.slug}
                    onChange={(e) =>
                      setNewService({ ...newService, slug: e.target.value })
                    }
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleAddService}>Add Service</Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {weProvideServices.map((service) => (
                <div
                  key={service._id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{service.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          service.showOnHome
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {service.showOnHome ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={service.showOnHome}
                        onCheckedChange={() =>
                          handleToggleVisibility(
                            "weprovide",
                            service._id,
                            service.showOnHome
                          )
                        }
                        className="data-[state=checked]:bg-primary"
                      />
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDeleteItem("weprovide", service._id, "service")
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {service.summary}
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">
                          ✓
                        </span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Image: {service.img ? "Uploaded" : "No Image"}</span>
                    <span>Slug: {service.slug}</span>
                  </div>
                </div>
              ))}
              {weProvideServices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No services added yet
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Gallery Management
  const GalleryContent = () => {
    const [newItem, setNewItem] = useState({
      tag: "",
      caption: "",
      type: "image",
    });
    const [mediaFiles, setMediaFiles] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddGalleryItem = async () => {
      try {
        let uploadedUrls = [];

        // Upload all files
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
          toast({
            title: "Success",
            description: "Gallery item added successfully",
          });
          setIsDialogOpen(false);
          resetForm();
          loadFrontendData();
        } else {
          throw new Error("Failed to add gallery item");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    const resetForm = () => {
      setNewItem({ tag: "", caption: "", type: "image" });
      setMediaFiles([]);
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gallery Management</CardTitle>
            <CardDescription>
              Manage images and videos in the gallery
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Gallery Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tag</Label>
                  <Select
                    value={newItem.tag}
                    onValueChange={(value) =>
                      setNewItem({ ...newItem, tag: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="patrols">Patrols</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Media Type</Label>
                  <Select
                    value={newItem.type}
                    onValueChange={(value) =>
                      setNewItem({ ...newItem, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Media Files</Label>
                  <Input
                    type="file"
                    accept={newItem.type === "image" ? "image/*" : "video/*"}
                    multiple
                    onChange={(e) => setMediaFiles(Array.from(e.target.files))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Caption</Label>
                  <Input
                    placeholder="Security Training Session"
                    value={newItem.caption}
                    onChange={(e) =>
                      setNewItem({ ...newItem, caption: e.target.value })
                    }
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleAddGalleryItem}>Add Item</Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {galleryItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{item.caption}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.showOnHome
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.showOnHome ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Type: {item.type} • Tag: {item.tag}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Files: {item.mediaFiles?.length || 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.showOnHome}
                      onCheckedChange={() =>
                        handleToggleVisibility(
                          "gallery",
                          item._id,
                          item.showOnHome
                        )
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDeleteItem("gallery", item._id, "gallery item")
                      }
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {galleryItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No gallery items added yet
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Clients Management
  const ClientsContent = () => {
    const [newClient, setNewClient] = useState({
      name: "",
      quote: "",
    });
    const [logoFile, setLogoFile] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddClient = async () => {
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
          toast({
            title: "Success",
            description: "Client added successfully",
          });
          setIsDialogOpen(false);
          resetForm();
          loadFrontendData();
        } else {
          throw new Error("Failed to add client");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    const resetForm = () => {
      setNewClient({ name: "", quote: "" });
      setLogoFile(null);
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Client Management</CardTitle>
            <CardDescription>
              Manage client logos and testimonials
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Client</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Client Name</Label>
                  <Input
                    placeholder="ABC Corporation"
                    value={newClient.name}
                    onChange={(e) =>
                      setNewClient({ ...newClient, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Client Logo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quote (Optional)</Label>
                  <Input
                    placeholder="Excellent security services!"
                    value={newClient.quote}
                    onChange={(e) =>
                      setNewClient({ ...newClient, quote: e.target.value })
                    }
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleAddClient}>Add Client</Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {clients.map((client) => (
                <div
                  key={client._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{client.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          client.showOnHome
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {client.showOnHome ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    {client.quote && (
                      <p className="text-sm text-muted-foreground mt-1">
                        "{client.quote}"
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Logo: {client.logo ? "Uploaded" : "No Logo"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={client.showOnHome}
                      onCheckedChange={() =>
                        handleToggleVisibility(
                          "clients",
                          client._id,
                          client.showOnHome
                        )
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDeleteItem("clients", client._id, "client")
                      }
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {clients.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No clients added yet
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Testimonials Management
  // Testimonials Management
  const TestimonialsContent = () => {
    const [newTestimonial, setNewTestimonial] = useState({
      quote: "",
      author: "",
    });
    const [videoFile, setVideoFile] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddTestimonial = async () => {
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
          toast({
            title: "Success",
            description: "Testimonial added successfully",
          });
          setIsDialogOpen(false);
          resetForm();
          loadFrontendData();
        } else {
          throw new Error("Failed to add testimonial");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    const resetForm = () => {
      setNewTestimonial({ quote: "", author: "" });
      setVideoFile(null);
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>
              Manage customer testimonials and reviews
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Testimonial</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Quote</Label>
                  <Input
                    placeholder="Best security team we've worked with"
                    value={newTestimonial.quote}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        quote: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input
                    placeholder="John D."
                    value={newTestimonial.author}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        author: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Video (Optional)</Label>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleAddTestimonial}>
                    Add Testimonial
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">"{testimonial.quote}"</p>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          testimonial.showOnHome
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {testimonial.showOnHome ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      - {testimonial.author}
                    </p>
                    {testimonial.video && (
                      <p className="text-xs text-muted-foreground">
                        Video: Available
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={testimonial.showOnHome}
                      onCheckedChange={() =>
                        handleToggleVisibility(
                          "testimonials",
                          testimonial._id,
                          testimonial.showOnHome
                        )
                      }
                      className="data-[state=checked]:bg-primary"
                    />
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDeleteItem(
                          "testimonials",
                          testimonial._id,
                          "testimonial"
                        )
                      }
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No testimonials added yet
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderFrontendContent = () => {
    if (!currentFrontendCategory) return null;

    switch (currentFrontendCategory.id) {
      case "weprovide":
        return <WeProvideContent />;
      case "gallery":
        return <GalleryContent />;
      case "clients":
        return <ClientsContent />;
      case "testimonials":
        return <TestimonialsContent />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            System Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure your admin panel preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto p-1 rounded-xl bg-card shadow-lg border-0">
          <TabsTrigger
            value="company"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg shadow-md flex flex-col items-center py-3 px-4 transition-all duration-200 group"
          >
            <div className="mb-1">
              <Database className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium group-data-[state=active]:text-primary-foreground">
              Company
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg shadow-md flex flex-col items-center py-3 px-4 transition-all duration-200 group"
          >
            <div className="mb-1">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium group-data-[state=active]:text-primary-foreground">
              Security
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg shadow-md flex flex-col items-center py-3 px-4 transition-all duration-200 group"
          >
            <div className="mb-1">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium group-data-[state=active]:text-primary-foreground">
              Notifications
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg shadow-md flex flex-col items-center py-3 px-4 transition-all duration-200 group"
          >
            <div className="mb-1">
              <Mail className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium group-data-[state=active]:text-primary-foreground">
              Email
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="frontend"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg shadow-md flex flex-col items-center py-3 px-4 transition-all duration-200 group"
          >
            <div className="mb-1">
              <Palette className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium group-data-[state=active]:text-primary-foreground">
              Frontend
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Company Info Tab */}
        <TabsContent value="company" className="mt-0">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Update your company details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    defaultValue={companyInfo.name}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Email Address</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    defaultValue={companyInfo.email}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Phone Number</Label>
                  <Input
                    id="companyPhone"
                    defaultValue={companyInfo.phone}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <Textarea
                    id="companyAddress"
                    defaultValue={companyInfo.address}
                    rows={3}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <Button className="shadow-lg px-8 h-10">Save Company Info</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="mt-0">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="space-y-1">
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable 2FA for all admin accounts
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactor}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="space-y-1">
                    <h3 className="font-medium">Session Timeout</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatic logout after inactivity
                    </p>
                  </div>
                  <Select
                    defaultValue={securitySettings.sessionTimeout.toString()}
                  >
                    <SelectTrigger className="w-[100px] h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="space-y-1">
                    <h3 className="font-medium">Failed Login Attempts</h3>
                    <p className="text-sm text-muted-foreground">
                      Maximum attempts before lockout
                    </p>
                  </div>
                  <Input
                    type="number"
                    defaultValue={securitySettings.loginAttempts}
                    className="w-[80px] h-10 text-right"
                  />
                </div>
              </div>
              <Button className="shadow-lg px-8 h-10">
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-0">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification preferences and recipients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="space-y-1">
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive email alerts for critical events
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailAlerts}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="space-y-1">
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive SMS alerts for urgent matters
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsAlerts}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Notification Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    defaultValue={notificationSettings.adminEmail}
                    className="h-10"
                  />
                </div>
              </div>
              <Button className="shadow-lg px-8 h-10">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email" className="mt-0">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure SMTP settings for system emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    defaultValue={emailSettings.smtpHost}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    defaultValue={emailSettings.smtpPort}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    defaultValue={emailSettings.username}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-10"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-xl">
                <div className="space-y-1">
                  <h3 className="font-medium">Use SSL/TLS</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure connection for email sending
                  </p>
                </div>
                <Switch
                  checked={emailSettings.useSSL}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              <Button className="shadow-lg px-8 h-10">
                Test Email Configuration
              </Button>
              <Button variant="outline" className="shadow-lg px-8 h-10">
                Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Frontend Tab */}
        <TabsContent value="frontend" className="mt-0">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Frontend Management
              </CardTitle>
              <CardDescription>
                Manage your frontend content sections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Frontend Management
                </h2>
                <Select
                  value={currentFrontendCategory.id}
                  onValueChange={(value) =>
                    setCurrentFrontendCategory(
                      FRONTEND_CATEGORIES.find((c) => c.id === value)
                    )
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={currentFrontendCategory.name} />
                  </SelectTrigger>
                  <SelectContent>
                    {FRONTEND_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {renderFrontendContent()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}