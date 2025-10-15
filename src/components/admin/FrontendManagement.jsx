// File: src/components/admin/FrontendManagement.jsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function FrontendManagement({
  currentCategory,
  dummyWeProvideServices,
  dummyGalleryItems,
  dummyFrontendClients,
  dummyTestimonials,
  frontendCategories,
  setActiveTab,
}) {
  const renderWeProvideContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Manage We Provide Services</CardTitle>
        <CardDescription>
          Full details for We Provide section, toggle on home.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyWeProvideServices.map((service) => (
            <div key={service.id} className="p-4 border rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{service.title}</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={service.showOnHome}
                    onChange={() => {
                      /* Toggle logic */
                    }}
                  />
                  <Label>Show on Frontend</Label>
                </div>
              </div>
              <p className="text-sm text-secondary">{service.summary}</p>
              <ul className="text-sm text-secondary space-y-1">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-1 flex-shrink-0">✓</span>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add We Provide Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add We Provide Service</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input placeholder="Title (e.g., Personal Security Officer)" />
                <Input placeholder="Summary" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input placeholder="Benefit 1" />
                  <Input placeholder="Benefit 2" />
                  <Input placeholder="Benefit 3" />
                </div>
                <Input type="file" accept="image/*" />
                <Input placeholder="Slug (e.g., pso)" />
                <Button type="submit">Add Service</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );

  const renderGalleryContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Manage Gallery</CardTitle>
        <CardDescription>
          Add images/videos with tags and toggle on home.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyGalleryItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div>
                <h3 className="font-medium">{item.caption}</h3>
                <p className="text-sm text-secondary">
                  Tag: {item.tag}, Type: {item.type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={item.showOnHome} />
                <Label>Show on Home</Label>
              </div>
            </div>
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Gallery Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Tag</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="patrols">Patrols</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Custom tag name (if Other selected)"
                    className="mt-1"
                  />
                </div>
                <Input type="file" accept="image/*,video/*" multiple />
                <Input placeholder="Caption" />
                <Button type="submit">Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );

  const renderClientsContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Manage Clients</CardTitle>
        <CardDescription>Edit clients and toggle on home.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyFrontendClients.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div>
                <h3 className="font-medium">{client.name || "Client Logo"}</h3>
                <p className="text-sm text-secondary">
                  {client.quote || "Past Client"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={client.showOnHome} />
                <Label>Show on Home</Label>
              </div>
            </div>
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Client</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input placeholder="Client Name" />
                <Input type="file" accept="image/*" />
                <Input placeholder="Quote (optional)" />
                <Button type="submit">Add Client</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );

  const renderTestimonialsContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Manage Testimonials</CardTitle>
        <CardDescription>Edit testimonials and toggle on home.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div>
                <p className="font-medium">"{testimonial.quote}"</p>
                <p className="text-sm text-secondary">{testimonial.author}</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={testimonial.showOnHome} />
                <Label>Show on Home</Label>
              </div>
            </div>
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Testimonial</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input placeholder="Quote" />
                <Input placeholder="Author" />
                <Input
                  type="file"
                  accept="video/*"
                  placeholder="Video (optional)"
                />
                <Button type="submit">Add Testimonial</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (!currentCategory) return null;

    switch (currentCategory.id) {
      case "weprovide":
        return renderWeProvideContent();
      case "gallery":
        return renderGalleryContent();
      case "clients":
        return renderClientsContent();
      case "testimonials":
        return renderTestimonialsContent();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Frontend Management
        </h2>
        <Select
          value={currentCategory.id}
          onValueChange={(value) => setActiveTab(`frontend-${value}`)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={currentCategory.name} />
          </SelectTrigger>
          <SelectContent>
            {frontendCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {renderContent()}
    </div>
  );
}
