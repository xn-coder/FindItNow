
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Mail, Phone, MessageSquare, Twitter, Linkedin, Facebook } from "lucide-react";
import Link from "next/link";
import { sendEmail } from "@/lib/email";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const contactFormSchema = z.object({
      name: z.string().min(2, t('validation.nameRequired')),
      email: z.string().email(t('validation.emailInvalid')),
      subject: z.string().min(5, t('validation.subjectMin')),
      message: z.string().min(10, t('validation.messageMin')).max(1000, t('validation.messageMax')),
    });

    const form = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
          name: "",
          email: "",
          subject: "",
          message: "",
        },
    });
    
    async function onSubmit(values: z.infer<typeof contactFormSchema>) {
        setIsLoading(true);
        try {
             const messageBody = `
                You have received a new message from your website contact form.
                <br><br>
                <b>Name:</b> ${values.name}
                <br>
                <b>Email:</b> ${values.email}
                <br><br>
                <b>Message:</b>
                <p>${values.message}</p>
            `;

            // Note: Contact form might not fit the new template model perfectly.
            // For now, we'll construct the subject and message here and pass them
            // as variables to a generic template if one existed, or just send directly.
            // This part of the code is left as-is because it doesn't use a template.
            const emailJsEnabled = process.env.NEXT_PUBLIC_EMAILJS_ENABLED !== 'false';
            if (emailJsEnabled) {
                // This is a custom email, not using the new template system.
                // To adapt, you might create a 'contact-form' template and pass variables.
                // For now, keeping the original logic.
                const emailjs = (await import('@emailjs/browser')).default;
                await emailjs.send(
                    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                    {
                        to_email: process.env.NEXT_PUBLIC_CONTACT_FORM_RECEIVER_EMAIL || "your_support_email@example.com",
                        subject: `Contact Form: ${values.subject}`,
                        message: messageBody,
                        from_name: values.name,
                        from_email: values.email
                    },
                    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
                );
            }


            toast({
                title: t('contactToastSuccessTitle'),
                description: t('contactToastSuccessDesc'),
            });
            form.reset();
        } catch (error) {
             toast({
                variant: "destructive",
                title: t('contactToastErrorTitle'),
                description: t('contactToastErrorDesc'),
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold font-headline">{t('contactTitle')}</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                   {t('contactSubtitle')}
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                           <MessageSquare className="h-7 w-7 text-primary"/>
                            {t('contactFormTitle')}
                        </CardTitle>
                        <CardDescription>
                            {t('contactFormDesc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>{t('contactNameLabel')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('contactNamePlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>{t('contactEmailLabel')}</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder={t('contactEmailPlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>{t('contactSubjectLabel')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('contactSubjectPlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>{t('contactMessageLabel')}</FormLabel>
                                        <FormControl>
                                            <Textarea rows={5} placeholder={t('contactMessagePlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('contactSubmitButton')}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">{t('contactInfoTitle')}</CardTitle>
                            <CardDescription>
                                {t('contactInfoDesc')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Mail className="h-6 w-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold">{t('contactInfoEmail')}</h3>
                                    <a href="mailto:support@finditnow.com" className="text-muted-foreground hover:text-primary transition-colors">
                                        support@finditnow.com
                                    </a>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <Phone className="h-6 w-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold">{t('contactInfoPhone')}</h3>
                                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">{t('contactFollowTitle')}</CardTitle>
                            <CardDescription>
                                {t('contactFollowDesc')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                           <Button asChild variant="outline" size="icon">
                               <Link href="#" aria-label="Twitter">
                                   <Twitter className="h-5 w-5"/>
                               </Link>
                           </Button>
                           <Button asChild variant="outline" size="icon">
                               <Link href="#" aria-label="LinkedIn">
                                   <Linkedin className="h-5 w-5"/>
                               </Link>
                           </Button>
                           <Button asChild variant="outline" size="icon">
                               <Link href="#" aria-label="Facebook">
                                   <Facebook className="h-5 w-5"/>
                               </Link>
                           </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
