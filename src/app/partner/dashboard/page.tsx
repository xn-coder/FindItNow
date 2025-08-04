
"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building, PlusCircle, Package, Inbox } from "lucide-react";
import { LanguageContext } from "@/context/language-context";
import { AuthContext } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp, limit, orderBy } from "firebase/firestore";
import type { Item } from "@/lib/types";
import { useRouter } from "next/navigation";
import { translateText } from "@/ai/translate-flow";

type TranslatedItem = Item & {
    translatedName?: string;
    translatedCategory?: string;
}

export default function PartnerDashboardPage() {
    const { t, language } = useContext(LanguageContext);
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();

    const [itemCount, setItemCount] = useState(0);
    const [claimCount, setClaimCount] = useState(0);
    const [recentItems, setRecentItems] = useState<TranslatedItem[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);

     useEffect(() => {
        if (!authLoading && !user) {
            router.push('/partner/login');
        } else if (!authLoading && user && !user.isPartner) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            setLoadingStats(true);
            
            const itemsQuery = query(collection(db, "items"), where("userId", "==", user.id));
            const itemsSnapshot = await getDocs(itemsQuery);
            setItemCount(itemsSnapshot.size);

            const recentItemsQuery = query(itemsQuery, orderBy("createdAt", "desc"), limit(5));
            const recentItemsSnapshot = await getDocs(recentItemsQuery);
            let itemsData = recentItemsSnapshot.docs.map(doc => {
                const data = doc.data();
                return { 
                    id: doc.id, 
                    ...data, 
                    date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date) 
                } as Item;
            });

            if (language !== 'en') {
                itemsData = await Promise.all(itemsData.map(async (item) => {
                    const [translatedName, translatedCategory] = await Promise.all([
                        translateText({ text: item.name, targetLanguage: language }),
                        translateText({ text: t(item.category as any), targetLanguage: language })
                    ]);
                    return { ...item, translatedName, translatedCategory };
                }));
            }
            
            setRecentItems(itemsData);

            const claimsQuery = query(collection(db, "claims"), where("itemOwnerId", "==", user.id), where("status", "==", "open"));
            const claimsSnapshot = await getDocs(claimsQuery);
            setClaimCount(claimsSnapshot.size);

            setLoadingStats(false);
        };

        if (user?.isPartner) {
            fetchDashboardData();
        }
    }, [user, language, t]);

    if (authLoading || !user) {
        return <div>Loading...</div>
    }


    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline flex items-center gap-3">
                        <Building className="h-8 w-8 text-primary"/>
                        {user.businessName}
                    </CardTitle>
                    <CardDescription>
                        {t('partnerDashboardSubtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/report-found">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            {t('partnerReportButton')}
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Link href="/browse" className="cursor-pointer">
                    <Card className="hover:bg-muted">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('partnerItemsReported')}</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loadingStats ? "..." : itemCount}</div>
                            <p className="text-xs text-muted-foreground">{t('partnerItemsTotal')}</p>
                        </CardContent>
                    </Card>
                </Link>
                 <Link href="/partner/enquiries" className="cursor-pointer">
                    <Card className="hover:bg-muted">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('partnerOpenClaims')}</CardTitle>
                            <Inbox className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loadingStats ? "..." : claimCount}</div>
                            <p className="text-xs text-muted-foreground">{t('partnerClaimsUnresolved')}</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('partnerRecentItemsTitle')}</CardTitle>
                    <CardDescription>{t('partnerRecentItemsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('partnerItemName')}</TableHead>
                                <TableHead>{t('partnerItemCategory')}</TableHead>
                                <TableHead>{t('partnerItemStatus')}</TableHead>
                                <TableHead>{t('partnerItemDate')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadingStats ? (
                                <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
                            ) : recentItems.length > 0 ? (
                                recentItems.map((item) => (
                                    <TableRow key={item.id} onClick={() => router.push(`/browse?item=${item.id}`)} className="cursor-pointer">
                                        <TableCell className="font-medium">{item.translatedName || item.name}</TableCell>
                                        <TableCell>{item.translatedCategory || t(item.category as any)}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 'open' ? 'default' : 'secondary'}>
                                                {t(item.status as any)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{(item.date as Date).toLocaleDateString(t('locale'))}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={4}>No items reported yet.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
