
"use client";

import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Item } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { useTranslation } from 'react-i18next';
import { AuthContext, AuthUser } from '@/context/auth-context';
import { getUserByEmail, createUser } from '@/lib/actions';
import { sendEmail } from '@/lib/email';
import { OtpDialog } from './otp-dialog';
import Image from 'next/image';

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


// Helper to convert file to base64 with compression
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1024;
            const MAX_HEIGHT = 1024;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              return reject(new Error("Could not get canvas context"));
            }
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // 80% quality
            resolve(dataUrl);
        };
        img.onerror = error => reject(error);
    };
    reader.onerror = error => reject(error);
});

type ClaimFormProps = {
  item: Item;
  onSuccess: () => void;
};

export function ClaimForm({ item, onSuccess }: ClaimFormProps) {
    const { t } = useTranslation();

    const claimFormSchema = z.object({
        fullName: z.string().min(2, t('validation.nameRequired')),
        email: z.string().email(t('validation.emailInvalid')),
        phoneNumber: z.string().regex(phoneRegex, t('validation.phoneInvalid')).optional().or(z.literal('')),
        proof: z.string().min(20, t('validation.proofMin')),
        proofImage: z.any()
         .refine((file) => !file || file.size <= MAX_FILE_SIZE, t('validation.imageSize'))
         .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), t('validation.imageType'))
         .optional(),
    });

    type FormValues = z.infer<typeof claimFormSchema>;

    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { user: authUser, login } = useContext(AuthContext);

    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [userExists, setUserExists] = useState<boolean | null>(null);
    const [formValues, setFormValues] = useState<FormValues | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(claimFormSchema),
        defaultValues: {
        fullName: '',
        email: authUser?.email || '',
        phoneNumber: '',
        proof: '',
        },
    });

    useEffect(() => {
        if (authUser) {
            form.setValue('email', authUser.email);
        }
    }, [authUser, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("proofImage", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        form.setValue("proofImage", null);
        setImagePreview(null);
    };

    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    async function handleInitialSubmit(values: FormValues) {
        setIsLoading(true);

        if (authUser) {
            await submitClaim(values, authUser.id);
            setIsLoading(false);
            return;
        }

        try {
            const user = await getUserByEmail(values.email);
            setUserExists(!!user);
            setFormValues(values);

            const generatedOtp = generateOtp();
            await sendEmail({
                to_email: values.email,
                subject: "Your FindItNow Verification Code",
                message: `Your one-time password is: ${generatedOtp}`,
                from_name: "FindItNow",
                from_email: "no-reply@finditnow.com",
            });
            
            setOtp(generatedOtp);
            setIsOtpOpen(true);
            toast({
                title: "Verification Required",
                description: "We've sent a one-time password to your email.",
            });

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
            let user: AuthUser | null = await getUserByEmail(formValues.email) as AuthUser | null;
            let userId = user?.id;

            if (!userExists && password) {
                const newUser = await createUser({ email: formValues.email, password });
                userId = newUser.id;
                user = { id: newUser.id, email: formValues.email };
            } else if (!userExists && !password) {
                toast({ title: "Password Required", description: "Please set a password for your new account.", variant: "destructive" });
                setIsLoading(false);
                return;
            }

            if (!userId || !user) {
                throw new Error("Could not verify or create user.");
            }
            
            await submitClaim(formValues, userId);
            login(user);
            
            setIsOtpOpen(false);

        } catch (error) {
            console.error("Error during OTP verification: ", error);
            toast({
                title: "Submission Failed",
                description: "There was an error submitting your claim. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function submitClaim(values: FormValues, userId: string) {
        try {
            let proofImageUrl: string | undefined = undefined;
            if (values.proofImage) {
                proofImageUrl = await toBase64(values.proofImage);
            }

            const docRef = await addDoc(collection(db, "claims"), {
                itemId: item.id,
                itemOwnerId: item.userId,
                userId: userId,
                fullName: values.fullName,
                email: values.email,
                phoneNumber: values.phoneNumber,
                proof: values.proof,
                proofImageUrl: proofImageUrl,
                submittedAt: serverTimestamp(),
                status: 'open',
                type: 'claim',
            });

            await updateDoc(doc(db, "claims", docRef.id), { chatId: docRef.id });

            toast({
                title: 'Claim Submitted!',
                description: "We've received your claim and the item reporter has been notified.",
            });
            form.reset();
            onSuccess();

        } catch (error) {
            console.error("Error submitting claim: ", error);
            toast({
                variant: "destructive",
                title: 'Submission Failed',
                description: "There was an error submitting your claim. Please try again.",
            });
            // Re-throw to prevent dialog from closing on failure
            throw error;
        }
    }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleInitialSubmit)} className="max-w-xl mx-auto space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('claimFormFullName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('claimFormFullNamePlaceholder')} {...field} />
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
                  <FormLabel>{t('claimFormContactEmail')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('claimFormContactEmailPlaceholder')} {...field} disabled={!!authUser} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('claimFormContactPhone')}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder={t('claimFormContactPhonePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <FormField
            control={form.control}
            name="proof"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('claimFormProof')}</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder={t('claimFormProofPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

           <FormField
                control={form.control}
                name="proofImage"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('claimFormProofImage')}</FormLabel>
                      <FormControl>
                          <Button asChild variant="outline" className="w-full">
                              <label htmlFor="image-upload" className="cursor-pointer">
                                  {t('chooseFile')}
                                  <Input 
                                      type="file" 
                                      id="image-upload"
                                      className="hidden"
                                      accept="image/png, image/jpeg, image/jpg, image/webp"
                                      onChange={handleImageChange}
                                  />
                              </label>
                          </Button>
                      </FormControl>
                      {imagePreview && (
                         <div className="mt-4 relative w-fit">
                            <Image src={imagePreview} alt="Proof preview" width={150} height={150} className="rounded-md border object-cover aspect-square"/>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={handleRemoveImage}
                            >
                                <X className="h-4 w-4"/>
                            </Button>
                         </div>
                      )}
                      <FormDescription>
                          {t('claimFormProofImageDesc')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                )}
                />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('claimFormSubmitButton')}
          </Button>
        </form>
      </Form>

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
