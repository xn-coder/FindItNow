
"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPartner, getPartnerByEmail, sendOtp } from "@/lib/actions";
import { OtpDialog } from "@/components/otp-dialog";
import { AuthContext } from "@/context/auth-context";
import { useTranslation } from "react-i18next";


const partnerRegisterSchema = z.object({
  businessName: z.string().min(2, "Business name is required."),
  businessType: z.string({ required_error: "Please select a business type." }),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormValues = z.infer<typeof partnerRegisterSchema>;

const businessTypes = [
    "Airport",
    "Mall",
    "Police Station",
    "Hotel",
    "Public Transport",
    "Venue",
    "Other Agency"
];

export default function PartnerRegisterPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const router = useRouter();
    const { login } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [formValues, setFormValues] = useState<FormValues | null>(null);
    
    const form = useForm<FormValues>({
        resolver: zodResolver(partnerRegisterSchema),
        defaultValues: {
            businessName: "",
            email: "",
            password: "",
        },
    });

    async function handleInitialSubmit(values: FormValues) {
        setIsLoading(true);
        try {
            const existingPartner = await getPartnerByEmail(values.email);
            if (existingPartner) {
                toast({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: "A partner account with this email already exists.",
                });
                return;
            }

            setFormValues(values);
            const generatedOtp = await sendOtp(values.email, "Your FindItNow Partner Verification Code");
            setOtp(generatedOtp);
            setIsOtpOpen(true);
             toast({
                title: "Verification Required",
                description: "We've sent a one-time password to your email.",
            });

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
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
            const newPartner = await createPartner(formValues);

            login({
                id: newPartner.id,
                email: newPartner.email,
                isPartner: true,
                businessName: newPartner.businessName
            });
            
            toast({
                title: "Account Created!",
                description: "You have successfully registered as a partner.",
            });

            form.reset();
            setIsOtpOpen(false);
            router.push("/partner/dashboard");

        } catch (error) {
            console.error("Error creating partner: ", error);
            toast({
                title: "Registration Failed",
                description: "There was an error creating your account. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex items-center justify-center py-12">
                <Card className="mx-auto max-w-lg w-full">
                    <CardHeader className="text-center">
                        <Building className="mx-auto h-12 w-12 text-primary mb-4" />
                        <CardTitle className="text-2xl font-headline">{t('partnerRegisterTitle')}</CardTitle>
                        <CardDescription>
                        {t('partnerRegisterSubtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleInitialSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="businessName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('partnerBusinessName')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('partnerBusinessNamePlaceholder')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="businessType"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>{t('partnerBusinessType')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('partnerBusinessTypePlaceholder')} />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                            {businessTypes.map(type => (
                                                <SelectItem key={type} value={type}>{t(type.toLowerCase().replace(/ /g, ''))}</SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
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
                                    {t('partnerRegisterButton')}
                                </Button>
                            </form>
                        </Form>
                        <div className="mt-4 text-center text-sm">
                            {t('partnerHaveAccount')}{" "}
                            <Link href="/partner/login" className="underline">
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
                isNewUser={false} // Password is set on the main form, not in dialog
                isLoading={isLoading}
            />
        </>
    );
}
