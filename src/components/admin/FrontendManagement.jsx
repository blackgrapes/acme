"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  frontendTab,
  setFrontendTab,
  dummyWeProvideServices,
  dummyGalleryItems,
  dummyFrontendClients,
  dummyTestimonials,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
        Frontend Management
      </h2>
      <Tabs
        value={frontendTab}
        onValueChange={setFrontendTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 h-auto p-1 rounded-lg bg-card shadow-sm border">
          <TabsTrigger
            value="weprovide"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
          >
            We Provide
          </TabsTrigger>
          <TabsTrigger
            value="gallery"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
          >
            Gallery
          </TabsTrigger>
          <TabsTrigger
            value="clients"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
          >
            Clients
          </TabsTrigger>
          <TabsTrigger
            value="testimonials"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
          >
            Testimonials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weprovide" className="mt-0">
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
                  <div
                    key={service.id}
                    className="p-4 border rounded-md space-y-2"
                  >
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
                          <span className="text-primary mt-1 flex-shrink-0">
                            ✔
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Image: {service.img ? "Uploaded" : "No Image"}
                      </span>
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
        </TabsContent>

        <TabsContent value="gallery" className="mt-0">
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
        </TabsContent>

        <TabsContent value="clients" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Manage Clients</CardTitle>
              <CardDescription>
                Edit clients and toggle on home.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dummyFrontendClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div>
                      <h3 className="font-medium">
                        {client.name || "Client Logo"}
                      </h3>
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
        </TabsContent>

        <TabsContent value="testimonials" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Manage Testimonials</CardTitle>
              <CardDescription>
                Edit testimonials and toggle on home.
              </CardDescription>
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
                      <p className="text-sm text-secondary">
                        {testimonial.author}
                      </p>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
