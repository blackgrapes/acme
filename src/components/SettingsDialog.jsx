"use client";

import {
  Dialog,
  ResponsiveDialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme, paletteNames } from "@/contexts/ThemeContext";
import { Check, Palette, Sparkles, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

/* ---------- Helpers ---------- */
// simple deterministic hash
function hashStringToInt(str = "") {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function capitalizeWords(str = "") {
  return str
    .toString()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Generate a safe HSL palette for any key (deterministic).
 * Returns values usable directly in CSS `background`/`backgroundColor`.
 */
function generatedPaletteFromKey(key) {
  const hash = hashStringToInt(key);
  const hue = hash % 360;
  const primary = `hsl(${hue} 80% 50%)`; // vivid
  const secondary = `hsl(${(hue + 200) % 360} 60% 35%)`;
  const text = capitalizeWords(key);
  return { primary, secondary, text };
}

/**
 * Pick a friendly base color key by inferring from the palette key.
 * So if your key is "black-sky-blue" -> picks "blue" base palette entry if present.
 */
function inferBaseKey(key = "") {
  const s = key.toLowerCase();
  if (s.includes("blue") || s.includes("sky")) return "blue";
  if (s.includes("red") || s.includes("rose")) return "rose";
  if (s.includes("green") || s.includes("lime")) return "green";
  if (s.includes("purple") || s.includes("pink")) return "purple";
  if (s.includes("orange") || s.includes("amber")) return "orange";
  if (s.includes("navy") || s.includes("indigo")) return "indigo";
  return null;
}

/* ---------- Component ---------- */
export function SettingsDialog({ open, onOpenChange }) {
  // paletteNames expected: { "black-sky-blue": "Black & Sky Blue", ... }
  const { palette, setPalette } = useTheme();
  const palettes = Object.entries(paletteNames || {});

  // Nice defaults (only for nicer preview for known families)
  const basePaletteColors = {
    blue: { primary: "#3B82F6", secondary: "#1E3A8A", text: "Black & Sky Blue" },
    green: { primary: "#22C55E", secondary: "#14532D", text: "Black & Green" },
    purple: { primary: "#A855F7", secondary: "#4C1D95", text: "Black & Purple" },
    orange: { primary: "#F97316", secondary: "#7C2D12", text: "Black & Orange" },
    rose: { primary: "#F43F5E", secondary: "#881337", text: "Black & Red" },
    indigo: { primary: "#6366F1", secondary: "#1E1B4B", text: "Black & Navy" },
  };

  // safePalette: current app palette (used in Live Preview)
  const safePalette =
    // prefer an exact base match if palette name contains family (e.g. "black-sky-blue" -> blue)
    (inferBaseKey(palette) && basePaletteColors[inferBaseKey(palette)]) ||
    basePaletteColors.blue || // fallback
    generatedPaletteFromKey(palette || "default");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent
        size="lg"
        className="bg-background bg-white text-foreground border border-border rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto px-6 py-4 transition-colors duration-300"
      >
        {/* Header */}
        <DialogHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl shadow-md bg-primary">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold">
                Theme Customization
              </DialogTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Choose your preferred color scheme for the website
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="mt-5 space-y-6">
          {/* Color Themes */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Color Themes</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {palettes.map(([key, displayName]) => {
                // Choose base palette if key suggests a family, else generate
                const inferred = inferBaseKey(key);
                const base = inferred ? basePaletteColors[inferred] : null;
                const color = base || generatedPaletteFromKey(key);
                const isActive = palette === key;

                return (
                  <motion.button
                    key={key}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPalette(key)}
                    className={`relative flex items-center cursor-pointer gap-3 p-3 rounded-xl border transition-all duration-300 text-left
                      ${isActive ? "border-primary shadow-lg bg-primary/10" : "border-border bg-background hover:shadow-md"}`}
                    aria-pressed={isActive}
                    title={displayName || color.text}
                  >
                    {/* preview dot (inline style because it shows other palettes) */}
                    <div
                      className="w-8 h-8 rounded-full shadow-md flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
                      }}
                      aria-hidden
                    />

                    {/* label */}
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-medium"
                        style={{ color: color.primary }}
                      >
                        {displayName || color.text}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isActive ? "Active" : "Click to apply"}
                      </span>
                    </div>

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 text-white p-1 rounded-full shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
                        }}
                        aria-hidden
                      >
                        <Check className="h-3 w-3" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-primary">
              <Eye className="h-4 w-4" />
              <span>Live Preview</span>
            </div>

            <div className="p-4 rounded-xl bg-muted border border-border shadow-inner space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: safePalette.primary }}
                  />
                  <div>
                    <div
                      className="h-2 w-14 rounded"
                      style={{ backgroundColor: safePalette.primary }}
                    />
                    <div
                      className="h-1.5 w-10 mt-1 rounded"
                      style={{ backgroundColor: safePalette.secondary, opacity: 0.5 }}
                    />
                  </div>
                </div>

                <div className="h-6 px-3 rounded flex items-center bg-primary text-white">
                  <div className="h-2 w-8 bg-white/80 rounded" />
                </div>
              </div>

              <div className="space-y-2">
                <div
                  className="h-2 w-3/4 rounded opacity-70"
                  style={{ backgroundColor: safePalette.primary }}
                />
                <div
                  className="h-2 w-1/2 rounded"
                  style={{ backgroundColor: safePalette.secondary, opacity: 0.5 }}
                />
                <div
                  className="h-2 w-2/3 rounded"
                  style={{ backgroundColor: safePalette.secondary, opacity: 0.5 }}
                />
              </div>

              <div className="flex gap-3">
                <div
                  className="flex-1 h-7 rounded flex items-center justify-center text-white"
                  style={{ backgroundColor: safePalette.primary }}
                >
                  <div className="h-2 w-10 bg-white/80 rounded" />
                </div>
                <div className="flex-1 h-7 border border-border rounded flex items-center justify-center">
                  <div
                    className="h-2 w-8 rounded"
                    style={{ backgroundColor: safePalette.primary }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs pt-2 border-t border-border/30 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p>
                  Previewing{" "}
                  <span className="font-medium" style={{ color: safePalette.primary }}>
                    {safePalette.text}
                  </span>{" "}
                  theme
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-border/40">
          <span className="text-xs text-muted-foreground">Changes apply instantly</span>
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-lg cursor-pointer shadow-md hover:shadow-lg bg-primary text-primary-foreground"
          >
            Done
          </Button>
        </div>
      </ResponsiveDialogContent>
    </Dialog>
  );
}
