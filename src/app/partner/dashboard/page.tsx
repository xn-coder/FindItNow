
"use client";

import { useContext } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building, PlusCircle, Package, Inbox } from "lucide-react";
import { LanguageContext } from "@/context/language-context";

// Mock data for demonstration
const recentItems = [
    { id: "1", name: "iPhone 14 Pro", category: "Electronics", status: "open", date: "2024-07-28" },
    { id: "2", name: "Leather Wallet", category: "Wallets", status: "resolved", date: "2024-07-27" },
    { id: "3", name: "Set of Keys", category: "Keys", status: "open", date: "2024-07-26" },
];

export default function PartnerDashboardPage() {
    const { t } = useContext(LanguageContext);

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline flex items-center gap-3">
                        <Building className="h-8 w-8 text-primary"/>
                        {t('partnerDashboardTitle')}
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{t('partnerItemsReported')}</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">125</div>
                        <p className="text-xs text-muted-foreground">{t('partnerItemsTotal')}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{t('partnerOpenClaims')}</CardTitle>
                        <Inbox className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                         <p className="text-xs text-muted-foreground">{t('partnerClaimsUnresolved')}</p>
                    </CardContent>
                </Card>
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
                            {recentItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === 'open' ? 'default' : 'secondary'}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
