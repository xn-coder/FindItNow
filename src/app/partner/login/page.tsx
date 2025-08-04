
"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Building, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getPartnerByEmail, sendOtp, loginPartner } from "@/lib/actions";
import { OtpDialog } from "@/components/otp-dialog";
import { AuthContext } from "@/context/auth-context";
import { useTranslation } from "react-i18next";

const partnerLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});


export default function PartnerLoginPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const router = useRouter();
    const { login } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [formValues, setFormValues] = useState<z.infer<typeof partnerLoginSchema> | null>(null);

    const form = useForm<z.infer<typeof partnerLoginSchema>>({
        resolver: zodResolver(partnerLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    
    async function onSubmit(values: z.infer<typeof partnerLoginSchema>) {
        setIsLoading(true);
        try {
            const partner = await loginPartner(values);
            if (!partner) {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "Invalid credentials.",
                });
                setIsLoading(false);
                return;
            }

            setFormValues(values);
            const generatedOtp = await sendOtp(values.email, "Your FindItNow Partner Login Code");
            setOtp(generatedOtp);
            setIsOtpOpen(true);
            toast({
                title: "Verification Required",
                description: "We've sent a one-time password to your email.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "An unexpected error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleOtpVerification() {
        setIsLoading(true);
        if (!formValues) return;
        
        try {
            const partner = await getPartnerByEmail(formValues.email);
            if (!partner) throw new Error("Partner not found during verification.");

            // The user is now verified via OTP, log them in
            login({
                id: partner.id,
                email: partner.email,
                isPartner: true,
                businessName: partner.businessName
            });

            toast({
                title: "Login Successful",
                description: `Welcome back, ${partner.businessName}!`,
            });
            
            setIsOtpOpen(false);
            router.push("/partner/dashboard");

        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "An unexpected error occurred during verification.",
            });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <>
            <div className="flex items-center justify-center py-12">
                <Card className="mx-auto max-w-sm w-full">
                    <CardHeader className="text-center">
                        <Building className="mx-auto h-12 w-12 text-primary mb-4" />
                        <CardTitle className="text-2xl font-headline">{t('partnerLoginTitle')}</CardTitle>
                        <CardDescription>
                        {t('partnerLoginSubtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                               <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('contactEmailLabel')}</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="partner@example.com" {...field} />
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
                                             <div className="flex items-center">
                                                <FormLabel>{t('loginPassword')}</FormLabel>
                                                <Link href="/partner/forgot-password" className="ml-auto inline-block text-sm underline">
                                                    {t('loginForgotPassword')}
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('login')}
                                </Button>
                            </form>
                        </Form>
                        <div className="mt-4 text-center text-sm">
                            {t('partnerNoAccount')}{" "}
                            <Link href="/partner/register" className="underline">
                            {t('partnerRegisterNow')}
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
                isNewUser={false} 
                isLoading={isLoading}
            />
        </>
    );
}
