
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Heart, Lightbulb, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";


const values = [
    {
        icon: Target,
        title: "aboutValues1Title",
        description: "aboutValues1Desc"
    },
    {
        icon: Heart,
        title: "aboutValues2Title",
        description: "aboutValues2Desc"
    },
    {
        icon: Lightbulb,
        title: "aboutValues3Title",
        description: "aboutValues3Desc"
    }
];

export default function AboutUsPage() {
    const { t } = useTranslation();

  return (
    <div className="space-y-16">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">{t('aboutTitle')}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {t('aboutSubtitle')}
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold font-headline mb-4">{t('aboutMissionTitle')}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('aboutMissionDesc')}
          </p>
        </div>
        <div className="relative h-80 w-full rounded-lg overflow-hidden">
            <Image 
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop"
                alt="Team working together"
                fill
                style={{objectFit: 'cover'}}
                data-ai-hint="team collaboration"
            />
        </div>
      </section>

      <section className="text-center py-12 bg-muted/50 rounded-lg">
        <h2 className="text-3xl font-bold font-headline mb-8">{t('aboutValuesTitle')}</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
            {values.map((value, index) => (
                 <Card key={index} className="text-center bg-background">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                            <value.icon className="h-8 w-8" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardTitle className="text-xl font-headline mb-2">{t(value.title)}</CardTitle>
                        <p className="text-muted-foreground text-sm">
                           {t(value.description)}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

       <section className="text-center py-12">
            <h2 className="text-3xl font-bold font-headline mb-4">{t('aboutJoinTitle')}</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-6">
                {t('aboutJoinDesc')}
            </p>
            <Button asChild size="lg">
                <Link href="/contact">{t('contact')}</Link>
            </Button>
        </section>
    </div>
  );
}
