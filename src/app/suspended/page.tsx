
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { LogOut, MessageSquare, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function SuspendedPage() {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();
    const { t } = useTranslation();

    useEffect(() => {
        // If there's no user, or the user is not marked as suspended, redirect away
        if (!user || user.status !== 'suspended') {
            router.push('/login');
        }
    }, [user, router]);
    
    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="flex items-center justify-center min-h-full">
            <Card className="w-full max-w-md text-center shadow-lg">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit mb-4">
                        <ShieldAlert className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-headline">{t('suspendedTitle')}</CardTitle>
                    <CardDescription>
                        {t('suspendedDesc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                        {t('suspendedReason')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                         <Button asChild className="w-full">
                            <Link href="/contact">
                                <MessageSquare className="mr-2 h-4 w-4"/>
                                {t('contactSupport')}
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full" onClick={handleLogout}>
                             <LogOut className="mr-2 h-4 w-4"/>
                            {t('logout')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
