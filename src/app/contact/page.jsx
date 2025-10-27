"use client";

import SEOHead from "@/components/SEOHead";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          message: "",
        });
        showAlert(
          "✅ Thank you! Your message has been sent successfully. We'll get back to you soon.",
          "success"
        );
      } else {
        showAlert(
          `❌ Failed to submit: ${result.error || "Please try again."}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert(
        "❌ Network error. Please check your connection and try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans">
      <SEOHead
        title="Contact — ACME"
        description="Reach our team for quotes and support."
      />

      {/* Alert Message */}
      {alertMessage && (
        <div className="container mx-auto px-4 mb-6">
          <div
            className={`${
              alertType === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            } rounded-2xl p-4 text-center`}
          >
            <p className="font-medium">{alertMessage}</p>
          </div>
        </div>
      )}

      {/* Hero Heading */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-secondary max-w-2xl mx-auto">
            Get in touch with our security experts for personalized solutions
            and immediate assistance.
          </p>
          <div className="w-20 sm:w-24 h-1 bg-primary mx-auto mt-4 sm:mt-6 rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Left: Contact Form */}
            <div className="rounded-2xl border-border p-4 sm:p-6 shadow-sm bg-card">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-foreground">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="grid gap-3 sm:gap-4">
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="h-11 rounded-md border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="Full Name *"
                />
                <input
                  name="email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11 rounded-md border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="Email Address *"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-11 rounded-md border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="Phone Number"
                />
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="h-11 rounded-md border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="Company Name"
                />
                <input
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="h-11 rounded-md border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="Subject *"
                />
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="rounded-md border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground min-h-[100px] sm:min-h-[120px] focus:border-primary focus:outline-none transition-colors"
                  placeholder="Your Message *"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Message"}
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

              <div className="rounded-2xl p-4 sm:p-6 shadow-sm bg-card border-border">
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
