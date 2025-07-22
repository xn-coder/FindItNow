
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { itemCategories } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useContext } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendEmail } from "@/lib/email";
import { getUserByEmail, createUser } from "@/lib/actions";
import { OtpDialog } from "./otp-dialog";
import { AuthContext, AuthUser } from "@/context/auth-context";
import { useRouter } from "next/navigation";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 characters.").max(50),
  category: z.string({ required_error: "Please select a category." }),
  description: z.string().min(10, "Description must be at least 10 characters.").max(500),
  location: z.string().min(3, "Location must be at least 3 characters.").max(100),
  date: z.date({ required_error: "A date is required." }),
  contact: z.string().email("Please enter a valid email address."),
  image: z.any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

type FormValues = z.infer<typeof formSchema>;

type ReportFormProps = {
  itemType: "lost" | "found";
};

// Helper to convert file to base64
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export function ReportForm({ itemType }: ReportFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [formValues, setFormValues] = useState<FormValues | null>(null);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      location: "",
      contact: "",
    },
  });

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  async function handleInitialSubmit(values: FormValues) {
    setIsLoading(true);
    try {
        const user = await getUserByEmail(values.contact);
        setUserExists(!!user);
        setFormValues(values);

        const emailJsEnabled = process.env.NEXT_PUBLIC_EMAILJS_ENABLED !== 'false';
        let generatedOtp;

        if (emailJsEnabled) {
          generatedOtp = generateOtp();
          await sendEmail({
            to_email: values.contact,
            subject: "Your FindItNow Verification Code",
            message: `Your one-time password is: ${generatedOtp}`,
          });
           toast({
              title: "Verification Required",
              description: "We've sent a one-time password to your email.",
          });
        } else {
          generatedOtp = "123456";
           toast({
              title: "Verification Required (Dev Mode)",
              description: "Enter the default OTP to proceed.",
          });
        }
        
        setOtp(generatedOtp);
        setIsOtpOpen(true);

    } catch (error) {
        console.error("Error during initial submission: ", error);
        toast({
            title: "Error",
            description: "Could not send verification code. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

  async function handleOtpVerification(password?: string) {
    setIsLoading(true);
    if (!formValues) {
        toast({ title: "Something went wrong", description: "Form data is missing.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
        let user: AuthUser | null = await getUserByEmail(formValues.contact) as AuthUser | null;
        let userId = user?.id;

        if (!userExists && password) {
            // Create new user
            const newUser = await createUser({ email: formValues.contact, password });
            userId = newUser.id;
            user = { id: newUser.id, email: formValues.contact };
        } else if (!userExists && !password) {
            toast({ title: "Password Required", description: "Please set a password for your new account.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        if (!userId || !user) {
            throw new Error("Could not verify or create user.");
        }
        
        const imageFile = formValues.image[0];
        const imageUrl = await toBase64(imageFile);

        const docRef = await addDoc(collection(db, "items"), {
            type: itemType,
            name: formValues.name,
            category: formValues.category,
            description: formValues.description,
            location: formValues.location,
            date: formValues.date,
            contact: formValues.contact,
            imageUrl,
            createdAt: serverTimestamp(),
            lat: 40.7580,
            lng: -73.9855,
            userId: userId,
            status: 'open', // New items are always open
        });

        toast({
            title: "Report Submitted!",
            description: `Your ${itemType} item report has been successfully submitted.`,
            variant: "default",
        });

        const emailJsEnabled = process.env.NEXT_PUBLIC_EMAILJS_ENABLED !== 'false';
        if(emailJsEnabled) {
          await sendEmail({
            to_email: formValues.contact,
            subject: `Your ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Item Report Confirmation`,
            message: `Hello,\n\nThis is a confirmation that your report for the following item has been submitted:\n\nItem Name: ${formValues.name}\nCategory: ${formValues.category}\nLocation: ${formValues.location}\nDate: ${format(formValues.date, "PPP")}\n\nYou can view your submission here: ${window.location.origin}/browse?item=${docRef.id}\n\nThank you for using FindItNow.`,
          });
        }


        login(user); // Log the user in
        
        form.reset();
        setIsOtpOpen(false);
        router.push("/account"); // Redirect to account page

    } catch (error) {
        console.error("Error adding document: ", error);
        toast({
            title: "Submission Failed",
            description: "There was an error submitting your report. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }


  const title = itemType === "lost" ? "Report a Lost Item" : "Report a Found Item";
  const description = itemType === "lost"
    ? "Fill in the details of the item you've lost. The more specific, the better!"
    : "Thank you for being a good samaritan! Please provide details of the item you found.";

  return (
    <>
      <Card className="max-w-3xl mx-auto border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleInitialSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Brown Leather Wallet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {itemCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Provide a detailed description of the item, including any unique features." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location {itemType === "lost" ? "Last Seen" : "Found"}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Central Park, near the fountain" {...field} />
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
                      <FormLabel>Date {itemType === "lost" ? "Lost" : "Found"}</FormLabel>
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
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        This email will be used for notifications and to log in to your account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>
                       <FormDescription>
                        Upload a picture of the item. Max file size is 5MB.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <Button type="submit" size="lg" className="w-full md:w-auto shadow-lg hover:shadow-xl transition-shadow" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify and Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <OtpDialog 
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          onVerify={handleOtpVerification}
          expectedOtp={otp}
          isNewUser={!userExists}
          isLoading={isLoading}
        />
    </>
  );
}
