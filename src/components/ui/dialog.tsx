"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Root Dialog Components
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

// Overlay
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "supports-backdrop-filter:bg-black/60", // smoother fallback
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Content
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Base
        "fixed z-50 grid w-full gap-4 bg-background p-6 shadow-2xl duration-200",
        // Desktop Center
        "sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
        "sm:max-w-lg sm:rounded-2xl sm:border",
        // Mobile bottom sheet
        "max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-t-2xl max-sm:border-t",
        "max-sm:data-[state=open]:animate-in max-sm:data-[state=open]:slide-in-from-bottom",
        "max-sm:data-[state=closed]:animate-out max-sm:data-[state=closed]:slide-out-to-bottom",
        // Animations desktop
        "sm:data-[state=open]:animate-in sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:fade-in-0",
        "sm:data-[state=closed]:animate-out sm:data-[state=closed]:zoom-out-95 sm:data-[state=closed]:fade-out-0",
        // Scrolling + width
        "max-sm:max-h-[85vh] overflow-y-auto sm:w-full",
        className
      )}
      {...props}
    >
      {children}

      {/* Close Button */}
      <DialogPrimitive.Close
        className={cn(
          "absolute right-4 top-4 cursor-pointer rounded-sm p-1.5 opacity-70 transition-all duration-200",
          "ring-offset-background hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:pointer-events-none hover:bg-accent hover:scale-110 active:scale-95",
          "max-sm:top-3 max-sm:right-3"
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// Header
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      "max-sm:pr-8",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

// Footer
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3",
      "max-sm:space-y-3 max-sm:space-y-reverse",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

// Title
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-7 tracking-tight max-sm:text-xl",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Description
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground leading-6 max-sm:text-base max-sm:leading-7",
      className
    )}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Section
const DialogSection = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "py-4 border-b border-border/50 last:border-b-0 last:pb-0 first:pt-0",
      className
    )}
    {...props}
  />
);
DialogSection.displayName = "DialogSection";

// Body
const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex-1 overflow-y-auto max-sm:max-h-[60vh]",
      className
    )}
    {...props}
  />
);
DialogBody.displayName = "DialogBody";

// Size Variants
const dialogSizes = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  full: "sm:max-w-[95vw]",
};

interface ResponsiveDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: keyof typeof dialogSizes;
}

const ResponsiveDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ResponsiveDialogContentProps
>(({ className, size = "md", ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={cn(dialogSizes[size], className)}
    {...props}
  />
));
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

// Export all
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogSection,
  DialogBody,
  ResponsiveDialogContent,
  dialogSizes,
};
