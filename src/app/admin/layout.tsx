
"use client";

import { useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/auth-context';
import { Home, Users, Package, Shield, FileText, Settings, Sprout, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const adminNavLinks = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/items", label: "Item Management", icon: Package },
    { href: "/admin/claims", label: "Claims & Verification", icon: Shield },
    { href: "/admin/reports", label: "Reports", icon: FileText },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminSidebar() {
    const pathname = usePathname();
    const { t } = useTranslation();

    return (
        <nav className="flex flex-col gap-2">
            {adminNavLinks.map(link => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === link.href && "bg-muted text-primary"
                    )}
                >
                    <link.icon className="h-4 w-4" />
                    {t(link.label.toLowerCase().replace(/ /g, ''))}
                </Link>
            ))}
        </nav>
    );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useContext(AuthContext);
  const router = useRouter();
  const { t, i18n } = useTranslation();

   const languages = [
    { code: 'de', name: 'DE' },
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' },
  ]

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  }

  useEffect(() => {
    if (!loading && !user?.isAdmin) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user?.isAdmin) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div>Loading...</div>
        </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold text-primary">
              <Sprout className="h-6 w-6" />
              <span className="">FindItNow Admin</span>
            </Link>
          </div>
          <div className="flex-1">
             <div className="grid items-start px-2 text-sm font-medium lg:px-4">
                <AdminSidebar />
             </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <div className="p-4">
                    <AdminSidebar />
                </div>
                 <div className="mt-auto p-4 border-t">
                    <div className="flex justify-around items-center p-2 mb-4 bg-muted rounded-md">
                        {languages.map((lang) => (
                            <Button
                                key={lang.code}
                                variant="ghost"
                                size="sm"
                                onClick={() => changeLanguage(lang.code)}
                                className={cn(
                                    "text-base",
                                    i18n.language === lang.code ? "text-primary font-bold" : "text-foreground/70"
                                )}
                            >
                                {lang.name}
                            </Button>
                        ))}
                    </div>
                    <Button variant="ghost" className="flex items-center gap-3 w-full" onClick={handleLogout}>
                        <LogOut className="h-5 w-5" />
                        {t('logout')}
                    </Button>
                </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add search or other header elements here */}
          </div>
           <div className="flex items-center gap-4">
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
                <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('logout')}
                </Button>
           </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
