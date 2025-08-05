
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, User, Building } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ServicesPage() {
    const { t } = useTranslation();

    const individualFeatures = [
        "servicesIndividualFeat1",
        "servicesIndividualFeat2",
        "servicesIndividualFeat3",
        "servicesIndividualFeat4"
    ];

    const businessFeatures = [
        "servicesBusinessFeat1",
        "servicesBusinessFeat2",
        "servicesBusinessFeat3",
        "servicesBusinessFeat4"
    ];

    return (
        <div className="space-y-12">
             <div className="text-center">
                <h1 className="text-4xl font-bold font-headline">{t('servicesTitle')}</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    {t('servicesSubtitle')}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-2 flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-full">
                                <User className="h-6 w-6"/>
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-headline">{t('servicesIndividualTitle')}</CardTitle>
                                <CardDescription>{t('servicesIndividualDesc')}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-3">
                            {individualFeatures.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span>{t(feature)}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                 <Card className="border-2 flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-full">
                                <Building className="h-6 w-6"/>
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-headline">{t('servicesBusinessTitle')}</CardTitle>
                                <CardDescription>{t('servicesBusinessDesc')}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-3">
                            {businessFeatures.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span>{t(feature)}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card className="text-center bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">{t('servicesReadyTitle')}</CardTitle>
                    <CardDescription>{t('servicesReadyDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button asChild size="lg">
                        <Link href="/report-lost">{t('heroButtonLost')}</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/partner/register">{t('partnerRegisterButton')}</Link>
                    </Button>
                </CardContent>
            </Card>

        </div>
    );
}
