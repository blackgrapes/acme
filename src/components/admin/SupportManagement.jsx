"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Phone, Mail, FileText, Plus, Edit, Trash2, Loader2, LifeBuoy } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export default function SupportManagement() {
    const { hasPermission } = useAuth();
    console.log("SupportManagement Debug:", {
        canCreate: hasPermission("support-create"),
        canUpdate: hasPermission("support-update"),
        canDelete: hasPermission("support-delete")
    });
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingContact, setEditingContact] = useState(null);

    const initialFormData = {
        name: "",
        description: "",
        phone1: "",
        phone2: "",
        email: "",
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/support");
            const data = await response.json();
            if (response.ok) {
                setContacts(data.data || []);
            } else {
                toast.error("Failed to load support contacts");
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
            toast.error("Error loading contacts");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingContact
                ? `/api/support/${editingContact._id}`
                : "/api/support";
            const method = editingContact ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(
                    editingContact
                        ? "Contact updated successfully"
                        : "Contact created successfully"
                );
                fetchContacts();
                setIsDialogOpen(false);
                resetForm();
            } else {
                toast.error(result.error || "Operation failed");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this contact?")) return;

        try {
            const response = await fetch(`/api/support/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Contact deleted successfully");
                fetchContacts();
            } else {
                toast.error("Failed to delete contact");
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            toast.error("Error deleting contact");
        }
    };

    const openEditDialog = (contact) => {
        setEditingContact(contact);
        setFormData({
            name: contact.name,
            description: contact.description,
            phone1: contact.phone1,
            phone2: contact.phone2 || "",
            email: contact.email || "",
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingContact(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Support Management</h2>
                    <p className="text-muted-foreground">
                        Manage support contact cards visible to clients.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    {hasPermission("support-create") && (
                        <DialogTrigger asChild>
                            <Button className="cursor-pointer">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Support Contact
                            </Button>
                        </DialogTrigger>
                    )}
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingContact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
                            <DialogDescription>
                                Fill in the details for the support card.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Technical Support"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Brief description of the service"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone1">Phone 1 *</Label>
                                    <Input
                                        id="phone1"
                                        name="phone1"
                                        value={formData.phone1}
                                        onChange={handleInputChange}
                                        placeholder="+91..."
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone2">Phone 2 (Optional)</Label>
                                    <Input
                                        id="phone2"
                                        name="phone2"
                                        value={formData.phone2}
                                        onChange={handleInputChange}
                                        placeholder="+91..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email (Optional)</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="support@example.com"
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingContact ? "Update Contact" : "Create Contact"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-accent/20 rounded-lg dashed border-2 border-muted">
                        <LifeBuoy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No support contacts found. Click "Add Support Contact" to create one.</p>
                    </div>
                ) : (
                    contacts.map((contact) => (
                        <Card key={contact._id} className="relative group overflow-hidden border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all">
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 p-1 rounded-md backdrop-blur-sm">
                                {hasPermission("support-update") && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-primary cursor-pointer"
                                        onClick={() => openEditDialog(contact)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                )}
                                {hasPermission("support-delete") && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                                        onClick={() => handleDelete(contact._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                                        <LifeBuoy className="h-5 w-5" />
                                    </div>
                                    {contact.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {contact.description}
                                </p>

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="h-4 w-4 text-primary shrink-0" />
                                        <span className="font-medium">{contact.phone1}</span>
                                    </div>
                                    {contact.phone2 && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="h-4 w-4 text-primary shrink-0" />
                                            <span className="font-medium">{contact.phone2}</span>
                                        </div>
                                    )}
                                    {contact.email && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="h-4 w-4 text-primary shrink-0" />
                                            <a href={`mailto:${contact.email}`} className="hover:underline text-foreground">
                                                {contact.email}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
