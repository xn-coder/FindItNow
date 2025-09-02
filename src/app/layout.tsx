"use client";

import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { I18nProvider } from '@/components/providers';
import { Suspense } from 'react';
import { MaintenanceWrapper } from '@/components/maintenance-wrapper';
import { usePathname } from 'next/navigation';

function SiteLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    
    return (
        <div className="flex flex-col min-h-screen">
            {!isAdminPage && <Header />}
            <main className={cn(
                "flex-grow flex flex-col",
                !isAdminPage && "container mx-auto px-4 sm:px-6 lg:px-8 py-8"
            )}>
                {children}
            </main>
            {!isAdminPage && <Footer />}
        </div>
    );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <title>FindItNow</title>
        <meta name="description" content="A modern platform to help you find your lost items." />
      </head>
      <body className="font-body antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <I18nProvider>
            <AuthProvider>
              <MaintenanceWrapper>
                  <SiteLayout>
                    {children}
                  </SiteLayout>
                  <Toaster />
              </MaintenanceWrapper>
            </AuthProvider>
          </I18nProvider>
        </Suspense>
      </body>
    </html>
  );
}

// Helper to merge class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
