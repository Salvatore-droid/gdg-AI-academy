import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function Settings() {
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-lg text-muted-foreground ml-[60px]">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Profile Settings */}
        <Card className="p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-google-blue" />
            <h2 className="text-xl font-bold text-foreground">Profile Settings</h2>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" placeholder="Tell us about yourself" className="rounded-xl" />
            </div>
            <Button className="rounded-xl">Save Changes</Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-google-yellow" />
            <h2 className="text-xl font-bold text-foreground">Notifications</h2>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your courses</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about new content</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Summary of your weekly progress</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-google-green" />
            <h2 className="text-xl font-bold text-foreground">Privacy & Security</h2>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Progress</Label>
                <p className="text-sm text-muted-foreground">Display your learning progress</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <Button variant="outline" className="rounded-xl">Change Password</Button>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-google-red" />
            <h2 className="text-xl font-bold text-foreground">Appearance</h2>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch to dark theme</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Language</Label>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">English (US)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Help & Support */}
        <Card className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-google flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is here to help you with any questions or issues.
              </p>
              <div className="flex gap-3">
                <Button className="rounded-xl">Contact Support</Button>
                <Button variant="outline" className="rounded-xl">View FAQs</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
