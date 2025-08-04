
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
import { enUS, de, fr } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { itemCategories } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useContext, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { sendEmail } from "@/lib/email";
import { getUserByEmail, createUser } from "@/lib/actions";
import { OtpDialog } from "./otp-dialog";
import { AuthContext, AuthUser } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import type { Item } from "@/lib/types";
import Image from "next/image";
import { useTranslation } from "react-i18next";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

type ReportFormProps = {
  itemType: "lost" | "found";
  existingItem?: Item | null;
};

// Helper to convert file to base64
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export function ReportForm({ itemType, existingItem = null }: ReportFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const { user: authUser, login } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const isEditMode = existingItem !== null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formSchema = z.object({
    name: z.string().min(3, t('validation.itemNameMin')).max(50),
    category: z.string({ required_error: t('validation.categoryRequired') }),
    description: z.string().min(10, t('validation.descriptionMin')).max(500),
    location: z.string().min(3, t('validation.locationMin')).max(100),
    date: z.date({ required_error: t('validation.dateRequired') }),
    contact: z.string().email(t('validation.emailInvalid')),
    phoneNumber: z.string().regex(phoneRegex, t('validation.phoneInvalid')).optional().or(z.literal('')),
    image: z.any()
      .refine((files) => isEditMode || files?.length == 1, t('validation.imageRequired'))
      .refine((files) => {
          if (!files?.[0]) return isEditMode;
          return files[0].size <= MAX_FILE_SIZE;
      }, t('validation.imageSize'))
      .refine(
        (files) => {
            if (!files?.[0]) return isEditMode;
            return ACCEPTED_IMAGE_TYPES.includes(files[0].type);
        },
        t('validation.imageType')
      ).or(z.string()), // Allow existing image URL (string) for edits
  });

  type FormValues = z.infer<typeof formSchema>;
  const [formValues, setFormValues] = useState<FormValues | null>(null);

  const locales = {
    en: enUS,
    de: de,
    fr: fr,
  };
  const currentLocale = locales[i18n.language as 'en' | 'de' | 'fr'];

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode && existingItem ? {
        name: existingItem.name,
        category: existingItem.category,
        description: existingItem.description,
        location: existingItem.location,
        date: new Date(existingItem.date as any),
        contact: existingItem.contact,
        phoneNumber: existingItem.phoneNumber || '',
        image: existingItem.imageUrl,
    } : {
      name: "",
      category: "",
      description: "",
      location: "",
      contact: authUser?.email || "",
      phoneNumber: "",
      image: undefined,
    },
  });
  
  const watchedImage = form.watch('image');

  useEffect(() => {
    if (isEditMode && existingItem) {
        form.reset({
            name: existingItem.name,
            category: existingItem.category,
            description: existingItem.description,
            location: existingItem.location,
            date: new Date(existingItem.date as any),
            contact: existingItem.contact,
            phoneNumber: existingItem.phoneNumber || '',
            image: existingItem.imageUrl, // Keep existing image
        });
    } else if (authUser) {
        form.setValue('contact', authUser.email);
    }
  }, [isEditMode, existingItem, form, authUser]);


  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  async function handleInitialSubmit(values: FormValues) {
    setIsLoading(true);

    if (isEditMode) {
      await handleUpdate(values);
      setIsLoading(false);
      return;
    }
    
    // If a partner is logged in, bypass OTP and submit directly
    if (authUser?.isPartner) {
        await submitItem(values, authUser.id);
        setIsLoading(false);
        return;
    }

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
        if (!isEditMode && !authUser?.isPartner) {
            setIsLoading(false);
        }
    }
  }

  async function handleUpdate(values: FormValues) {
    if (!existingItem) return;
    try {
        let imageUrl = existingItem.imageUrl;
        if (values.image && typeof values.image !== 'string') {
            const imageFile = values.image[0];
            imageUrl = await toBase64(imageFile);
        }

        const itemData = {
            ...values,
            imageUrl,
            type: itemType, // ensure type is maintained
        };
        delete (itemData as any).image;

        const docRef = doc(db, "items", existingItem.id);
        await updateDoc(docRef, itemData);
        
        toast({
            title: "Update Successful!",
            description: "Your item details have been updated.",
        });
        
        const destination = authUser?.isPartner ? '/partner/dashboard' : '/account';
        router.push(destination);

    } catch(error) {
        console.error("Error updating document: ", error);
        toast({
            title: "Update Failed",
            description: "There was an error updating your report. Please try again.",
            variant: "destructive",
        });
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
        
        const docRefId = await submitItem(formValues, userId, user);

        login(user); // Log the user in
        
        form.reset();
        setIsOtpOpen(false);
        router.push("/account"); // Redirect to account page

    } catch (error) {
        console.error("Error during OTP verification: ", error);
        toast({
            title: "Submission Failed",
            description: "There was an error submitting your report. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

    async function submitItem(values: FormValues, userId: string, userToLogin?: AuthUser) {
        const imageFile = values.image[0];
        const imageUrl = await toBase64(imageFile);

        const docRef = await addDoc(collection(db, "items"), {
            type: itemType,
            name: values.name,
            category: values.category,
            description: values.description,
            location: values.location,
            date: values.date,
            contact: values.contact,
            phoneNumber: values.phoneNumber,
            imageUrl,
            createdAt: serverTimestamp(),
            lat: 40.7580,
            lng: -73.9855,
            userId: userId,
            status: 'open',
        });

        toast({
            title: "Report Submitted!",
            description: `Your ${itemType} item report has been successfully submitted.`,
        });

        const emailJsEnabled = process.env.NEXT_PUBLIC_EMAILJS_ENABLED !== 'false';
        if(emailJsEnabled) {
          await sendEmail({
            to_email: values.contact,
            subject: `Your ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Item Report Confirmation`,
            message: `Hello,\n\nThis is a confirmation that your report for the following item has been submitted:\n\nItem Name: ${values.name}\nCategory: ${values.category}\nLocation: ${values.location}\nDate: ${format(values.date, "PPP")}\n\nYou can view your submission here: ${window.location.origin}/browse?item=${docRef.id}\n\nThank you for using FindItNow.`,
          });
        }
        
        if (userToLogin) login(userToLogin);

        // Redirect after submission
        const destination = authUser?.isPartner ? '/partner/dashboard' : '/account';
        router.push(destination);

        return docRef.id;
    }


  const title = isEditMode ? t('reportFormEditTitle') : itemType === "lost" ? t('reportFormLostTitle') : t('reportFormFoundTitle');
  const description = isEditMode ? t('reportFormEditDesc') : itemType === "lost"
    ? t('reportFormLostDesc')
    : t('reportFormFoundDesc');

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
              <div className="grid sm:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('reportFormItemName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('reportFormItemNamePlaceholder')} {...field} />
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
                      <FormLabel>{t('category')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('reportFormCategoryPlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {itemCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {t(cat as any)}
                            </SelectItem>
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
                    <FormLabel>{t('reportFormDesc')}</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder={t('reportFormDescPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{itemType === "lost" ? t('reportFormLocationLastSeen') : t('reportFormLocationFound')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('reportFormLocationPlaceholder')} {...field} />
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
                      <FormLabel>{itemType === "lost" ? t('reportFormDateLost') : t('reportFormDateFound')}</FormLabel>
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
                                format(field.value, "PPP", { locale: currentLocale })
                              ) : (
                                <span>{t('reportFormPickDate')}</span>
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
                            locale={currentLocale}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('reportFormContactEmail')}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t('reportFormContactEmailPlaceholder')} {...field} disabled={isEditMode || !!authUser} />
                        </FormControl>
                        <FormDescription>
                          {isEditMode ? t('reportFormContactEmailDescExisting') : authUser ? t('reportFormContactEmailDescAuth') : t('reportFormContactEmailDescNew')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('reportFormPhone')}</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder={t('reportFormPhonePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                        <FormLabel>{t('reportFormImage')}</FormLabel>
                        {isEditMode && typeof value === 'string' && (
                            <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-2">{t('reportFormCurrentImage')}</p>
                                <Image src={value} alt="Current item image" width={150} height={150} className="rounded-md border"/>
                            </div>
                        )}
                        <FormControl>
                             <div className="flex items-center gap-4">
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    {t('chooseFile')}
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {watchedImage?.[0]?.name || t('noFileChosen')}
                                </span>
                                <Input 
                                    type="file" 
                                    className="hidden"
                                    ref={fileInputRef}
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    onChange={(e) => onChange(e.target.files)}
                                    {...rest}
                                />
                            </div>
                        </FormControl>
                        <FormDescription>
                            {isEditMode ? t('reportFormImageDescExisting') : t('reportFormImageDescNew')}
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

              <Button type="submit" size="lg" className="w-full md:w-auto shadow-lg hover:shadow-xl transition-shadow" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? t('reportFormSubmitButtonEdit') : (authUser ? t('reportFormSubmitButtonAuth') : t('reportFormSubmitButton'))}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {!isEditMode && (
        <OtpDialog 
            isOpen={isOtpOpen}
            onClose={() => setIsOtpOpen(false)}
            onVerify={handleOtpVerification}
            expectedOtp={otp}
            isNewUser={!userExists}
            isLoading={isLoading}
          />
      )}
    </>
  );
}

    

    