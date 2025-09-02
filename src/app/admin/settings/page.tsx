
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

const templateContents: Record<string, { subject: string, message: string }> = {
    "claim-approval": {
        subject: "Your claim for {{itemName}} has been approved!",
        message: "Hello {{name}},\n\nGood news! Your claim for the item \"{{itemName}}\" has been approved by the owner. You can now proceed to chat with them to arrange the pickup.\n\nThank you,\nThe FindItNow Team"
    },
    "password-reset": {
        subject: "Your FindItNow Password Reset Request",
        message: "Hello {{name}},\n\nWe received a request to reset your password. Please use the link below to proceed.\n\nIf you did not request this, you can safely ignore this email.\n\nThank you,\nThe FindItNow Team"
    },
    "new-enquiry": {
        subject: "New Enquiry for your item: {{itemName}}",
        message: "Hello {{name}},\n\nYou have received a new enquiry about your item \"{{itemName}}\". Please log in to your account to view the details and respond.\n\nThank you,\nThe FindItNow Team"
    },
    "user-otp": {
        subject: "Your FindItNow Verification Code",
        message: "Hello,\n\nYour one-time password (OTP) for verifying your account is: {{otp}}\n\nThis code will expire in 10 minutes.\n\nThank you,\nThe FindItNow Team"
    },
    "partner-otp": {
        subject: "Your FindItNow Partner Verification Code",
        message: "Hello,\n\nYour one-time password (OTP) for verifying your partner account is: {{otp}}\n\nThis code will expire in 10 minutes.\n\nThank you,\nThe FindItNow Team"
    },
    "password-otp": {
        subject: "Your FindItNow Password Reset Code",
        message: "Hello,\n\nYour one-time password (OTP) for resetting your password is: {{otp}}\n\nIf you did not request this, please ignore this email.\n\nThank you,\nThe FindItNow Team"
    }
};


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
    
    const handleOpenDialog = (template: {id: string, name: string}) => {
        setCurrentTemplate(template);
        setIsTemplateDialogOpen(true);
    };

    const currentContent = currentTemplate ? templateContents[currentTemplate.id] : null;

    return (
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
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
                                <DialogTrigger key={template.id} asChild onClick={() => handleOpenDialog(template)}>
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md cursor-pointer hover:bg-muted">
                                        <p>{template.name}</p>
                                        <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4"/>Edit</Button>
                                    </div>
                                </DialogTrigger>
                           ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {currentTemplate && currentContent && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Template: {currentTemplate.name}</DialogTitle>
                        <DialogDescription>
                            Make changes to the email template. Use placeholders like `{'{{'}name{'}}'}` where appropriate.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" defaultValue={currentContent.subject} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" rows={10} defaultValue={currentContent.message} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSaveTemplate}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}
