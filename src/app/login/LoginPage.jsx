"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [emailMethod, setEmailMethod] = useState(null); // 'email' or 'fallback'

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting login for:", email);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }

      if (!data.token) {
        console.error(" No token in response!");
        toast({
          title: "Login Error",
          description: "Authentication token missing",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("authToken", data.token);
      console.log("Token saved to localStorage");
       localStorage.setItem("userData", JSON.stringify({
      ...data.user,
      role: data.role, // Ensure role is included
      permissions: data.permissions // Include permissions if needed
    }));

        window.dispatchEvent(new Event('authChange'));
      toast({
        title: "Login Successful",
        description: `Welcome ${data.user.name || data.user.email}!`,
      });
      // If server didn't return permissions (or empty), call verify endpoint to get authoritative permissions
      let permissions = data.permissions || [];
      if (!permissions || permissions.length === 0) {
        try {
          const verifyRes = await fetch("/api/auth/verify", {
            method: "GET",
            credentials: "include",
          });
          if (verifyRes.ok) {
            const verified = await verifyRes.json();
            permissions = verified.permissions || permissions;
            // update localStorage userData with verified permissions
            localStorage.setItem(
              "userData",
              JSON.stringify({ ...(verified || {}), role: verified.role })
            );
          }
        } catch (err) {
          console.warn("Verify call failed:", err);
        }
      }

      let redirectPath = "/";
      const redirectTo = searchParams.get("redirect");

      const chooseRedirectFromPermissions = (perms = []) => {
        if (!perms || perms.length === 0) return "/";
        if (perms.includes("dashboard-read")) return "/admin-dashboard";
        if (perms.includes("client-dashboard-read")) return "/client-dashboard";

        const mapping = {
          "clients-read": "/admin-dashboard/clients",
          "documents-read": "/admin-dashboard/documents",
          "requests-read": "/admin-dashboard/requests",
          "guards-read": "/admin-dashboard/guards",
          "roles-read": "/admin-dashboard/roles",
          "contact-read": "/admin-dashboard/contact",
          "settings-read": "/admin-dashboard/settings",
        };

        for (const p of perms) {
          if (p.endsWith("-read") && mapping[p]) return mapping[p];
        }
        return "/";
      };

      if (redirectTo) {
        redirectPath = redirectTo;
      } else {
        redirectPath = chooseRedirectFromPermissions(permissions || []);
      }

      console.log("Redirecting to:", redirectPath);
      router.replace(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Network Error",
        description: "Unable to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    // RESET emailMethod BEFORE making new request
    setEmailMethod(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to process your request",
          variant: "destructive",
        });
        return;
      }

      setEmailMethod(data.method);

      if (data.method === "email") {
        toast({
          title: "Email Sent",
          description:
            data.message || "Password reset link has been sent to your email.",
        });
      } else {
        toast({
          title: "Request Submitted",
          description:
            data.message ||
            "Your request has been recorded. Admin will contact you shortly.",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast({
        title: "Network Error",
        description: "Unable to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md border border-[hsl(var(--border))]/30 bg-[hsl(var(--background)/0.8)]">
        {/* Left Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-linear-to-tr from-[hsl(var(--primary))] ">
          <Shield className="w-16 h-16 mb-5" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Welcome to Your Panel
          </h1>
          <p className="max-w-md  text-sm md:text-base leading-relaxed">
            Manage everything in one place. Secure, smart, and beautifully
            designed dashboard system for your organization.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-[hsl(var(--background)/0.7)]">
          <Card className="w-full max-w-sm md:max-w-md bg-[hsl(var(--card)/0.85)] backdrop-blur-md border border-[hsl(var(--border)/0.3)] shadow-lg rounded-2xl">
            {/* Header */}
            <CardHeader className="text-center space-y-2 pt-6">
              <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
                {isForgot ? "Forgot Password" : "Sign In"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {isForgot
                  ? "Enter your email to receive a reset link."
                  : "Access your dashboard securely."}
              </p>
            </CardHeader>

            {/* Content */}
            <CardContent className="px-6 pb-8 space-y-6">
              {/* Success Messages */}
              {emailMethod === "email" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    Password reset link sent to your email. Check your inbox.
                  </p>
                </div>
              )}

              {emailMethod === "fallback" && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        Request Submitted
                      </p>
                      <p className="text-xs text-blue-600">
                        Your password reset request has been sent to admin.
                        You'll be contacted shortly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form
                onSubmit={isForgot ? handleForgotPassword : handleSubmit}
                className="space-y-5"
              >
                {/* Email */}
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Email
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-2.5 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 bg-[hsl(var(--accent)/0.08)] border border-[hsl(var(--border)/0.3)] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all rounded-lg"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailMethod(null); // Reset method when email changes
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                {!isForgot && (
                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-2.5 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-[hsl(var(--accent)/0.08)] border border-[hsl(var(--border)/0.3)] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all rounded-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Remember + Forgot */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                  {!isForgot && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-[hsl(var(--primary))] w-4 h-4 cursor-pointer"
                      />
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgot(!isForgot);
                      setEmailMethod(null); // Reset method when switching modes
                    }}
                    className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary)/0.8)] hover:underline underline-offset-4 cursor-pointer transition-colors font-medium"
                  >
                    {isForgot ? "Back to Login" : "Forgot Password?"}
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 cursor-pointer font-semibold flex items-center justify-center gap-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-[hsl(var(--primary-foreground))] rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {loading ? (
                    "Processing..."
                  ) : isForgot ? (
                    <>
                      Send Reset Link <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Login <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Default Credentials */}
              {!isForgot && (
                <div className="pt-5 text-center text-xs text-muted-foreground border-t border-[hsl(var(--border)/0.2)]">
                  <p className="mb-1 font-medium text-foreground">
                    Default Credentials
                  </p>
                  <p className="font-mono text-[11px]">
                    Super Admin: superadmin@acme.com / SuperAdminPass123!
                  </p>
                  <p className="font-mono text-[11px]">
                    Client: client@company.com / ClientPass123!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
