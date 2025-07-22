
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Item } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { sendEmail } from '@/lib/email';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const foundItemFormSchema = z.object({
  finderName: z.string().min(2, 'Your name is required.'),
  finderEmail: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Please provide a message for the owner (at least 10 characters).'),
  location: z.string().min(3, "Location must be at least 3 characters.").max(100),
  date: z.date({ required_error: "A date is required." }),
});

type FoundItemFormProps = {
  item: Item;
};

export function FoundItemForm({ item }: FoundItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof foundItemFormSchema>>({
    resolver: zodResolver(foundItemFormSchema),
    defaultValues: {
      finderName: '',
      finderEmail: '',
      location: '',
      message: `Hi, I believe I have found your "${item.name}". Please contact me to arrange its return.`,
    },
  });

  async function onSubmit(values: z.infer<typeof foundItemFormSchema>) {
    setIsLoading(true);
    
    try {
        // Send email to the item owner
        await sendEmail({
            to_email: item.contact,
            subject: `Someone may have found your item: "${item.name}"`,
            message: `
              A person has reported finding your item. Here are their details:
              <br><br>
              <b>Finder's Name:</b> ${values.finderName}
              <br>
              <b>Finder's Email:</b> ${values.finderEmail}
              <br>
              <b>Found Location:</b> ${values.location}
              <br>
              <b>Found Date:</b> ${format(values.date, "PPP")}
              <br><br>
              <b>Message:</b>
              <p>${values.message}</p>
              <br>
              Please reply to ${values.finderEmail} to coordinate the return.
            `,
        });

        // Save the enquiry to the 'claims' collection
        await addDoc(collection(db, "claims"), {
            itemId: item.id,
            itemOwnerId: item.userId,
            fullName: values.finderName,
            email: values.finderEmail,
            proof: values.message, // Re-using the 'proof' field for the message
            location: values.location,
            date: values.date,
            submittedAt: serverTimestamp(),
            type: 'message' // Differentiate from a claim
        });

        toast({
            title: 'Message Sent!',
            description: "We've sent your message to the item's owner and logged your enquiry. They will contact you shortly if it's a match.",
        });
        form.reset();

    } catch (error) {
         console.error("Error sending message: ", error);
         toast({
            variant: "destructive",
            title: 'Message Failed',
            description: "There was an error sending your message. Please try again later.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card className="border-2">
      <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Have you found this item?</CardTitle>
          <CardDescription>
              If you have found this item, please use the form below to contact the owner. Your email will be shared so they can reply to you.
          </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="finderName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="finderEmail"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Contact Email</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Location Found</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Grand Central Terminal" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col pt-2">
                        <FormLabel>Date Found</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date > new Date() || date < new Date("2000-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Message to Owner</FormLabel>
                    <FormControl>
                        <Textarea
                        rows={5}
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Message
                </Button>
            </form>
        </Form>
      </CardContent>
    </Card>
  );
}
