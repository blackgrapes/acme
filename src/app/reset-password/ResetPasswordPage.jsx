"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (!tokenParam || !emailParam) {
      toast({
        title: "Invalid Reset Link",
        description: "The reset link is invalid or has expired.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    setToken(tokenParam);
    setEmail(decodeURIComponent(emailParam));
  }, [searchParams, router, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Reset Failed",
          description: data.error || "Failed to reset password",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Password Reset Successful",
        description: "You can now login with your new password.",
      });

      // Redirect to login page
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Network Error",
        description: "Unable to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md border border-[hsl(var(--border))]/30 bg-[hsl(var(--background)/0.8)]">
        
        {/* Left Section - Same as login page */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-linear-to-tr from-[hsl(var(--primary))] ">
          <Shield className="w-16 h-16 mb-5" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Secure Your Account
          </h1>
          <p className="max-w-md text-sm md:text-base leading-relaxed">
            Create a strong new password to keep your account secure and protected.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-[hsl(var(--background)/0.7)]">
          <Card className="w-full max-w-sm md:max-w-md bg-[hsl(var(--card)/0.85)] backdrop-blur-md border border-[hsl(var(--border)/0.3)] shadow-lg rounded-2xl">
            
            {/* Header */}
            <CardHeader className="text-center space-y-2 pt-6">
              <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
                Reset Your Password
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your new password for <strong>{email}</strong>
              </p>
            </CardHeader>

            {/* Content */}
            <CardContent className="px-6 pb-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* New Password */}
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    New Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-2.5 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-[hsl(var(--accent)/0.08)] border border-[hsl(var(--border)/0.3)] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all rounded-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 6 characters long
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-2.5 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 bg-[hsl(var(--accent)/0.08)] border border-[hsl(var(--border)/0.3)] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all rounded-lg"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Strength Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Password Strength</span>
                    <span className={
                      password.length === 0 ? 'text-muted-foreground' :
                      password.length < 6 ? 'text-red-500' :
                      password.length < 8 ? 'text-yellow-500' : 'text-green-500'
                    }>
                      {password.length === 0 ? 'None' :
                       password.length < 6 ? 'Weak' :
                       password.length < 8 ? 'Fair' : 'Strong'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all ${
                        password.length === 0 ? 'bg-gray-200 w-0' :
                        password.length < 6 ? 'bg-red-500 w-1/3' :
                        password.length < 8 ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-full'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 cursor-pointer font-semibold flex items-center justify-center gap-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-[hsl(var(--primary-foreground))] rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {loading ? (
                    "Resetting Password..."
                  ) : (
                    <>
                      Reset Password <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Back to Login */}
              <div className="text-center pt-4 border-t border-[hsl(var(--border)/0.2)]">
                <button
                  onClick={() => router.push('/login')}
                  className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary)/0.8)] hover:underline underline-offset-4 cursor-pointer transition-colors font-medium text-sm"
                >
                  ← Back to Login
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}