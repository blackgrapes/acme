"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield, Settings, LogIn, Plus, X, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/why-choose-us", label: "Why Choose Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/clients", label: "Clients" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const location = usePathname();
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check login status on component mount
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    // Listen for custom auth events (when user logs in/out in same tab)
    window.addEventListener('authChange', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        setIsLoggedIn(true);
        const user = JSON.parse(userData);
        setUserRole(user.role || user.roleName);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDashboardClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Redirect based on user role
    if (userRole === 'Super Admin' || userRole === 'Admin') {
      router.push('/admin-dashboard');
    } else if (userRole === 'Client') {
      router.push('/client-dashboard');
    } else {
      // Default fallback
      router.push('/dashboard');
    }
  };

  const getDashboardButtonText = () => {
    if (isLoading) return "Loading...";
    return isLoggedIn ? "Dashboard" : "Portal Login";
  };

  const getDashboardButtonIcon = () => {
    if (isLoading) return <LogIn className="h-4 w-4 mr-1" />;
    return isLoggedIn ? <LayoutDashboard className="h-4 w-4 mr-1" /> : <LogIn className="h-4 w-4 mr-1" />;
  };

  const isActive = (path) => location === path;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-colors">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link
            href="/"
            className="flex items-center font-extrabold text-xl tracking-tight text-primary transition-colors"
          >
            {/* <Shield className="h-6 w-6 text-primary transition-colors" /> */}
            <Image
              src="/acme_logo.png"
              alt="ACME Logo"
              width={60}
              height={60}
              className="object-contain" 
            />ACME
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Dashboard/Login Button */}
            <Button 
              onClick={handleDashboardClick}
              className="rounded-full cursor-pointer px-4 bg-primary text-white hover:bg-primary/90 transition-colors text-sm flex items-center gap-1"
              disabled={isLoading}
            >
              {getDashboardButtonIcon()}
              {getDashboardButtonText()}
            </Button>

            
          </div>
        </div>
      </header>

      {/* Floating Curved Radial Menu */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <AnimatePresence>
            {navOpen &&
              navItems.map((item, index) => {
                const total = navItems.length - 1;
                const angleStep = 100 / total; // Increased arc to 100 degrees
                const angle = angleStep * index;
                const radius = 220; // Increased radius for better spacing
                const x = -radius * Math.cos((angle * Math.PI) / 180);
                const y = -radius * Math.sin((angle * Math.PI) / 180);

                return (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x,
                      y,
                    }}
                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.08, // Increased delay for smoother animation
                      type: "spring",
                      stiffness: 150,
                      damping: 15,
                    }}
                    className="absolute"
                  >
                    <Link
                      href={item.to}
                      onClick={() => setNavOpen(false)}
                      className={`flex items-center justify-center px-3 py-2 rounded-full text-xs font-semibold border shadow-lg whitespace-nowrap transition-all duration-200 hover:scale-105 ${
                        isActive(item.to)
                          ? "bg-primary text-white border-primary shadow-primary/25"
                          : "bg-white text-gray-800 border-gray-200 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                      }`}
                      style={{
                        minWidth: "max-content",
                        maxWidth: "120px",
                      }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {/* Center Floating Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setNavOpen(!navOpen)}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
              navOpen ? "bg-primary hover:bg-red-600" : "bg-primary hover:bg-primary/90"
            }`}
          >
            <motion.div
              animate={{ rotate: navOpen ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {navOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Backdrop - Close menu when clicking outside */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNavOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  );
}