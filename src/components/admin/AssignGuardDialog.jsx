// File: src/components/admin/AssignGuardDialog.jsx
// Updated AssignGuardDialog.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, MapPin, Star, Shield, Check, X } from "lucide-react";

export function AssignGuardDialog({ open, onOpenChange, clientId, onAssign }) {
  const [guards, setGuards] = useState([]);
  const [filteredGuards, setFilteredGuards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedGuards, setSelectedGuards] = useState([]);

  useEffect(() => {
    if (open) {
      fetchAvailableGuards();
      setSelectedGuards([]);
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = guards.filter(
        (guard) =>
          guard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guard.guardId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guard.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGuards(filtered);
    } else {
      setFilteredGuards(guards);
    }
  }, [searchQuery, guards]);

  const fetchAvailableGuards = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/guard?status=Available");
      const data = await response.json();

      if (data.guards) {
        setGuards(data.guards);
        setFilteredGuards(data.guards);
      }
    } catch (error) {
      console.error("Error fetching guards:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGuardSelection = (guard) => {
    setSelectedGuards(prev => {
      const isSelected = prev.find(g => g._id === guard._id);
      if (isSelected) {
        return prev.filter(g => g._id !== guard._id);
      } else {
        return [...prev, guard];
      }
    });
  };

  const handleAssign = async () => {
    if (selectedGuards.length === 0) return;

    try {
      // Get current client data first
      const clientResponse = await fetch(`/api/auth/client/${clientId}`);
      const clientData = await clientResponse.json();
      
      if (!clientResponse.ok) {
        throw new Error("Failed to fetch client data");
      }

      const currentAssignedGuards = clientData.client.assignedGuards || [];
      const newGuardIds = selectedGuards.map(guard => guard._id);
      
      // Combine existing and new guards, remove duplicates
      const updatedGuardIds = [...new Set([...currentAssignedGuards, ...newGuardIds])];

      const response = await fetch(`/api/auth/client/${clientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignedGuards: updatedGuardIds,
        }),
      });

      if (response.ok) {
        // Update guard status to "Assigned"
        await Promise.all(
          selectedGuards.map(guard =>
            fetch(`/api/auth/guard/${guard._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "Assigned",
                currentAssignment: {
                  clientId: clientId,
                  clientName: clientData.client.name,
                  organization: clientData.client.companyName,
                  assignmentType: clientData.client.securityPlan,
                  location: clientData.client.address,
                  startDate: new Date().toISOString(),
                  status: "Active"
                }
              }),
            })
          )
        );

        onAssign(selectedGuards);
        onOpenChange(false);
        setSelectedGuards([]);
      }
    } catch (error) {
      console.error("Error assigning guards:", error);
      alert("Failed to assign guards. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Assign Guards to Client</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Guards Summary */}
          {selectedGuards.length > 0 && (
            <div className="p-3 bg-primary/5 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Selected Guards ({selectedGuards.length})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedGuards([])}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedGuards.map(guard => (
                  <Badge key={guard._id} variant="secondary" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {guard.name}
                    <button
                      onClick={() => toggleGuardSelection(guard)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guards by name, ID, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Guards List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-4">Loading guards...</div>
            ) : filteredGuards.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No available guards found
              </div>
            ) : (
              filteredGuards.map((guard) => {
                const isSelected = selectedGuards.find(g => g._id === guard._id);
                return (
                  <div
                    key={guard._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleGuardSelection(guard)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {guard.name}
                            <Badge variant="outline" className="text-xs">
                              {guard.guardId}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {guard.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              {guard.rating || "No rating"}/5
                            </span>
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {guard.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          guard.status === "Available" ? "default" : "secondary"
                        }
                        className={
                          guard.status === "Available"
                            ? "bg-green-500 text-white"
                            : ""
                        }
                      >
                        {guard.status}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={selectedGuards.length === 0}>
            Assign {selectedGuards.length} Guard(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
