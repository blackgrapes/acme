// src/components/admin/AdminProfileDialog.jsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export default function AdminProfileDialog({ open, onOpenChange, user }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  // 🔄 Sync user data AFTER loading is done
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role?.name || user.role || "",
      });
    }
  }, [user]);

  // 🧩 When dialog opens after data load
  useEffect(() => {
    if (open && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role?.name || user.role || "",
      });
    }
  }, [open, user]);

  const getUserInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // 🧠 Don't render empty UI while loading
  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            Admin Profile
          </DialogTitle>
          <DialogDescription>
            View and edit your admin details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={formData.role} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminImage">Profile Image</Label>
            <Input id="adminImage" type="file" accept="image/*" />
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" className="w-full shadow-lg">
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
