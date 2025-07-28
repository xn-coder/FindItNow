
"use client";

import Link from "next/link"
import { Sprout } from "lucide-react"
import { useContext } from "react";
import { LanguageContext } from "@/context/language-context";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Footer() {
  const { t } = useContext(LanguageContext);
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
            <div className="space-y-4 md:col-span-2">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white font-headline">
                    <Sprout className="h-6 w-6 text-primary" />
                    FindItNow
                </Link>
                <p className="text-sm text-gray-400">{t('footerReuniting')}</p>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold text-white uppercase tracking-wider text-sm">{t('footerCompany')}</h4>
                <nav className="flex flex-col gap-1">
                    <Link href="/how-it-works" className="text-sm text-gray-400 hover:text-white">{t('hiwTitle')}</Link>
                    <Link href="/faq" className="text-sm text-gray-400 hover:text-white">{t('faqTitle')}</Link>
                    <Link href="/partner/login" className="text-sm text-gray-400 hover:text-white">{t('footerForBusiness')}</Link>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white">{t('footerCareers')}</Link>
                </nav>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold text-white uppercase tracking-wider text-sm">{t('footerLegal')}</h4>
                <nav className="flex flex-col gap-1">
                    <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white">{t('footerPrivacy')}</Link>
                    <Link href="/terms-conditions" className="text-sm text-gray-400 hover:text-white">{t('footerTerms')}</Link>
                </nav>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold text-white uppercase tracking-wider text-sm">{t('footerConnect')}</h4>
                <nav className="flex flex-col gap-1">
                    <Link href="/contact" className="text-sm text-gray-400 hover:text-white">{t('footerContact')}</Link>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white">{t('footerTwitter')}</Link>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white">{t('footerLinkedIn')}</Link>
                </nav>
            </div>
        </div>
        <div className="mt-12 text-center text-sm text-gray-500 border-t border-gray-800 pt-8">
          <p>&copy; {new Date().getFullYear()} FindItNow. {t('footerRights')}</p>
        </div>
      </div>
    </footer>
  );
}
