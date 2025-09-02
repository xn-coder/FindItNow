
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Edit, PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getEmailTemplates, getItemCategories, updateSettings } from "@/lib/actions";
import type { Category, EmailTemplate } from "@/lib/types";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editedSubject, setEditedSubject] = useState("");
    const [editedMessage, setEditedMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const { t } = useTranslation();

    const { toast } = useToast();

    const fetchSettings = async () => {
        const [fetchedTemplates, fetchedCategories] = await Promise.all([
            getEmailTemplates(),
            getItemCategories(),
        ]);
        setEmailTemplates(fetchedTemplates);
        setCategories(fetchedCategories);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;

        startTransition(async () => {
            const newCategory = {
                id: (categories.length + 1).toString(), // Simple ID generation
                name: newCategoryName.trim().toLowerCase(),
            };
            const updatedCategories = [...categories, newCategory];
            try {
                await updateSettings('categories', { list: updatedCategories });
                setCategories(updatedCategories);
                setNewCategoryName("");
                toast({ title: t('adminCategoryAdded') });
            } catch (error) {
                toast({ title: "Error", description: "Failed to add category.", variant: "destructive" });
            }
        });
    };

    const handleDeleteCategory = (categoryId: string) => {
        startTransition(async () => {
            const updatedCategories = categories.filter(c => c.id !== categoryId);
            try {
                await updateSettings('categories', { list: updatedCategories });
                setCategories(updatedCategories);
                toast({ title: t('adminCategoryRemoved') });
            } catch (error) {
                toast({ title: "Error", description: "Failed to remove category.", variant: "destructive" });
            }
        });
    };

    const handleSaveTemplate = () => {
        if (!currentTemplate) return;

        startTransition(async () => {
            const updatedTemplates = emailTemplates.map(t =>
                t.id === currentTemplate.id
                    ? { ...t, subject: editedSubject, message: editedMessage }
                    : t
            );
            try {
                await updateSettings('emailTemplates', { list: updatedTemplates });
                setEmailTemplates(updatedTemplates);
                toast({ title: t('adminTemplateSaved') });
                setIsTemplateDialogOpen(false);
            } catch (error) {
                toast({ title: "Error", description: "Failed to save template.", variant: "destructive" });
            }
        });
    };

    const handleOpenDialog = (template: EmailTemplate) => {
        setCurrentTemplate(template);
        setEditedSubject(template.subject);
        setEditedMessage(template.message);
        setIsTemplateDialogOpen(true);
    };

    return (
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <div className="space-y-8">
                <h1 className="text-3xl font-bold font-headline">{t('settings')}</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('adminCategoryTitle')}</CardTitle>
                        <CardDescription>{t('adminCategoryDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder={t('adminNewCategoryPlaceholder')}
                                    className="max-w-xs"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                />
                                <Button onClick={handleAddCategory} disabled={isPending}>
                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                    {t('adminAddCategory')}
                                </Button>
                            </div>
                            <Separator />
                            <div className="flex flex-wrap gap-2">
                                {categories.map(category => (
                                    <Badge key={category.id} variant="secondary" className="text-sm py-1 px-3 capitalize">
                                        {category.name}
                                        <button
                                            className="ml-2 rounded-full p-0.5 hover:bg-muted-foreground/20"
                                            onClick={() => handleDeleteCategory(category.id)}
                                            disabled={isPending}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('adminEmailTitle')}</CardTitle>
                        <CardDescription>{t('adminEmailDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {emailTemplates.map((template) => (
                                <DialogTrigger key={template.id} asChild onClick={() => handleOpenDialog(template)}>
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md cursor-pointer hover:bg-muted">
                                        <p>{template.name}</p>
                                        <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" />{t('edit')}</Button>
                                    </div>
                                </DialogTrigger>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {currentTemplate && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('adminEditTemplateTitle')}: {currentTemplate.name}</DialogTitle>
                        <DialogDescription>
                           {t('adminEditTemplateDesc')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">{t('contactSubjectLabel')}</Label>
                            <Input
                                id="subject"
                                value={editedSubject}
                                onChange={(e) => setEditedSubject(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">{t('contactMessageLabel')}</Label>
                            <Textarea
                                id="message"
                                rows={10}
                                value={editedMessage}
                                onChange={(e) => setEditedMessage(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isPending}>{t('cancel')}</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSaveTemplate} disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('adminSaveChanges')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}
