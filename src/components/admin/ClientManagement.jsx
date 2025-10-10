"use client";

import { useRouter } from "next/navigation";
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
import { Eye, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ClientManagement({
  dummyClients,
  guardSearch,
  handleGuardSearch,
  selectedGuards,
  toggleGuardSelection,
  filteredClientGuards,
  handleClientRowClick,
}) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Client Management
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter client details to create an account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Set password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Profile Image</Label>
                <Input id="image" type="file" accept="image/*" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="plan">Plan</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">
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
                <Label>Duration</Label>
                <div className="flex gap-2">
                  <Input type="date" placeholder="From" />
                  <Input type="date" placeholder="To" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Assign Guards</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search guards by name or email..."
                      value={guardSearch}
                      onChange={(e) => handleGuardSearch(e, "client")}
                      className="flex-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                    {filteredClientGuards.map((guard) => (
                      <div
                        key={guard.id}
                        className="flex items-center space-x-2 p-1"
                      >
                        <input
                          type="checkbox"
                          id={`guard-${guard.id}`}
                          checked={selectedGuards.includes(guard.id)}
                          onChange={() =>
                            toggleGuardSelection(guard.id, "client")
                          }
                        />
                        <Label
                          htmlFor={`guard-${guard.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          <div className="font-medium">{guard.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {guard.email}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="shadow-sm">
                Create Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="shadow-md border-0">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Filters</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Search className="h-4 w-4 text-primary flex-shrink-0" />
              <Input placeholder="Search clients..." className="h-8 flex-1" />
            </div>
            <Select>
              <SelectTrigger className="w-[120px] sm:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Organization
                </TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Plan</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleClientRowClick(client.id)}
                >
                  <TableCell className="font-medium sm:table-cell hidden">
                    {client.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {client.org}
                  </TableCell>
                  <TableCell className="sm:table-cell hidden">
                    {client.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {client.phone}
                  </TableCell>
                  <TableCell className="sm:table-cell hidden">
                    <Badge
                      variant={
                        client.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {client.plan}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
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
