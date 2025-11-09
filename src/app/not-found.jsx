"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-br from-[hsl(var(--primary)/0.1)] via-white to-[hsl(var(--primary)/0.05)] p-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -top-32 -right-32 w-72 md:w-96 h-72 md:h-96 bg-[hsl(var(--primary)/0.25)] rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-64 md:w-80 h-64 md:h-80 bg-[hsl(var(--primary)/0.2)] rounded-full blur-2xl opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md md:max-w-lg text-center relative z-10"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-5 md:mb-6"
        >
          <div className="p-4 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-[hsl(var(--border)/0.3)]">
            <Shield className="w-8 h-8 md:w-12 md:h-10 text-[hsl(var(--primary))]" />
          </div>
        </motion.div>

        {/* 404 Number with Gradient */}
        <div className="relative mb-6 md:mb-8">
          <div className="text-[4rem] md:text-[6rem] font-black text-gray-100 select-none drop-shadow-xl">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[3.5rem] md:text-[5.5rem] font-extrabold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.6)] bg-clip-text text-transparent">
              404
            </div>
          </div>
        </div>

        {/* Message Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-md border border-[hsl(var(--border)/0.3)] rounded-3xl shadow-2xl p-6 md:p-10 mb-6 md:mb-8"
        >
          {/* Alert Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-full shadow-inner">
              <AlertCircle className="w-7 h-7 md:w-8 md:h-8 text-yellow-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
            The page you’re looking for doesn’t exist or has been moved to a new location.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center cursor-pointer gap-2 rounded-xl border-[hsl(var(--border))] text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>

            <Link href="/" className="inline-block">
              <Button className="flex items-center cursor-pointer gap-2 rounded-xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)] hover:opacity-90 text-white shadow-lg transition-all">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-xs md:text-sm text-gray-500 mb-3">Quick Links:</p>
          <div className="flex justify-center gap-4 md:gap-5 text-xs md:text-sm">
            <Link
              href="/login"
              className="text-[hsl(var(--primary))] hover:underline cursor-pointer font-medium"
            >
              Login
            </Link>
            <Link
              href="/admin-dashboard"
              className="text-[hsl(var(--primary))] hover:underline cursor-pointer font-medium"
            >
              Admin
            </Link>
            <Link
              href="/client-dashboard"
              className="text-[hsl(var(--primary))] hover:underline cursor-pointer font-medium"
            >
              Client
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
