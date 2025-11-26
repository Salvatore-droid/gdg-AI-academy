import { motion } from "framer-motion";
import { Settings, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const AdminSettings = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-google-blue" />
                General Settings
              </CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="Google AI Learning Platform" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" defaultValue="support@googleai.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-students">Max Students per Course</Label>
                <Input id="max-students" type="number" defaultValue="500" />
              </div>
              <Button className="w-full bg-google-blue hover:bg-google-blue/90 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-google-red" />
                Feature Toggles
              </CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="community">Community Forums</Label>
                  <p className="text-sm text-muted-foreground">Enable discussion forums</p>
                </div>
                <Switch id="community" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ai-labs">AI Labs</Label>
                  <p className="text-sm text-muted-foreground">Enable hands-on AI projects</p>
                </div>
                <Switch id="ai-labs" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="certificates">Certificates</Label>
                  <p className="text-sm text-muted-foreground">Allow certificate generation</p>
                </div>
                <Switch id="certificates" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="registrations">New Registrations</Label>
                  <p className="text-sm text-muted-foreground">Allow new user signups</p>
                </div>
                <Switch id="registrations" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-google-yellow" />
                Email Settings
              </CardTitle>
              <CardDescription>Configure email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" defaultValue="smtp.gmail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" type="number" defaultValue="587" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" type="email" defaultValue="noreply@googleai.com" />
              </div>
              <Button className="w-full bg-google-yellow hover:bg-google-yellow/90 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Email Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-google-green" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all admins</p>
                </div>
                <Switch id="2fa" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="session">Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">Auto-logout inactive users</p>
                </div>
                <Switch id="session" defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="timeout-duration">Timeout Duration (minutes)</Label>
                <Input id="timeout-duration" type="number" defaultValue="30" />
              </div>
              <Button className="w-full bg-google-green hover:bg-google-green/90 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
