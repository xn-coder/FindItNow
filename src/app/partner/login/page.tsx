
"use client";

import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { LanguageContext } from "@/context/language-context";
import Link from "next/link";

export default function PartnerLoginPage() {
    const { t } = useContext(LanguageContext);
    
    return (
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
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">{t('contactEmailLabel')}</Label>
                            <Input id="email" type="email" placeholder="partner@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">{t('loginPassword')}</Label>
                            <Input id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full" asChild>
                            <Link href="/partner/dashboard">{t('login')}</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

