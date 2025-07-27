
"use client";

import { useContext } from "react";
import { LanguageContext } from "@/context/language-context";

export default function TermsAndConditionsPage() {
  const { t } = useContext(LanguageContext);
  const lastUpdatedDate = new Date().toLocaleDateString(t('locale'), { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto prose dark:prose-invert">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">{t('termsTitle')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('lastUpdated')} {lastUpdatedDate}
        </p>
      </div>

      <h2>{t('termsAgreementTitle')}</h2>
      <p>{t('termsAgreementContent')}</p>

      <h2>{t('termsServiceDescTitle')}</h2>
      <p>{t('termsServiceDescContent')}</p>

      <h2>{t('termsUserConductTitle')}</h2>
      <p>{t('termsUserConductContent')}</p>
      
      <h2>{t('termsDisclaimersTitle')}</h2>
      <p>{t('termsDisclaimersContent')}</p>

      <h2>{t('termsLiabilityTitle')}</h2>
      <p>{t('termsLiabilityContent')}</p>

      <h2>{t('termsGoverningLawTitle')}</h2>
      <p>{t('termsGoverningLawContent')}</p>

    </div>
  );
}
