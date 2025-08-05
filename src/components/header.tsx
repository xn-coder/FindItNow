
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, Sprout, User, LogOut, Inbox, Phone, Building } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";


const allNavLinks = [
  { href: "/browse", label: "Browse", icon: MapPin },
  { href: "/map", label: "Map View", icon: MapPin },
  { href: "/contact", label: "Contact", icon: Phone },
];

const navLinks = process.env.NEXT_PUBLIC_MAP_ENABLED === 'false' 
  ? allNavLinks.filter(link => link.href !== '/map')
  : allNavLinks;


export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  }
  
  const languages = [
    { code: 'de', name: 'DE' },
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' },
  ]

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  }

  return (
    <header className="bg-card/80 backdrop-blur-lg sticky top-0 z-50 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary font-headline">
          DEMO
        </Link>

        <div className="flex items-center gap-4">
           <div className="hidden sm:flex gap-2 text-sm font-medium">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={cn(
                            "hover:text-primary",
                            i18n.language === lang.code ? "text-primary font-bold underline underline-offset-4" : "text-foreground/70"
                        )}
                    >
                        {lang.name}
                    </button>
                ))}
            </div>
         
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
                <SheetHeader className="p-4 pb-0">
                    <SheetTitle>
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary font-headline" onClick={() => setMobileMenuOpen(false)}>
                            DEMO
                        </Link>
                    </SheetTitle>
                </SheetHeader>
              <div className="p-4">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                      <link.icon className="h-5 w-5 text-primary" />
                      {t(link.label.toLowerCase().replace(' ', ''))}
                    </Link>
                  ))}
                  {user && !user.isPartner &&(
                    <>
                     <Link href="/account" className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-5 w-5 text-primary" />
                      {t('myaccount')}
                    </Link>
                     <Link href="/enquiries" className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                      <Inbox className="h-5 w-5 text-primary" />
                      {t('enquiries')}
                    </Link>
                    </>
                  )}
                   {user && user.isPartner &&(
                    <>
                        <Link href="/partner/dashboard" className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                            <Building className="h-5 w-5 text-primary" />
                            {t('partnerDashboardTitle')}
                        </Link>
                        <Link href="/partner/enquiries" className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                            <Inbox className="h-5 w-5 text-primary" />
                            {t('enquiries')}
                        </Link>
                     </>
                  )}
                </nav>
                <div className="mt-8 flex flex-col gap-2">
                    <div className="flex justify-around items-center p-2 mb-4 bg-muted rounded-md sm:hidden">
                        {languages.map((lang) => (
                            <Button
                                key={lang.code}
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    changeLanguage(lang.code);
                                }}
                                className={cn(
                                    "text-base",
                                    i18n.language === lang.code ? "text-primary font-bold" : "text-foreground/70"
                                )}
                            >
                                {lang.name}
                            </Button>
                        ))}
                    </div>
                  <Button asChild>
                    <Link href="/report-lost" onClick={() => setMobileMenuOpen(false)}>{t('heroButtonLost')}</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/report-found" onClick={() => setMobileMenuOpen(false)}>{t('heroButtonFound')}</Link>

                  </Button>
                  
                  <Separator className="my-4"/>

                  {user ? (
                    <Button variant="ghost" className="flex items-center justify-start gap-3 p-2 text-base h-auto" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                       <LogOut className="h-5 w-5 text-primary" />
                       {t('logout')}
                    </Button>
                  ) : (
                    <Button asChild variant="ghost" className="flex items-center justify-start gap-3 p-2 text-base h-auto">
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                            <User className="h-5 w-5 text-primary"/>
                            {t('login')} / {t('signup')}
                        </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
