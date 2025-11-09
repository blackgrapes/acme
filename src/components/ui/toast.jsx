"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start space-x-3 overflow-hidden rounded-xl border-2 p-4 shadow-2xl transition-all duration-300 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-gradient-to-br from-card to-card/95 text-foreground shadow-primary/10",
        destructive: "border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5 text-destructive-foreground shadow-destructive/10",
        success: "border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-500/5 text-green-900 shadow-green-500/10 dark:text-green-100",
        warning: "border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 text-yellow-900 shadow-yellow-500/10 dark:text-yellow-100",
        info: "border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-blue-900 shadow-blue-500/10 dark:text-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border-2 bg-transparent px-3 text-sm font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-destructive/30 group-[.destructive]:hover:border-destructive/50 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-lg p-1.5 text-foreground/50 opacity-0 transition-all duration-200 hover:scale-110 hover:bg-primary/10 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4 cursor-pointer" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-base font-bold leading-6 flex items-center gap-2", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName; 

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 leading-5 mt-1", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// Enhanced Icon Component
const ToastIcon = ({ variant }) => {
  const iconProps = {
    className: "h-5 w-5 flex-shrink-0",
  };

  switch (variant) {
    case "destructive":
      return <AlertCircle {...iconProps} className={cn(iconProps.className, "text-destructive")} />;
    case "success":
      return <CheckCircle {...iconProps} className={cn(iconProps.className, "text-green-600")} />;
    case "warning":
      return <AlertTriangle {...iconProps} className={cn(iconProps.className, "text-yellow-600")} />;
    case "info":
      return <Info {...iconProps} className={cn(iconProps.className, "text-blue-600")} />;
    default:
      return <CheckCircle {...iconProps} className={cn(iconProps.className, "text-primary")} />;
  }
};

// Enhanced Toast Content Component
const ToastContent = React.forwardRef(({ variant = "default", title, description, action, ...props }, ref) => {
  return (
    <Toast ref={ref} variant={variant} {...props}>
      <div className="flex items-start gap-3 w-full">
        <ToastIcon variant={variant} />
        <div className="flex-1 space-y-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && <ToastDescription>{description}</ToastDescription>}
        </div>
        {action && (
          <div className="flex items-center gap-2">
            {action}
            <ToastClose />
          </div>
        )}
        {!action && <ToastClose />}
      </div>
    </Toast>
  );
});
ToastContent.displayName = "ToastContent";

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
};