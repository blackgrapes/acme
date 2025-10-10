"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Reply } from "lucide-react";

export default function ContactManagement({
  contactTab,
  setContactTab,
  dummyContactSubmissions,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
        Contact Submissions
      </h2>
      <Tabs value={contactTab} onValueChange={setContactTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 h-auto p-1 rounded-lg bg-card shadow-sm border">
          <TabsTrigger
            value="submissions"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
          >
            Submissions
          </TabsTrigger>
          <TabsTrigger
            value="replies"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
          >
            Replies
          </TabsTrigger>
        </TabsList>
        <TabsContent value="submissions" className="mt-0">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell">Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Phone
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Message
                    </TableHead>
                    <TableHead className="sm:table-cell hidden">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyContactSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="sm:table-cell hidden">
                        {submission.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {submission.email}
                      </TableCell>
                      <TableCell className="sm:table-cell hidden">
                        {submission.phone}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {submission.message}
                      </TableCell>
                      <TableCell className="sm:table-cell hidden">
                        {submission.date}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Reply className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="replies" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Manage Replies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Reply management coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
