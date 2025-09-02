
"use client";

import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Item } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, CheckCircle, Loader2 } from 'lucide-react';
import { sendEmail } from '@/lib/email';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { enUS, de, fr } from "date-fns/locale";
import { useTranslation } from 'react-i18next';
import { translateText } from '@/ai/translate-flow';
import { AuthContext, AuthUser } from '@/context/auth-context';
import { getUserByEmail, createUser } from '@/lib/actions';
import { OtpDialog } from './otp-dialog';

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

type FoundItemFormProps = {
  item: Item;
};

export function FoundItemForm({ item }: FoundItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { user: authUser, login } = useContext(AuthContext);

  const foundItemFormSchema = z.object({
    finderName: z.string().min(2, t('validation.nameRequired')),
    finderEmail: z.string().email(t('validation.emailInvalid')),
    message: z.string().min(10, t('validation.messageMin')),
    location: z.string().min(3, t('validation.locationMin')).max(100),
    date: z.date({ required_error: t('validation.dateRequired') }),
  });
  
  type FormValues = z.infer<typeof foundItemFormSchema>;
  
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [formValues, setFormValues] = useState<FormValues | null>(null);

  const locales = {
    en: enUS,
    de: de,
    fr: fr,
  };
  const currentLocale = locales[i18n.language as 'en' | 'de' | 'fr'];

  const form = useForm<FormValues>({
    resolver: zodResolver(foundItemFormSchema),
    defaultValues: {
      finderName: '',
      finderEmail: authUser?.email || '',
      location: '',
      message: '',
    },
  });

  useEffect(() => {
    if(authUser) {
      form.setValue('finderEmail', authUser.email);
    }
  }, [authUser, form]);

  useEffect(() => {
    const setDefaultMessage = async () => {
        const defaultText = `I believe I have found your ${item.name}. Please describe it to confirm.`;
        if (i18n.language !== 'en') {
            const translatedMessage = await translateText(defaultText, i18n.language);
            form.setValue('message', translatedMessage);
        } else {
            form.setValue('message', defaultText);
        }
    };
    setDefaultMessage();
  }, [item.name, i18n.language, form]);
  
  const generateOtp = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
  };

  async function handleInitialSubmit(values: FormValues) {
    setIsLoading(true);

    if (authUser) {
        await submitMessage(values, authUser.id);
        setIsLoading(false);
        return;
    }
    
    try {
        const user = await getUserByEmail(values.finderEmail);
        setUserExists(!!user);
        setFormValues(values);

        const generatedOtp = generateOtp();
        await sendEmail({
            to_email: values.finderEmail,
            templateId: "user-otp",
            variables: { otp: generatedOtp },
        });
        toast({
            title: "Verification Required",
            description: "We've sent a one-time password to your email.",
        });
        
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
          let user: AuthUser | null = await getUserByEmail(formValues.finderEmail) as AuthUser | null;
          let userId = user?.id;

          if (!userExists && password) {
              const newUser = await createUser({ email: formValues.finderEmail, password });
              userId = newUser.id;
              user = { id: newUser.id, email: formValues.finderEmail };
          } else if (!userExists && !password) {
              toast({ title: "Password Required", description: "Please set a password for your new account.", variant: "destructive" });
              setIsLoading(false);
              return;
          }

          if (!userId || !user) {
              throw new Error("Could not verify or create user.");
          }
          
          await submitMessage(formValues, userId);
          login(user);
          
          setIsOtpOpen(false);

      } catch (error) {
          console.error("Error during OTP verification: ", error);
          toast({
              title: "Submission Failed",
              description: "There was an error submitting your message. Please try again.",
              variant: "destructive",
          });
      } finally {
          setIsLoading(false);
      }
  }


  async function submitMessage(values: FormValues, userId: string) {
    try {
        await sendEmail({
            to_email: item.contact,
            templateId: "new-enquiry",
            variables: {
                finderName: values.finderName,
                finderEmail: values.finderEmail,
                location: values.location,
                date: format(values.date, "PPP"),
                message: values.message,
                itemName: item.name,
                name: item.contact, // The recipient's name
            }
        });


        // Save the enquiry to the 'claims' collection
        await addDoc(collection(db, "claims"), {
            itemId: item.id,
            itemName: item.name,
            itemOwnerId: item.userId,
            userId: userId, // The user who sent the message
            fullName: values.finderName,
            email: values.finderEmail,
            proof: values.message, // Re-using the 'proof' field for the message
            location: values.location,
            date: values.date,
            submittedAt: serverTimestamp(),
            type: 'message', // Differentiate from a claim
            status: 'open'
        });

        toast({
            title: 'Message Sent!',
            description: "We've sent your message to the item's owner and logged your enquiry. They will contact you shortly if it's a match.",
        });
        setSubmittedMessage(values.message);
        setIsSubmitted(true);

    } catch (error) {
         console.error("Error sending message: ", error);
         toast({
            variant: "destructive",
            title: 'Message Failed',
            description: "There was an error sending your message. Please try again later.",
        });
         throw error;
    }
  }

  if(isSubmitted) {
    return (
        <Card className="border-2 border-green-500/50 shadow-lg">
            <CardHeader className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
                <CardTitle className="text-2xl font-headline text-green-600">Message Sent Successfully</CardTitle>
                <CardDescription>
                    We have notified the owner of the lost item. They will contact you via email if it's a match. Thank you for helping out!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-muted p-4 rounded-md border">
                    <p className="font-semibold text-sm mb-2">Your sent message:</p>
                    <p className="text-muted-foreground italic">"{submittedMessage}"</p>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <>
        <Card className="border-2">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">{t('haveYouFoundThis')}</CardTitle>
            <CardDescription>
                {t('haveYouFoundThisDesc')}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleInitialSubmit)} className="max-w-xl mx-auto space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="finderName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('foundFormYourName')}</FormLabel>
                            <FormControl>
                            <Input placeholder={t('foundFormYourNamePlaceholder')} {...field} />
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
                            <FormLabel>{t('claimFormContactEmail')}</FormLabel>
                            <FormControl>
                            <Input type="email" placeholder={t('claimFormContactEmailPlaceholder')} {...field} disabled={!!authUser} />
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
                            <FormLabel>{t('foundFormLocationFound')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('foundFormLocationFoundPlaceholder')} {...field} />
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
                            <FormLabel>{t('foundFormDateFound')}</FormLabel>
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
                                    initialFocus
                                    locale={currentLocale}
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
                        <FormLabel>{t('foundFormMessageToOwner')}</FormLabel>
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
                    {t('foundFormSendMessage')}
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
