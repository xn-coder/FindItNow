
"use client";

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import { getNotifications } from '@/lib/actions';
import type { Notification } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bell, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';


export default function NotificationsPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const { t } = useTranslation();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            const fetchNotifications = async () => {
                setLoading(true);
                try {
                    const fetchedNotifications = await getNotifications(user.id);
                    setNotifications(fetchedNotifications);
                } catch (error) {
                    console.error("Failed to fetch notifications:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchNotifications();
        }
    }, [user, authLoading, router]);

    if (loading || authLoading) {
        return (
             <div className="max-w-3xl mx-auto space-y-4">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                </Card>
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                         <Card key={i}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2 flex-grow">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-1/4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline flex items-center gap-3">
                        <Bell className="h-8 w-8 text-primary" />
                        {t('notifications')}
                    </CardTitle>
                    <CardDescription>
                        {t('notificationsDesc')}
                    </CardDescription>
                </CardHeader>
            </Card>

            {notifications.length > 0 ? (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <Link href={notif.link} key={notif.id}>
                             <Card className={cn(
                                "hover:bg-muted/50 transition-colors",
                                !notif.read && "bg-primary/5 border-primary/20"
                             )}>
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={cn(
                                        "h-2 w-2 rounded-full",
                                        !notif.read ? "bg-primary" : "bg-transparent"
                                    )} />
                                    <div className="flex-grow">
                                        <p className="font-medium">{notif.message}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDistanceToNow(notif.createdAt, { addSuffix: true })}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-10 text-center">
                        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">{t('noNotificationsTitle')}</h3>
                        <p className="text-muted-foreground mt-2">{t('noNotificationsDesc')}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
