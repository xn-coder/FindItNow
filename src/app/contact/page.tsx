
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

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters long.").max(1000, "Message must be less than 1000 characters."),
});


export default function ContactPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

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
            const emailJsEnabled = process.env.NEXT_PUBLIC_EMAILJS_ENABLED !== 'false';
            if (emailJsEnabled) {
                await sendEmail({
                    to_email: "your_support_email@example.com", // Your support email
                    subject: `Contact Form: ${values.subject}`,
                    message: `
                        You have received a new message from your website contact form.
                        <br><br>
                        <b>Name:</b> ${values.name}
                        <br>
                        <b>Email:</b> ${values.email}
                        <br><br>
                        <b>Message:</b>
                        <p>${values.message}</p>
                    `,
                    from_name: values.name,
                    from_email: values.email
                });
            }

            toast({
                title: "Message Sent!",
                description: "Thank you for contacting us. We'll get back to you shortly.",
            });
            form.reset();
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Failed to Send Message",
                description: "There was an issue sending your message. Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold font-headline">Contact Us</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                   We're here to help. Reach out to us with any questions or feedback.
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                           <MessageSquare className="h-7 w-7 text-primary"/>
                            Send us a Message
                        </CardTitle>
                        <CardDescription>
                            Fill out the form and we'll get back to you as soon as possible.
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
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
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
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="you@example.com" {...field} />
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
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Question about my report" {...field} />
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
                                        <FormLabel>Your Message</FormLabel>
                                        <FormControl>
                                            <Textarea rows={5} placeholder="Please describe your issue or question in detail..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Contact Information</CardTitle>
                            <CardDescription>
                                Prefer to reach us directly? Here's how.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Mail className="h-6 w-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <a href="mailto:support@finditnow.com" className="text-muted-foreground hover:text-primary transition-colors">
                                        support@finditnow.com
                                    </a>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <Phone className="h-6 w-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold">Phone</h3>
                                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Follow Us</CardTitle>
                            <CardDescription>
                                Stay connected with us on social media.
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
