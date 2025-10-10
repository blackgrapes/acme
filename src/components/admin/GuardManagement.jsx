"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function GuardManagement({
  dummyGuards,
  guardDocuments,
  handleAddGuardDocuments,
  handleGuardRowClick,
}) {
  const [openAddGuardDialog, setOpenAddGuardDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Guard Management
        </h2>
        <Dialog open={openAddGuardDialog} onOpenChange={setOpenAddGuardDialog}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Guard
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Guard</DialogTitle>
              <DialogDescription>Enter guard details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guardName">Name</Label>
                <Input id="guardName" placeholder="Guard Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardEmail">Email</Label>
                <Input
                  id="guardEmail"
                  type="email"
                  placeholder="guard@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardPhone">Phone</Label>
                <Input id="guardPhone" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardType">Guard Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pso">
                      Personal Security Officer
                    </SelectItem>
                    <SelectItem value="guard">Security Guard</SelectItem>
                    <SelectItem value="officer">Security Officer</SelectItem>
                    <SelectItem value="supervisor">
                      Security Supervisor
                    </SelectItem>
                    <SelectItem value="lady">Lady Security Guard</SelectItem>
                    <SelectItem value="gunmen">Security Gunmen</SelectItem>
                    <SelectItem value="exmen">
                      Ex-men Security Guard & Bodyguards
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardGender">Gender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="guardDocuments">Documents (Multiple)</Label>
                <Input
                  id="guardDocuments"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleAddGuardDocuments}
                />
                {guardDocuments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {guardDocuments.map((doc, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground">
                        {doc.name} ({doc.size})
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" className="md:col-span-2 shadow-sm">
                Add Guard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="shadow-md border-0">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>All Guards</CardTitle>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Search className="h-4 w-4 text-primary flex-shrink-0" />
            <Input
              placeholder="Search guards..."
              className="h-8 flex-1 max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden sm:table-cell">Gender</TableHead>
                <TableHead className="sm:table-cell hidden">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyGuards.map((guard) => (
                <TableRow
                  key={guard.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleGuardRowClick(guard.id)}
                >
                  <TableCell className="font-medium sm:table-cell hidden">
                    {guard.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {guard.email}
                  </TableCell>
                  <TableCell className="sm:table-cell hidden">
                    {guard.phone}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {guard.type}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {guard.gender}
                  </TableCell>
                  <TableCell className="sm:table-cell hidden">
                    <Badge
                      variant={
                        guard.status === "Assigned" ? "default" : "secondary"
                      }
                    >
                      {guard.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
