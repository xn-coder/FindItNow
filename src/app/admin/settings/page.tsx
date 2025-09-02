
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { itemCategories as defaultCategories } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Edit, PlusCircle, Trash2 } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Settings</h1>

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
