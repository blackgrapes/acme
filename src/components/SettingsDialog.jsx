"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme, paletteNames } from "@/contexts/ThemeContext";
import { Check } from "lucide-react";

export function SettingsDialog({ open, onOpenChange }) {
  const { palette, setPalette } = useTheme();

  const palettes = Object.entries(paletteNames);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-white">
        <DialogHeader>
          <DialogTitle className="text-lg">Settings</DialogTitle>
          <DialogDescription className="text-base">
            Choose your preferred color palette for the website.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <h3 className="text-base font-medium mb-3">Color Palette</h3>
          <div className="space-y-2">
            {palettes.map(([key, name]) => (
              <button
                key={key}
                onClick={() => setPalette(key)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border bg-background hover:bg-accent transition-colors text-white ${
                  palette === key ? "border-primary" : "border-border"
                }`}
              >
                <span className="text-base font-medium">{name}</span>
                {palette === key && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
