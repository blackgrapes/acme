"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Shield,
  UserCheck,
  FileCheck2,
  LayoutDashboard,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function HeroSection({ typedTitle, paragraphs, paraIndex }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0); // ✅ window width को state में store करें

  // Window width track करें
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Check login status on component mount
  useEffect(() => {
    checkAuthStatus();

    // Listen for storage changes
    if (typeof window !== "undefined") {
      window.addEventListener("storage", checkAuthStatus);
      window.addEventListener("authChange", checkAuthStatus);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", checkAuthStatus);
        window.removeEventListener("authChange", checkAuthStatus);
      }
    };
  }, []);

  const checkAuthStatus = () => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
          setIsLoggedIn(true);
          const user = JSON.parse(userData);
          setUserRole(user.role || user.roleName);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoggedIn(false);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDashboardClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Redirect based on user role
    if (userRole === "Super Admin" || userRole === "Admin") {
      router.push("/admin-dashboard");
    } else if (userRole === "Client") {
      router.push("/client-dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const getDashboardButtonText = () => {
    if (isLoading) return "Loading...";
    return isLoggedIn ? "Dashboard" : "Portal Login";
  };

  const getDashboardButtonIcon = () => {
    if (isLoading) return <LogIn className="h-4 w-4 mr-2" />;
    return isLoggedIn ? (
      <LayoutDashboard className="h-4 w-4 mr-2" />
    ) : (
      <LogIn className="h-4 w-4 mr-2" />
    );
  };

  const [active, setActive] = useState(""); // store which image is front

  const handleClick = (id) => {
    setActive(id);
  };

  return (
    <section className="relative w-full overflow-hidden min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto grid md:grid-cols-2 items-center gap-6 lg:gap-10 relative">
        {/* Left Content */}
        <motion.div
          className="relative z-10 text-center md:text-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight bg-clip-text text-transparent w-auto md:w-[130%] max-w-none"
            style={{
              backgroundImage: `linear-gradient(to right, #000000, hsl(var(--primary)))`,
              // ✅ windowWidth का use करें (client-side पर ही)
              height: windowWidth === 0 ? "auto" : (windowWidth >= 768 ? "200px" : "120px"),
              overflow: "hidden",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.3 }}
          >
            {typedTitle}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            key={paraIndex}
            className="mt-4 md:mt-6 text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl min-h-[70px] md:min-h-[90px] mx-auto md:mx-0"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {paragraphs[paraIndex]}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-5 justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={handleDashboardClick}
                className="rounded-full cursor-pointer bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 px-6 py-3 w-full sm:w-auto"
                disabled={isLoading}
              >
                {getDashboardButtonIcon()} {getDashboardButtonText()}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-full sm:w-auto"
            >
              <Link href={"/services"}>
                <Button
                  variant="outline"
                  className="rounded-full cursor-pointer border-gray-400 text-gray-800 hover:bg-gray-100 px-6 py-3 w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <div className="mt-8 md:mt-12 flex flex-wrap gap-3 md:gap-5 text-sm justify-center md:justify-start">
            {[
              {
                icon: <UserCheck className="h-4 w-4 text-primary" />,
                text: "3000+ Vetted Guards",
              },
              {
                icon: <FileCheck2 className="h-4 w-4 text-primary" />,
                text: "ISO Certified",
              },
              {
                icon: <Shield className="h-4 w-4 text-primary" />,
                text: "200+ Clients",
              },
            ].map((item, i) => (
              <motion.span
                key={i}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border text-xs md:text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.2, duration: 0.6 }}
              >
                {item.icon} {item.text}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Non-Overlapping Layout */}
        <motion.div
          className="relative flex justify-center items-start md:items-center order-first md:order-last mt-10 md:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* BACKGROUND IMAGE 2 - LEFT SIDE */}
          <div
            className={`absolute w-[260px] h-[300px] -left-12 top-32 rounded-[40px] overflow-hidden border-4 border-primary transition-all duration-300 ${
              active === "bg2" ? "z-50 scale-105" : "z-0 scale-100"
            }`}
            onClick={() => handleClick("bg2")}
          >
            <img
              src="/h2.jpg"
              alt="Background 2"
              className="w-full h-full object-cover"
            />
          </div>

          {/* HERO IMAGE - CENTER BOTTOM */}
          <div
            className={`relative w-[330px] h-[420px] rounded-[60px] overflow-hidden border-4 border-black transition-all duration-300 ${
              active === "hero" ? "z-50 scale-105" : "z-10 scale-100"
            }`}
            onClick={() => handleClick("hero")}
          >
            <img
              src="/hero.jpg"
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>

          {/* BACKGROUND IMAGE 1 - RIGHT SIDE */}
          <div
            className={`absolute w-[280px] h-[350px] -right-6 top-0 rounded-[40px] overflow-hidden border-4 border-primary transition-all duration-300 ${
              active === "bg1" ? "z-50 scale-105" : "z-0 scale-100"
            }`}
            onClick={() => handleClick("bg1")}
          >
            <img
              src="/h1.jpg"
              alt="Background 1"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* 🔥 Bottom Wave + Trust Bar - Extra Wavy */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden hidden md:block">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{
              duration: 5,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <svg
              className="w-full h-20 md:h-24 text-primary"
              preserveAspectRatio="none"
              viewBox="0 0 1440 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,192C672,203,768,213,864,202.7C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}