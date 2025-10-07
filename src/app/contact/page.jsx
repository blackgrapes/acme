"use client";

import SEOHead from "@/components/SEOHead";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="font-sans">
      <SEOHead
        title="Contact — ACME"
        description="Reach our team for quotes and support."
      />

      {/* Hero Heading */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground">
            Contact <span className="text-primary">Us</span>
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Left: Contact Form */}
            <div className="rounded-2xl  border-border p-4 sm:p-6 shadow-sm bg-card">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-foreground">
                Send Us a Message
              </h2>
              <form className="grid gap-3 sm:gap-4">
                <input
                  required
                  className="h-11 rounded-md border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground"
                  placeholder="Name"
                />
                <input
                  required
                  type="email"
                  className="h-11 rounded-md border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground"
                  placeholder="Email"
                />
                <input
                  className="h-11 rounded-md border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground"
                  placeholder="Phone"
                />
                <textarea
                  className="rounded-md border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground min-h-[100px] sm:min-h-[120px]"
                  placeholder="Message"
                />
                <button
                  type="submit"
                  className="h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right: Map + Contact Info */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="rounded-2xl overflow-hidden shadow-sm">
                <iframe
                  title="ACME Map"
                  src="https://www.google.com/maps?q=ACME+Protection+Services+Pvt.+Ltd,+Mumbai,+Maharashtra,+India&output=embed"
                  className="w-full h-[250px] sm:h-[300px] md:h-[350px]"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="rounded-2xl p-4 sm:p-6 shadow-sm bg-card  border-border">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-foreground">
                  Our Location & Contact Info
                </h2>

                <div className="flex items-start gap-4 mb-3 sm:mb-4">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-sm text-secondary line-clamp-3">
                      ACME Protection Services Pvt. Ltd.
                      <br />
                      Dattani Tower, Mid Wing, Kore Kendra, Borivali (West),
                      Mumbai,
                      <br />
                      Maharashtra 400092
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-3 sm:mb-4">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-sm text-secondary">+91 123 456 7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-sm text-secondary">
                      contact@acmeprotection.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
