// Updated File: app/admin-dashboard/client-details/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Eye, Download, Edit2, Trash2 } from "lucide-react";
import Header from "@/components/admin/Header";
import DesktopSidebar from "@/components/admin/DesktopSidebar";
import AdminProfileDialog from "@/components/admin/AdminProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";

const dummyGuards = [
  { id: 1, name: "Guard A", email: "guardA@example.com", status: "Active" },
  { id: 2, name: "Guard B", email: "guardB@example.com", status: "Active" },
  { id: 3, name: "Guard C", email: "guardC@example.com", status: "Inactive" },
];

const dummyClientDocuments = [
  {
    id: 1,
    name: "Client Agreement",
    type: "Contract",
    uploaded: "2025-01-01",
    size: "2.4 MB",
    access: "Specific",
  },
  {
    id: 2,
    name: "Invoice Jan 2025",
    type: "Invoice",
    uploaded: "2025-01-15",
    size: "1.2 MB",
    access: "Specific",
  },
];

const dummyRequests = [
  {
    id: 1,
    client: "John Smith",
    clientId: 1,
    type: "Invoice",
    status: "Pending",
    date: "2025-01-15",
  },
  {
    id: 2,
    client: "Sarah Johnson",
    clientId: 2,
    type: "Report",
    status: "Fulfilled",
    date: "2025-01-14",
  },
];

const dummyClient = {
  id: 1,
  name: "John Smith",
  org: "ABC Corporation",
  email: "john@abc.com",
  phone: "(555) 123-4567",
  plan: "Security Officer",
  duration: { from: "2025-01-01", to: "2025-12-31" },
  status: "Active",
  joined: "2024-01-15",
  lastLogin: "2025-01-15",
  currentGuards: [1, 2], // IDs
  previousGuards: [3],
};

export default function ClientDetails() {
  const params = useParams();
  const clientId = parseInt(params.id);
  const [client, setClient] = useState(null);
  const [showSpecificAccess, setShowSpecificAccess] = useState(false);
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();

  const activeTab = "clients";
  const handleTabChange = () => {
    router.push("/admin-dashboard");
  };

  useEffect(() => {
    // Simulate fetch
    setClient(dummyClient);
  }, [clientId]);

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          openAdminDialog={openAdminDialog}
          setOpenAdminDialog={setOpenAdminDialog}
        />
        <div className="flex flex-1">
          <DesktopSidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
              Loading...
            </div>
          </main>
        </div>
        <AdminProfileDialog
          open={openAdminDialog}
          onOpenChange={setOpenAdminDialog}
        />
      </div>
    );
  }

  const currentGuardsList = client.currentGuards
    .map((gId) => dummyGuards.find((g) => g.id === gId))
    .filter(Boolean);
  const previousGuardsList = client.previousGuards
    .map((gId) => dummyGuards.find((g) => g.id === gId))
    .filter(Boolean);

  const clientRequests = dummyRequests.filter(
    (req) => req.clientId === client.id
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        openAdminDialog={openAdminDialog}
        setOpenAdminDialog={setOpenAdminDialog}
      />
      <div className="flex flex-1">
        <DesktopSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                Client Details: {client.name}
              </h1>
              <div className="flex gap-2">
                <Button variant="ghost">
                  <Edit2 className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="lg:col-span-1 shadow-md border-0">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary">Organization</p>
                    <p className="font-medium">{client.org}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary">Phone</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary">Plan</p>
                    <p className="font-medium">{client.plan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary">Duration</p>
                    <p className="font-medium">
                      {client.duration.from} - {client.duration.to}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary">Status</p>
                    <p>
                      <Badge variant="default">{client.status}</Badge>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary">Joined</p>
                    <p className="font-medium">{client.joined}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary">Last Login</p>
                    <p className="font-medium">{client.lastLogin}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 shadow-md border-0">
                <CardHeader>
                  <CardTitle>Guards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Current Guards</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentGuardsList.map((guard) => (
                          <TableRow key={guard.id}>
                            <TableCell className="font-medium">
                              {guard.name}
                            </TableCell>
                            <TableCell>{guard.email}</TableCell>
                            <TableCell>
                              <Badge>{guard.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Previous Guards</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previousGuardsList.map((guard) => (
                          <TableRow key={guard.id}>
                            <TableCell className="font-medium">
                              {guard.name}
                            </TableCell>
                            <TableCell>{guard.email}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{guard.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Documents</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="shadow-sm">
                      <Plus className="h-4 w-4 mr-2" /> Add Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Document for Client</DialogTitle>
                      <DialogDescription>
                        Upload a new document for this client.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="docTitle">Title</Label>
                        <Input id="docTitle" placeholder="Document Title" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="docType">Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="invoice">Invoice</SelectItem>
                            <SelectItem value="certificate">
                              Certificate
                            </SelectItem>
                            <SelectItem value="report">Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="docAccess">Access</Label>
                        <Select
                          onValueChange={(value) =>
                            setShowSpecificAccess(value === "specific")
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Access" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="specific">
                              Specific to this client
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {showSpecificAccess && (
                        <div className="space-y-2">
                          <Label>Selected Client: {client.name}</Label>
                          {/* Already specific to this client */}
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="docDesc">Description</Label>
                        <Input id="docDesc" placeholder="Description" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="docFile">File</Label>
                        <Input id="docFile" type="file" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="shadow-sm">
                        Upload
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyClientDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {doc.name}
                        </TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.uploaded}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.access}</Badge>
                        </TableCell>
                        <TableCell className="space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle>Request Documents</CardTitle>
                <CardDescription>
                  Document requests made by this client.
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>{req.type}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              req.status === "Pending" ? "default" : "secondary"
                            }
                          >
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{req.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {clientRequests.length === 0 && (
                  <p className="text-center text-secondary py-8">
                    No requests found for this client.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <AdminProfileDialog
        open={openAdminDialog}
        onOpenChange={setOpenAdminDialog}
      />
    </div>
  );
}
