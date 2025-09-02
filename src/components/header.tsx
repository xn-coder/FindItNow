
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, Sprout, User, LogOut, Inbox, Phone, Building, Sparkles, Home, Users, ChevronDown, Shield } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";


const mainNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: Sparkles },
  { href: "/about", label: "About Us", icon: Users },
  { href: "/browse", label: "Browse", icon: MapPin },
];

const moreNavLinksRaw = [
  { href: "/map", label: "Map View", icon: MapPin },
  { href: "/contact", label: "Contact", icon: Phone },
];

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

  const baseMoreLinks = process.env.NEXT_PUBLIC_MAP_ENABLED === 'false' 
    ? moreNavLinksRaw.filter(link => link.href !== '/map')
    : moreNavLinksRaw;

  let moreNavLinks = [...baseMoreLinks];
  let mobileNavLinks = [...mainNavLinks, ...baseMoreLinks];
  
  const userLinks = [];
  const partnerLinks = [];
  const mobileUserLinks = [];
  const mobilePartnerLinks = [];
  
  if (user) {
    if (user.isAdmin) {
        userLinks.push({ href: "/admin", label: "admindashboard", icon: Shield });
    }
    if (user.isPartner) {
        partnerLinks.push({ href: "/partner/dashboard", label: "partnerDashboardTitle", icon: Building });
        partnerLinks.push({ href: "/partner/enquiries", label: "enquiries", icon: Inbox });
        mobilePartnerLinks.push(...partnerLinks);
    } else {
        userLinks.push({ href: "/account", label: "myaccount", icon: User });
        userLinks.push({ href: "/enquiries", label: "enquiries", icon: Inbox });
        mobileUserLinks.push(...userLinks);
    }
  }
  
  // Combine all links for mobile view
  mobileNavLinks.push(...mobileUserLinks, ...mobilePartnerLinks);


  return (
    <header className="bg-card/80 backdrop-blur-lg sticky top-0 z-50 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary font-headline">
          <Sprout />
          FindItNow
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {mainNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary">
              {t(link.label.toLowerCase().replace(/ /g, ''))}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-sm font-medium text-foreground/70 transition-colors hover:text-primary">
                {t('more')}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moreNavLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>
                      {t(link.label.toLowerCase().replace(/ /g, ''))}
                    </Link>
                  </DropdownMenuItem>
              ))}
              {(userLinks.length > 0 || partnerLinks.length > 0) && <DropdownMenuSeparator />}
              {userLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{t(link.label)}</Link>
                  </DropdownMenuItem>
              ))}
               {partnerLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{t(link.label)}</Link>
                  </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
                <div className="flex gap-2 text-sm font-medium">
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
                {user ? (
                    <>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            {t('logout')}
                        </Button>
                    </>
                ) : (
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/login">{t('login')}</Link>
                    </Button>
                )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
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
                                <Sprout/>
                                FindItNow
                            </Link>
                        </SheetTitle>
                    </SheetHeader>
                <div className="p-4">
                    <nav className="flex flex-col gap-4 mt-8">
                    {mainNavLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                        <link.icon className="h-5 w-5 text-primary" />
                        {t(link.label.toLowerCase().replace(/ /g, ''))}
                        </Link>
                    ))}
                    {moreNavLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                        <link.icon className="h-5 w-5 text-primary" />
                        {t(link.label.toLowerCase().replace(/ /g, ''))}
                        </Link>
                    ))}
                     {user && user.isAdmin && (
                        <Link href="/admin" className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                            <Shield className="h-5 w-5 text-primary" />
                            {t('admindashboard')}
                        </Link>
                    )}
                    {mobileUserLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                        <link.icon className="h-5 w-5 text-primary" />
                        {t(link.label)}
                        </Link>
                    ))}
                    {mobilePartnerLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                        <link.icon className="h-5 w-5 text-primary" />
                        {t(link.label)}
                        </Link>
                    ))}
                    </nav>
                    <div className="mt-8 flex flex-col gap-2">
                        <div className="flex justify-around items-center p-2 mb-4 bg-muted rounded-md">
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
                    {user ? (
                        <Button variant="ghost" className="mt-4 flex items-center gap-3" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                        <LogOut className="h-5 w-5" />
                        {t('logout')}
                        </Button>
                    ) : (
                        <Button asChild className="w-full">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>{t('login')} / {t('signup')}</Link>
                        </Button>
                    )}
                    </div>
                </div>
                </SheetContent>
            </Sheet>
            </div>
      </div>
      </div>
    </header>
  );
}
