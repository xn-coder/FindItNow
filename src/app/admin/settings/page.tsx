"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { itemCategories as defaultCategories } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit, PlusCircle, Save, Trash2, Wrench } from "lucide-react";
import { maintenanceDb } from "@/lib/maintenance-firebase";
import { ref, onValue, set } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type MaintenanceConfig = {
    isEnabled: boolean;
    message: string;
};

export default function SettingsPage() {
    const { toast } = useToast();
    const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const configRef = ref(maintenanceDb, '/Lost&Found');
        const unsubscribe = onValue(configRef, (snapshot) => {
            if (snapshot.exists()) {
                setMaintenanceConfig(snapshot.val());
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleMaintenanceToggle = (isEnabled: boolean) => {
        if (maintenanceConfig) {
            const newConfig = { ...maintenanceConfig, isEnabled };
            set(ref(maintenanceDb, '/Lost&Found'), newConfig)
                .then(() => {
                    toast({
                        title: "Settings Updated",
                        description: `Maintenance mode has been ${isEnabled ? 'enabled' : 'disabled'}.`,
                    });
                })
                .catch(error => {
                     toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to update maintenance settings.",
                    });
                });
        }
    };

     const handleMaintenanceMessageChange = (e: React.ChangeEvent<Input>) => {
        if (maintenanceConfig) {
            setMaintenanceConfig({ ...maintenanceConfig, message: e.target.value });
        }
    };

    const handleSaveMessage = () => {
         if (maintenanceConfig) {
            set(ref(maintenanceDb, '/Lost&Found/message'), maintenanceConfig.message)
                .then(() => {
                    toast({
                        title: "Message Updated",
                        description: "Maintenance message has been saved.",
                    });
                })
                 .catch(error => {
                     toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to save maintenance message.",
                    });
                });
        }
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Settings</h1>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Wrench className="h-6 w-6 text-primary"/>
                        <CardTitle>Maintenance Mode</CardTitle>
                    </div>
                    <CardDescription>Control site-wide access for maintenance or updates.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-1/4" />
                        </div>
                    ) : maintenanceConfig ? (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="maintenance-mode"
                                    checked={maintenanceConfig.isEnabled}
                                    onCheckedChange={handleMaintenanceToggle}
                                />
                                <Label htmlFor="maintenance-mode">
                                    {maintenanceConfig.isEnabled ? "Maintenance Mode is ON" : "Maintenance Mode is OFF"}
                                </Label>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="maintenance-message">Custom Maintenance Message</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="maintenance-message"
                                        value={maintenanceConfig.message}
                                        onChange={handleMaintenanceMessageChange}
                                        placeholder="E.g., We'll be back shortly!"
                                    />
                                    <Button onClick={handleSaveMessage}><Save className="mr-2 h-4 w-4"/>Save</Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                         <p className="text-muted-foreground">Could not load maintenance settings.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Category Management</CardTitle>
                    <CardDescription>Add, edit, or remove item categories used across the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Input placeholder="New category name..." className="max-w-xs"/>
                            <Button><PlusCircle className="mr-2 h-4 w-4"/>Add Category</Button>
                        </div>
                        <Separator />
                        <div className="flex flex-wrap gap-2">
                            {defaultCategories.map(category => (
                                <Badge key={category} variant="secondary" className="text-sm py-1 px-3 capitalize">
                                    {category}
                                    <button className="ml-2 rounded-full p-0.5 hover:bg-muted-foreground/20"><Edit className="h-3 w-3"/></button>
                                    <button className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"><Trash2 className="h-3 w-3"/></button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription>Customize the content of automated emails sent to users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                            <p>Claim Approval</p>
                            <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4"/>Edit</Button>
                        </div>
                         <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                            <p>Password Reset</p>
                            <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4"/>Edit</Button>
                        </div>
                         <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                            <p>New Enquiry Notification</p>
                            <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4"/>Edit</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
