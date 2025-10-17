// File: src/app/login/LoginContent.jsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔐 Attempting login for:", email);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      console.log("📨 Login response:", data);

      if (!res.ok) {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }

      if (!data.token) {
        console.error("❌ No token in response!");
        toast({
          title: "Login Error",
          description: "Authentication token missing",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("authToken", data.token);
      console.log("💾 Token saved to localStorage");

      toast({
        title: "Login Successful",
        description: `Welcome ${data.user.name || data.user.email}!`,
      });

      let redirectPath = "/";
      const redirectTo = searchParams.get("redirect");

      if (redirectTo) {
        redirectPath = redirectTo;
      } else if (data.permissions?.includes("dashboard-read")) {
        redirectPath = "/admin-dashboard";
      } else if (data.permissions?.includes("client-dashboard-read")) {
        redirectPath = "/client-dashboard";
      }

      console.log("🔄 Redirecting to:", redirectPath);
      router.replace(redirectPath);
    } catch (error) {
      console.error("💥 Login error:", error);
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
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-center py-8">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Sign in to your account to access the portal
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rounded-xl h-12"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 rounded-xl h-12"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl h-12 bg-primary hover:bg-primary/90 shadow-lg"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            <p>Default Credentials:</p>
            <p className="font-mono text-xs mt-1">
              Super Admin: superadmin@acme.com / SuperAdminPass123!
            </p>
            <p className="font-mono text-xs">
              Client: client@company.com / ClientPass123!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
