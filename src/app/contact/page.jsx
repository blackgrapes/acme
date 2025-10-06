"use client";

import SEOHead from "@/components/SEOHead";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="container py-16  font-sans md:ml-2 md:p-16">
      <SEOHead
        title="Contact — ACME"
        description="Reach our team for quotes and support."
      />

      <h1 className="text-3xl font-extrabold mb-6">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-20">
        {/* Left: Contact Form */}
        <div className="rounded-2xl  p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
          <form className="grid gap-3">
            <input
              required
              className="h-11 rounded-md border px-3"
              placeholder="Name"
            />
            <input
              required
              type="email"
              className="h-11 rounded-md border px-3"
              placeholder="Email"
            />
            <input
              className="h-11 rounded-md border px-3"
              placeholder="Phone"
            />
            <textarea
              className="rounded-md border px-3 py-2"
              placeholder="Message"
              rows={4}
            />
            <button className="h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition">
              Send Message
            </button>
          </form>
        </div>

        {/* Right: Map + Contact Info */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl overflow-hidden ">
            <iframe
              title="ACME Map"
              src="https://www.google.com/maps?q=ACME+Protection+Services+Pvt.+Ltd,+Mumbai,+Maharashtra,+India&output=embed"
              width="100%"
              height="350"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>

          <div className="rounded-2xl p-6 shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-4">
              Our Location & Contact Info
            </h2>

            <div className="flex items-start gap-4 mb-3">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-sm text-muted-foreground">
                  ACME Protection Services Pvt. Ltd.
                  <br />
                  Dattani Tower, Mid Wing, Kore Kendra, Borivali (West), Mumbai,
                  Maharashtra 400092
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-3">
              <Phone className="h-6 w-6 text-primary mt-1" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-sm text-muted-foreground">
                  +91 123 456 7890
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary mt-1" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-muted-foreground">
                  contact@acmeprotection.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
