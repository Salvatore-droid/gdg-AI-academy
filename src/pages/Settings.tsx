import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, HelpCircle, Save, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  bio?: string;
  created_at: string;
  last_login: string;
}

interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  weekly_digest: boolean;
  profile_visibility: boolean;
  show_progress: boolean;
  dark_mode: boolean;
  language: string;
}

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth';
          return;
        }

        // Fetch user profile
        const profileResponse = await fetch('http://localhost:8000/api/auth/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch user settings
        const settingsResponse = await fetch('http://localhost:8000/api/settings/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (profileResponse.ok && settingsResponse.ok) {
          const profileData = await profileResponse.json();
          const settingsData = await settingsResponse.json();
          
          setProfile(profileData);
          setSettings(settingsData);
        } else {
          throw new Error('Failed to fetch settings data');
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettingsData();
  }, [toast]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/settings/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: profile?.full_name,
          bio: profile?.bio,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsUpdate = async (key: keyof UserSettings, value: boolean | string) => {
    if (!settings) return;

    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/settings/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      // Revert on error
      setSettings(settings);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/auth/change-password/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Password changed successfully",
        });
        setShowChangePassword(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleContactSupport = () => {
    window.open('mailto:support@gdgal.com?subject=Support Request&body=Hello, I need help with...', '_blank');
  };

  const handleViewFAQs = () => {
    window.open('/faqs', '_blank');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

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
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="John Doe" 
                  className="rounded-xl"
                  value={profile?.full_name || ''}
                  onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john.doe@example.com" 
                  className="rounded-xl bg-muted"
                  value={profile?.email || ''}
                  disabled
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input 
                id="bio" 
                placeholder="Tell us about yourself" 
                className="rounded-xl"
                value={profile?.bio || ''}
                onChange={(e) => setProfile(prev => prev ? {...prev, bio: e.target.value} : null)}
              />
            </div>
            <Button type="submit" className="rounded-xl gap-2" disabled={saving}>
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
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
              <Switch 
                checked={settings?.email_notifications || false}
                onCheckedChange={(checked) => handleSettingsUpdate('email_notifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about new content</p>
              </div>
              <Switch 
                checked={settings?.push_notifications || false}
                onCheckedChange={(checked) => handleSettingsUpdate('push_notifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Summary of your weekly progress</p>
              </div>
              <Switch 
                checked={settings?.weekly_digest || false}
                onCheckedChange={(checked) => handleSettingsUpdate('weekly_digest', checked)}
              />
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
              <Switch 
                checked={settings?.profile_visibility || false}
                onCheckedChange={(checked) => handleSettingsUpdate('profile_visibility', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Progress</Label>
                <p className="text-sm text-muted-foreground">Display your learning progress</p>
              </div>
              <Switch 
                checked={settings?.show_progress || false}
                onCheckedChange={(checked) => handleSettingsUpdate('show_progress', checked)}
              />
            </div>
            <Separator />
            
            {showChangePassword ? (
              <form onSubmit={handlePasswordChange} className="space-y-4 p-4 bg-muted/30 rounded-xl">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    className="rounded-xl"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({...prev, current_password: e.target.value}))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="rounded-xl"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({...prev, new_password: e.target.value}))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="rounded-xl"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(prev => ({...prev, confirm_password: e.target.value}))}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="rounded-xl" disabled={saving}>
                    {saving ? "Changing..." : "Change Password"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="rounded-xl"
                    onClick={() => setShowChangePassword(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <Button 
                variant="outline" 
                className="rounded-xl gap-2"
                onClick={() => setShowChangePassword(true)}
              >
                <Shield className="w-4 h-4" />
                Change Password
              </Button>
            )}
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
              <Switch 
                checked={settings?.dark_mode || false}
                onCheckedChange={(checked) => handleSettingsUpdate('dark_mode', checked)}
              />
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
                <Button className="rounded-xl" onClick={handleContactSupport}>
                  Contact Support
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={handleViewFAQs}>
                  View FAQs
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}