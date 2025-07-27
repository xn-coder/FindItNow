
"use client";

import { useContext } from "react";
import { LanguageContext } from "@/context/language-context";

export default function PrivacyPolicyPage() {
  const { t } = useContext(LanguageContext);
  const lastUpdatedDate = new Date().toLocaleDateString(t('locale'), { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto prose dark:prose-invert">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">{t('privacyTitle')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('lastUpdated')} {lastUpdatedDate}
        </p>
      </div>

      <h2>{t('privacyIntroTitle')}</h2>
      <p>{t('privacyIntroContent')}</p>

      <h2>{t('privacyInfoCollectTitle')}</h2>
      <p>{t('privacyInfoCollectContent1')}</p>
      <p>{t('privacyInfoCollectContent2')}</p>

      <h2>{t('privacyInfoUseTitle')}</h2>
      <p>{t('privacyInfoUseContent')}</p>
      
      <h2>{t('privacyInfoShareTitle')}</h2>
      <p>{t('privacyInfoShareContent')}</p>

      <h2>{t('privacyInfoKeepTitle')}</h2>
      <p>{t('privacyInfoKeepContent')}</p>

      <h2>{t('privacyInfoSafeTitle')}</h2>
      <p>{t('privacyInfoSafeContent')}</p>

      <h2>{t('privacyMinorsTitle')}</h2>
      <p>{t('privacyMinorsContent')}</p>

      <h2>{t('privacyRightsTitle')}</h2>
      <p>{t('privacyRightsContent')}</p>

    </div>
  );
}
