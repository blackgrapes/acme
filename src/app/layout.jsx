import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ClientRel from "@/components/ClientRel";
import { Toaster } from "@/components/ui/toaster";
import PWARegister from "@/components/PWARegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


export const metadata = {
  title: "Accent Art Security Services",
  description: "Professional security service provider in India",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ACME Security",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
};


export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased font-sans`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <ClientRel>{children}</ClientRel>
          <Toaster />
          <PWARegister />
        </ThemeProvider>
      </body>
    </html>
  );
}