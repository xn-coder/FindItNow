
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { createUser, getUserByEmail } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { sendEmail } from "@/lib/email";
import { OtpDialog } from "@/components/otp-dialog";

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const signupSchema = z.object({
    email: z.string().email(t('validation.emailInvalid')),
    password: z.string().min(6, t('validation.passwordMin')),
  });

  type FormValues = z.infer<typeof signupSchema>;

  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [formValues, setFormValues] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleInitialSubmit(values: FormValues) {
    setIsLoading(true);
    try {
        const existingUser = await getUserByEmail(values.email);
        if (existingUser) {
            toast({
                variant: "destructive",
                title: "Signup Failed",
                description: "A user with this email already exists.",
            });
            return;
        }

        setFormValues(values);

        const emailJsEnabled = process.env.NEXT_PUBLIC_EMAILJS_ENABLED !== 'false';
        let generatedOtp;
        if (emailJsEnabled) {
            generatedOtp = generateOtp();
            await sendEmail({
                to_email: values.email,
                subject: "Your FindItNow Verification Code",
                message: `Your one-time password is: ${generatedOtp}`,
            });
        } else {
            generatedOtp = "123456";
        }

        setOtp(generatedOtp);
        setIsOtpOpen(true);
        toast({
            title: "Verification Required",
            description: "We've sent a one-time password to your email.",
        });

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Signup Failed",
            description: error.message || "An unexpected error occurred.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  async function handleOtpVerification() {
    setIsLoading(true);
    if (!formValues) {
        toast({ title: "Something went wrong", description: "Form data is missing.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
      await createUser(formValues);
      toast({
        title: "Account Created!",
        description: "You have successfully signed up. You can now log in.",
      });
      router.push("/login");

    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <>
        <div className="flex items-center justify-center py-12">
        <Card className="mx-auto max-w-sm w-full">
            <CardHeader>
            <CardTitle className="text-2xl font-headline">{t('signupTitle')}</CardTitle>
            <CardDescription>
                {t('signupSubtitle')}
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleInitialSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('contactEmailLabel')}</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('loginPassword')}</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('signupButton')}
                </Button>
                </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                {t('signupHaveAccount')}{" "}
                <Link href="/login" className="underline">
                {t('login')}
                </Link>
            </div>
            </CardContent>
        </Card>
        </div>
        <OtpDialog
            isOpen={isOtpOpen}
            onClose={() => setIsOtpOpen(false)}
            onVerify={handleOtpVerification}
            expectedOtp={otp}
            isNewUser={false} // Password is set on the main form
            isLoading={isLoading}
        />
    </>
  );
}
