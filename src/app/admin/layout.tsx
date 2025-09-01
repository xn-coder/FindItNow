
"use client";

import { useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/auth-context';
import { Home, Users, Package, Shield, FileText, Settings, Sprout } from 'lucide-react';
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
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const { t } = useTranslation();

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
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add search or other header elements here */}
          </div>
          {/* User dropdown can be added here */}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
