"use client";

import { useState, useEffect } from 'react';
import { maintenanceDb } from '@/lib/maintenance-firebase';
import { ref, set, onValue } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function MaintenancePage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const configRef = ref(maintenanceDb, 'maintenance');
    const unsubscribe = onValue(configRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setIsEnabled(data.isEnabled);
        setMessage(data.message);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleSave = () => {
    setLoading(true);
    const configRef = ref(maintenanceDb, 'maintenance');
    set(configRef, { isEnabled, message })
      .then(() => {
        toast({
          title: "Settings Saved",
          description: "Maintenance settings have been updated successfully.",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to save settings: ${error.message}`,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Maintenance Mode Control</CardTitle>
          <CardDescription>
            Enable or disable maintenance mode for the entire website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Enable Maintenance Mode
              </p>
              <p className="text-sm text-muted-foreground">
                When enabled, all visitors will see the maintenance page.
              </p>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
              aria-readonly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Maintenance Message</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., We'll be back in an hour."
            />
          </div>
          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
