
"use client";

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { AuthContext } from '@/context/auth-context';
import { getNotificationCount } from '@/lib/actions';
import { Skeleton } from './ui/skeleton';
import { usePathname } from 'next/navigation';

export function NotificationBell() {
    const { user } = useContext(AuthContext);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        if (user) {
            const fetchCount = async () => {
                setLoading(true);
                try {
                    const notificationCount = await getNotificationCount(user.id);
                    setCount(notificationCount);
                } catch (error) {
                    console.error("Failed to fetch notification count:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchCount();
            
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchCount, 30000); 
            return () => clearInterval(interval);

        } else {
            setCount(0);
            setLoading(false);
        }
    }, [user, pathname]);

    if (loading) {
        return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    const destination = '/notifications';

    return (
        <Button asChild variant="ghost" size="icon" className="relative">
            <Link href={destination}>
                <Bell className="h-5 w-5" />
                {count > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {count}
                    </span>
                )}
                <span className="sr-only">View notifications</span>
            </Link>
        </Button>
    );
}
