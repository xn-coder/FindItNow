
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Edit, Bell, Users } from "lucide-react";
import { useContext } from "react";
import { LanguageContext } from "@/context/language-context";

export default function HowItWorksPage() {
  const { t } = useContext(LanguageContext);

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">{t('hiwTitle')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('hiwSubtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
              <Search className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-xl font-headline mb-2">{t('hiwStep1Title')}</CardTitle>
            <p className="text-muted-foreground">
              {t('hiwStep1Desc')}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
              <Edit className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-xl font-headline mb-2">{t('hiwStep2Title')}</CardTitle>
            <p className="text-muted-foreground">
              {t('hiwStep2Desc')}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
              <Bell className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-xl font-headline mb-2">{t('hiwStep3Title')}</CardTitle>
            <p className="text-muted-foreground">
              {t('hiwStep3Desc')}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
              <Users className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-xl font-headline mb-2">{t('hiwStep4Title')}</CardTitle>
            <p className="text-muted-foreground">
              {t('hiwStep4Desc')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
