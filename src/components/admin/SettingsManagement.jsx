"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Shield } from "lucide-react";

export default function SettingsManagement({
  companyInfo,
  securitySettings,
  notificationSettings,
  emailSettings,
  systemMaintenance,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
        System Settings
      </h2>
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto p-1 rounded-lg bg-card shadow-sm border">
          <TabsTrigger
            value="company"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
          >
            Company Info
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
          >
            Email
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md shadow-sm flex flex-col items-center py-2"
          >
            Maintenance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="company" className="mt-0">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue={companyInfo.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email Address</Label>
                <Input id="companyEmail" defaultValue={companyInfo.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone Number</Label>
                <Input id="companyPhone" defaultValue={companyInfo.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Address</Label>
                <Input id="companyAddress" defaultValue={companyInfo.address} />
              </div>
              <Button className="bg-primary text-white hover:bg-primary/90 shadow-sm">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="mt-0">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="items-top flex space-x-2 space-y-2">
                <div className="flex h-6 items-center space-x-2">
                  <input
                    type="checkbox"
                    id="twoFactor"
                    defaultChecked={securitySettings.twoFactor}
                    className="w-5 h-5 rounded accent-primary"
                  />
                </div>
                <div className="grid gap-1 leading-none">
                  <label
                    htmlFor="twoFactor"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Two-Factor for All Admin Accounts
                  </label>
                </div>
              </div>
              <div className="items-top flex space-x-2 space-y-2">
                <div className="flex h-6 items-center space-x-2">
                  <input
                    type="checkbox"
                    id="loginAlerts"
                    defaultChecked={securitySettings.loginAlerts}
                    className="w-5 h-5 rounded accent-primary"
                  />
                </div>
                <div className="grid gap-1 leading-none">
                  <label
                    htmlFor="loginAlerts"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email Alerts for Admin Logins
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">
                  Session Duration (minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  defaultValue={securitySettings.sessionTimeout}
                  className="w-24"
                />
              </div>
              <Button className="bg-primary text-white hover:bg-primary/90 shadow-sm">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-0">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="items-top flex space-x-2 space-y-2">
                <div className="flex h-6 items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newClient"
                    defaultChecked={notificationSettings.newClient}
                    className="w-5 h-5 rounded accent-primary"
                  />
                </div>
                <div className="grid gap-1 leading-none">
                  <label
                    htmlFor="newClient"
                    className="text-sm font-medium leading-none"
                  >
                    Email when new clients register
                  </label>
                </div>
              </div>
              <div className="items-top flex space-x-2 space-y-2">
                <div className="flex h-6 items-center space-x-2">
                  <input
                    type="checkbox"
                    id="incidentReports"
                    defaultChecked={notificationSettings.incidentReports}
                    className="w-5 h-5 rounded accent-primary"
                  />
                </div>
                <div className="grid gap-1 leading-none">
                  <label
                    htmlFor="incidentReports"
                    className="text-sm font-medium leading-none"
                  >
                    Incident Reports for new incidents
                  </label>
                </div>
              </div>
              <div className="items-top flex space-x-2 space-y-2">
                <div className="flex h-6 items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintenance"
                    defaultChecked={notificationSettings.maintenance}
                    className="w-5 h-5 rounded accent-primary"
                  />
                </div>
                <div className="grid gap-1 leading-none">
                  <label
                    htmlFor="maintenance"
                    className="text-sm font-medium leading-none"
                  >
                    System Maintenance Notifications
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  defaultValue={notificationSettings.adminEmail}
                />
              </div>
              <Button className="bg-primary text-white hover:bg-primary/90 shadow-sm">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="email" className="mt-0">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure SMTP settings for system emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" defaultValue={emailSettings.smtpHost} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    defaultValue={emailSettings.smtpPort}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue={emailSettings.username} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="items-top flex space-x-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useSSL"
                    defaultChecked={emailSettings.useSSL}
                    className="w-5 h-5 rounded accent-primary"
                  />
                </div>
                <div className="grid gap-1 leading-none">
                  <label
                    htmlFor="useSSL"
                    className="text-sm font-medium leading-none"
                  >
                    Use SSL/TLS
                  </label>
                </div>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="maintenance" className="mt-0">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>
                System maintenance and backup operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-muted rounded-md shadow-sm gap-4">
                <div className="text-center sm:text-left">
                  <p className="font-medium text-foreground">Last Backup</p>
                  <p className="text-sm text-secondary">
                    {systemMaintenance.lastBackup}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="shadow-sm">
                  Backup Database
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-muted rounded-md shadow-sm gap-4">
                <div className="text-center sm:text-left">
                  <p className="font-medium text-foreground">
                    Next Scheduled Backup
                  </p>
                  <p className="text-sm text-secondary">
                    {systemMaintenance.nextBackup}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="shadow-sm flex-1">
                  <Clock className="h-4 w-4 mr-2" /> Clear Cache
                </Button>
                <Button variant="outline" className="shadow-sm flex-1">
                  <Shield className="h-4 w-4 mr-2" /> Security Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
