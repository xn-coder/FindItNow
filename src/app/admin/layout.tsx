
"use client";

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/auth-context';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Sprout, Home, Users, Package, Shield, FileText, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user?.isAdmin) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user?.isAdmin) {
    return <div>Loading...</div>; // Or a proper loader
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarContent>
                <SidebarHeader>
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-primary font-headline">
                        <Sprout />
                        <span>FindItNow Admin</span>
                    </Link>
                </SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/admin">
                                <Home />
                                Dashboard
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/admin/users">
                                <Users />
                                User Management
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/admin/items">
                                <Package />
                                Item Management
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/admin/claims">
                                <Shield />
                                Claims & Verification
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/admin/reports">
                                <FileText />
                                Reports
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/admin/settings">
                                <Settings />
                                Settings
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6 bg-muted/30">
             <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <SidebarTrigger />
            </div>
            {children}
        </main>
    </SidebarProvider>
  );
}
