
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LanguageContext } from "@/context/language-context";
import { useContext } from "react";

export default function FaqPage() {
  const { t } = useContext(LanguageContext);
  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline">{t('faqTitle')}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Have questions? We've got answers.
            </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold text-lg text-left p-4 bg-muted/50 rounded-lg">{t('faq1Title')}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-4">{t('faq1Content')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold text-lg text-left p-4 bg-muted/50 rounded-lg">{t('faq2Title')}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-4">{t('faq2Content')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger className="font-semibold text-lg text-left p-4 bg-muted/50 rounded-lg">{t('faq3Title')}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-4">{t('faq3Content')}</AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
                <AccordionTrigger className="font-semibold text-lg text-left p-4 bg-muted/50 rounded-lg">{t('faq4Title')}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-4">{t('faq4Content')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger className="font-semibold text-lg text-left p-4 bg-muted/50 rounded-lg">{t('faq5Title')}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-4">{t('faq5Content')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
                <AccordionTrigger className="font-semibold text-lg text-left p-4 bg-muted/50 rounded-lg">{t('faq6Title')}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-4">{t('faq6Content')}</AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  );
}
