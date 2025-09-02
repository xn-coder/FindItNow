
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { itemCategories as defaultCategories } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const emailTemplates = [
    { id: "claim-approval", name: "Claim Approval" },
    { id: "password-reset", name: "Password Reset" },
    { id: "new-enquiry", name: "New Enquiry Notification" },
    { id: "user-otp", name: "User Verification OTP" },
    { id: "partner-otp", name: "Partner Verification OTP" },
    { id: "password-otp", name: "Password Reset OTP" },
];

export default function SettingsPage() {
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<{id: string, name: string} | null>(null);
    const { toast } = useToast();

    const handleSaveTemplate = () => {
        toast({
            title: "Template Saved",
            description: `Changes to the "${currentTemplate?.name}" template have been saved.`,
        });
        setIsTemplateDialogOpen(false);
    };

    return (
        <>
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
                           {emailTemplates.map((template) => (
                             <Dialog key={template.id} open={isTemplateDialogOpen && currentTemplate?.id === template.id} onOpenChange={(isOpen) => {
                                 setIsTemplateDialogOpen(isOpen);
                                 if (!isOpen) setCurrentTemplate(null);
                             }}>
                                <DialogTrigger asChild onClick={() => {
                                    setCurrentTemplate(template);
                                    setIsTemplateDialogOpen(true);
                                }}>
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md cursor-pointer hover:bg-muted">
                                        <p>{template.name}</p>
                                        <Button variant="outline" size="sm" className="pointer-events-none"><Edit className="mr-2 h-4 w-4"/>Edit</Button>
                                    </div>
                                </DialogTrigger>
                             </Dialog>
                           ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Template: {currentTemplate?.name}</DialogTitle>
                    <DialogDescription>
                        Make changes to the email template. Use placeholders like `{{name}}` where appropriate.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" defaultValue={`Regarding your item on FindItNow`} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" rows={10} defaultValue={`Hello {{name}},\n\nThis is a notification regarding your recent activity on FindItNow.\n\nThank you,\nThe FindItNow Team`} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSaveTemplate}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </>
    );
}
