
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { I18nProvider } from '@/components/providers';
import { Suspense } from 'react';
import { MaintenanceWrapper } from '@/components/maintenance-wrapper';

export const metadata: Metadata = {
  title: 'FindItNow',
  description: 'A modern platform to help you find your lost items.',
};

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
      </head>
      <body className="font-body antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <I18nProvider>
            <AuthProvider>
              <MaintenanceWrapper>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
                    {children}
                  </main>
                  <Footer />
                </div>
                <Toaster />
              </MaintenanceWrapper>
            </AuthProvider>
          </I18nProvider>
        </Suspense>
      </body>
    </html>
  );
}
