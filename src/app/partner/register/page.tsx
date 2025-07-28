
"use client";

import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { LanguageContext } from "@/context/language-context";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const partnerRegisterSchema = z.object({
  businessName: z.string().min(2, "Business name is required."),
  businessType: z.string({ required_error: "Please select a business type." }),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

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
    const { t } = useContext(LanguageContext);
    
    const form = useForm<z.infer<typeof partnerRegisterSchema>>({
        resolver: zodResolver(partnerRegisterSchema),
        defaultValues: {
            businessName: "",
            businessType: "",
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof partnerRegisterSchema>) {
        console.log(values);
        // TODO: Implement partner registration logic
    }

    return (
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
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            <Button type="submit" className="w-full">
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
    );
}
