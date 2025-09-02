
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, Package, ShieldCheck, Handshake, Briefcase, UserCheck, Activity, Link as LinkIcon, FileText } from "lucide-react";
import { getAdminDashboardStats, getRecentActivity } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

type DashboardStats = {
    totalItems: number;
    activeClaims: number;
    resolvedCases: number;
    partnerContributions: number;
    totalLost: number;
    totalFound: number;
};

type ActivityItem = {
    id: string;
    type: 'item' | 'claim';
    timestamp: string;
    [key: string]: any;
};

function StatCard({ title, value, icon, description, loading }: { title: string, value: number | string, icon: React.ReactNode, description: string, loading: boolean }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{value}</div>}
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

function ActivityFeed({ activity, loading }: { activity: ActivityItem[], loading: boolean }) {
    const { t } = useTranslation();
    
    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (activity.length === 0) {
        return <p className="text-muted-foreground text-center">{t('adminNoRecentActivity')}</p>
    }

    const renderActivityText = (item: ActivityItem) => {
        if (item.type === 'item') {
            return <>{t('adminActivityItem', { name: '' })}<Link href={`/browse?item=${item.id}`} className="font-semibold text-primary hover:underline">{item.name}</Link></>
        }
        if (item.type === 'claim') {
            return <>{t('adminActivityClaim', { name: item.fullName, itemName: '' })}<Link href={`/browse?item=${item.itemId}`} className="font-semibold text-primary hover:underline">{item.itemName}</Link></>
        }
        return t('adminActivityUnknown');
    }

    const getActivityIcon = (type: 'item' | 'claim') => {
        switch (type) {
            case 'item': return <Package className="h-5 w-5" />;
            case 'claim': return <FileText className="h-5 w-5" />;
            default: return <Activity className="h-5 w-5" />;
        }
    }
    
    return (
        <div className="space-y-6">
            {activity.map(item => (
                <div key={item.id} className="flex items-start gap-4">
                    <div className="bg-muted p-2 rounded-full mt-1">
                        {getActivityIcon(item.type)}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm">{renderActivityText(item)}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsData, activityData] = await Promise.all([
                getAdminDashboardStats(),
                getRecentActivity()
            ]);
            setStats(statsData);
            setActivity(activityData as ActivityItem[]);
        } catch (error) {
            console.error("Failed to fetch admin dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title={t('adminStatTotalItems')}
                value={stats?.totalItems ?? 0}
                icon={<Package className="h-4 w-4 text-muted-foreground" />}
                description={t('adminStatTotalItemsDesc', { lost: stats?.totalLost ?? 0, found: stats?.totalFound ?? 0 })}
                loading={loading}
            />
             <StatCard 
                title={t('adminStatActiveClaims')}
                value={stats?.activeClaims ?? 0}
                icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
                description={t('adminStatActiveClaimsDesc')}
                loading={loading}
            />
             <StatCard 
                title={t('adminStatResolvedCases')}
                value={stats?.resolvedCases ?? 0}
                icon={<Handshake className="h-4 w-4 text-muted-foreground" />}
                description={t('adminStatResolvedCasesDesc')}
                loading={loading}
            />
             <StatCard 
                title={t('adminStatPartnerContributions')}
                value={stats?.partnerContributions ?? 0}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                description={t('adminStatPartnerContributionsDesc')}
                loading={loading}
            />
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {t('adminRecentActivity')}
                </CardTitle>
                <CardDescription>{t('adminRecentActivityDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ActivityFeed activity={activity} loading={loading} />
            </CardContent>
        </Card>
    </div>
  );
}
