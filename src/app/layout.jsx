import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ClientRel from "@/components/ClientRel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Accent Art Security Services",
  description: "Professional security service provider in India",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
        suppressHydrationWarning={true}
      >
        {/* Suppresses extension mismatches on <body> */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientRel>{children}</ClientRel>
        </ThemeProvider>
      </body>
    </html>
  );
}
