"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, LifeBuoy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SupportView() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start gap-2">
                <h2 className="text-2xl font-bold tracking-tight">Support & Assistance</h2>
                <p className="text-muted-foreground">
                    Contact our support team for any queries or emergency assistance.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-accent/20 rounded-lg dashed border-2 border-muted">
                        <LifeBuoy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No support contacts available at the moment.</p>
                    </div>
                ) : (
                    contacts.map((contact) => (
                        <Card key={contact._id} className="relative group overflow-hidden border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
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
