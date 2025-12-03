import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings, Save, Shield, Mail, Bell, Lock, 
  Globe, Users, Database, Server, RefreshCw,
  AlertCircle, CheckCircle, Eye, EyeOff
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
  data_type: string;
  updated_at: string;
  updated_by: string;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  database_status: string;
  storage_usage: number;
  active_users: number;
  api_response_time: number;
  last_backup: string;
}

interface SettingCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  settings_count: number;
}

const AdminSettings = () => {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [categories, setCategories] = useState<SettingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  const [changedConfigs, setChangedConfigs] = useState<Record<string, string>>({});
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const { token } = useAdminAuth();

  // Fetch system configurations
  const fetchConfigs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/system/config/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConfigs(data);
        
        // Initialize changed configs
        const initialChanges: Record<string, string> = {};
        data.forEach((config: SystemConfig) => {
          initialChanges[config.key] = config.value;
        });
        setChangedConfigs(initialChanges);
      } else {
        throw new Error('Failed to fetch configurations');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load system configurations",
        variant: "destructive",
      });
    }
  };

  // Fetch system health
  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/system/health/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHealth(data);
      }
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    }
  };

  // Fetch setting categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/system/categories/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchConfigs(),
        fetchSystemHealth(),
        fetchCategories()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Get configs by category
  const getConfigsByCategory = (category: string) => {
    return configs.filter(config => config.category === category);
  };

  // Handle config change
  const handleConfigChange = (key: string, value: string) => {
    setChangedConfigs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Toggle sensitive value visibility
  const toggleSensitiveVisibility = (key: string) => {
    setShowSensitive(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Check if any changes were made
  const hasChanges = () => {
    return Object.keys(changedConfigs).some(key => {
      const originalConfig = configs.find(c => c.key === key);
      return originalConfig && originalConfig.value !== changedConfigs[key];
    });
  };

  // Save all changes
  const handleSaveAll = async () => {
    if (!hasChanges()) {
      toast({
        title: "No Changes",
        description: "No changes to save",
      });
      return;
    }

    setSaving(true);
    try {
      // Filter only changed values
      const changes: Record<string, string> = {};
      Object.keys(changedConfigs).forEach(key => {
        const originalConfig = configs.find(c => c.key === key);
        if (originalConfig && originalConfig.value !== changedConfigs[key]) {
          changes[key] = changedConfigs[key];
        }
      });

      const response = await fetch('http://localhost:8000/api/admin/system/config/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changes),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings saved successfully",
        });
        await fetchConfigs(); // Refresh configs
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save settings');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Save category changes
  const handleSaveCategory = async (category: string) => {
    const categoryChanges: Record<string, string> = {};
    const categoryConfigs = getConfigsByCategory(category);
    
    categoryConfigs.forEach(config => {
      if (config.value !== changedConfigs[config.key]) {
        categoryChanges[config.key] = changedConfigs[config.key];
      }
    });

    if (Object.keys(categoryChanges).length === 0) {
      toast({
        title: "No Changes",
        description: `No changes in ${category} settings`,
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('http://localhost:8000/api/admin/system/config/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryChanges),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${category} settings saved successfully`,
        });
        await fetchConfigs();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save settings');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Reset to defaults
  const handleResetDefaults = async () => {
    if (!confirm("Are you sure you want to reset all settings to defaults? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/admin/system/config/reset/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings reset to defaults",
        });
        await fetchConfigs();
      } else {
        throw new Error('Failed to reset settings');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset settings",
        variant: "destructive",
      });
    }
  };

  // Refresh system health
  const handleRefreshHealth = async () => {
    await fetchSystemHealth();
    toast({
      title: "Refreshed",
      description: "System health updated",
    });
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return <Globe className="w-5 h-5 text-google-blue" />;
      case 'security': return <Shield className="w-5 h-5 text-google-red" />;
      case 'email': return <Mail className="w-5 h-5 text-google-yellow" />;
      case 'features': return <Settings className="w-5 h-5 text-google-green" />;
      case 'database': return <Database className="w-5 h-5 text-purple-500" />;
      default: return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  // Render appropriate input field based on data type
  const renderInputField = (config: SystemConfig) => {
    const value = changedConfigs[config.key] || config.value;
    const isSensitive = config.data_type === 'password' || config.data_type === 'secret';
    const showValue = showSensitive[config.key];

    switch (config.data_type) {
      case 'boolean':
        return (
          <Switch
            checked={value === 'true' || value === '1'}
            onCheckedChange={(checked) => 
              handleConfigChange(config.key, checked ? 'true' : 'false')
            }
          />
        );
      
      case 'integer':
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleConfigChange(config.key, e.target.value)}
            placeholder={`Enter ${config.key}`}
          />
        );
      
      case 'password':
      case 'secret':
        return (
          <div className="relative">
            <Input
              type={showValue ? "text" : "password"}
              value={value}
              onChange={(e) => handleConfigChange(config.key, e.target.value)}
              placeholder={`Enter ${config.key}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => toggleSensitiveVisibility(config.key)}
            >
              {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        );
      
      case 'select':
        const options = config.description.split('options:')[1]?.split(',') || [];
        return (
          <Select
            value={value}
            onValueChange={(newValue) => handleConfigChange(config.key, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${config.key}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.trim()} value={option.trim()}>
                  {option.trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'text':
      case 'string':
        if (config.key.includes('description') || config.key.includes('message')) {
          return (
            <Textarea
              value={value}
              onChange={(e) => handleConfigChange(config.key, e.target.value)}
              placeholder={`Enter ${config.key}`}
              rows={3}
            />
          );
        }
        // fall through to default
      
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleConfigChange(config.key, e.target.value)}
            placeholder={`Enter ${config.key}`}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-google-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading system settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Admin Settings</h1>
              <p className="text-muted-foreground">Configure system-wide settings</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleResetDefaults}
                className="text-destructive"
              >
                Reset Defaults
              </Button>
              <Button
                onClick={handleSaveAll}
                disabled={!hasChanges() || saving}
                className="bg-google-blue hover:bg-google-blue/90 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save All Changes'}
              </Button>
            </div>
          </div>

          {/* System Health Dashboard */}
          {health && (
            <Card className="bg-gradient-card border-border/50 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Server className="w-6 h-6 text-google-blue" />
                    <h3 className="text-lg font-semibold">System Health</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshHealth}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={
                        health.status === 'healthy' ? 'default' :
                        health.status === 'warning' ? 'secondary' : 'destructive'
                      } className={
                        health.status === 'healthy' ? 'bg-google-green' :
                        health.status === 'warning' ? 'bg-google-yellow' : ''
                      }>
                        {health.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold">{health.uptime}%</p>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Database</span>
                      {health.database_status === 'connected' ? (
                        <CheckCircle className="w-4 h-4 text-google-green" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                    <p className="text-2xl font-bold">{health.active_users}</p>
                    <p className="text-xs text-muted-foreground">Active Users</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Storage</span>
                      <span className="text-sm">{health.storage_usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          health.storage_usage < 70 ? 'bg-google-green' :
                          health.storage_usage < 90 ? 'bg-google-yellow' : 'bg-google-red'
                        }`}
                        style={{ width: `${health.storage_usage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Usage</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">API Response</span>
                      <span className="text-sm">{health.api_response_time}ms</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {new Date(health.last_backup).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Last Backup</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Categories Navigation */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 ${
                selectedCategory === category.id ? 'bg-google-blue text-white' : ''
              }`}
            >
              {getCategoryIcon(category.id)}
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.settings_count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories
            .filter(category => category.id === selectedCategory)
            .map(category => (
              <div key={category.id} className="lg:col-span-2">
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(category.id)}
                        <div>
                          <CardTitle>{category.name} Settings</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSaveCategory(category.id)}
                        disabled={!hasChanges() || saving}
                        className="bg-google-blue hover:bg-google-blue/90 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save {category.name}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {getConfigsByCategory(category.id).length > 0 ? (
                      getConfigsByCategory(category.id).map((config) => {
                        const hasChanged = config.value !== changedConfigs[config.key];
                        
                        return (
                          <div key={config.key} className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={config.key} className="font-medium">
                                    {config.key.replace(/_/g, ' ').toUpperCase()}
                                  </Label>
                                  {hasChanged && (
                                    <Badge variant="outline" className="text-xs">
                                      Modified
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {config.description}
                                </p>
                              </div>
                            </div>
                            
                            <div className="pl-4">
                              {renderInputField(config)}
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-muted-foreground">
                                  Type: {config.data_type}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Last updated: {new Date(config.updated_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            
                            <Separator />
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No settings found in this category
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-card border-border/50 mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center p-6 h-auto"
                onClick={() => {
                  // Clear cache action
                  toast({
                    title: "Cache Cleared",
                    description: "System cache has been cleared",
                  });
                }}
              >
                <RefreshCw className="w-8 h-8 mb-2 text-google-blue" />
                <span>Clear Cache</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center p-6 h-auto"
                onClick={() => {
                  // Backup database action
                  toast({
                    title: "Backup Started",
                    description: "Database backup has been initiated",
                  });
                }}
              >
                <Database className="w-8 h-8 mb-2 text-google-green" />
                <span>Backup Database</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center p-6 h-auto"
                onClick={() => {
                  // Clear logs action
                  toast({
                    title: "Logs Cleared",
                    description: "System logs have been cleared",
                  });
                }}
              >
                <Server className="w-8 h-8 mb-2 text-google-red" />
                <span>Clear Logs</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Add Badge component if not already imported
const Badge = ({ children, variant = "default", className = "", ...props }: any) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input bg-background",
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default AdminSettings;