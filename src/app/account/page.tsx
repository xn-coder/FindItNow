
"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from "firebase/firestore";
import type { Item, Claim } from "@/lib/types";
import { Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { User, Mail, MessageSquare, Briefcase } from "lucide-react";
import { AccountItemCard } from "@/components/account-item-card";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const { toast } = useToast();
    const { t } = useTranslation();
    const [items, setItems] = useState<Item[]>([]);
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchData = async () => {
         if (user) {
            setLoading(true);
            // Fetch items reported by the user
            const itemsQuery = query(
                collection(db, "items"), 
                where("userId", "==", user.id),
                orderBy("createdAt", "desc")
            );
            const itemsSnapshot = await getDocs(itemsQuery);
            const itemsData = itemsSnapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data, date: (data.date as Timestamp).toDate(), createdAt: (data.createdAt as Timestamp)?.toDate() || new Date() } as Item;
            });
            setItems(itemsData);

            // Fetch claims submitted by the user
            const claimsQuery = query(
                collection(db, "claims"), 
                where("userId", "==", user.id),
                orderBy("submittedAt", "desc")
            );
            const claimsSnapshot = await getDocs(claimsQuery);
            const claimsData = claimsSnapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data, submittedAt: (data.submittedAt as Timestamp).toDate() } as Claim;
            });
            setClaims(claimsData);

            setLoading(false);
        }
    }

    useEffect(() => {
       fetchData();
    }, [user]);

    const handleDeleteRequest = (item: Item) => {
        setItemToDelete(item);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        try {
            await deleteDoc(doc(db, "items", itemToDelete.id));
            toast({
                title: "Item Deleted",
                description: "Your item listing has been successfully removed.",
            });
            setItems(items.filter(item => item.id !== itemToDelete.id));
        } catch (error) {
            console.error("Error deleting document: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not delete the item. Please try again.",
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    if (authLoading || !user) {
        return (
             <div className="space-y-8">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-8 w-1/4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                         <Card key={i} className="flex flex-col h-full overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-4 flex-grow space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                            </CardContent>
                            <Separator />
                            <CardFooter className="p-4">
                            <Skeleton className="h-8 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline flex items-center gap-3">
                            <User className="h-8 w-8 text-primary"/>
                            {t('accountTitle')}
                        </CardTitle>
                        <CardDescription>
                           {t('accountSubtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3 text-lg">
                             <Mail className="h-5 w-5 text-muted-foreground"/>
                             <span className="font-semibold">{user.email}</span>
                        </div>
                    </CardContent>
                </Card>

                <div>
                    <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-3">
                        <Briefcase className="h-6 w-6 text-primary"/>
                        {t('accountMySubmissions')}
                    </h2>
                     {loading ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Card key={i} className="flex flex-col h-full overflow-hidden">
                                    <Skeleton className="h-48 w-full" />
                                    <CardContent className="p-4 flex-grow space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-1/3" />
                                    </CardContent>
                                    <Separator />
                                    <CardFooter className="p-4">
                                    <Skeleton className="h-8 w-full" />
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : items.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map((item) => (
                                <AccountItemCard key={item.id} item={item} onDelete={handleDeleteRequest} />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-16 bg-card rounded-lg border">
                            <p className="text-xl font-medium">{t('accountNoSubmissions')}</p>
                            <p className="text-muted-foreground mt-2">{t('accountNoSubmissionsDesc')}</p>
                        </div>
                    )}
                </div>

                 <div>
                    <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-3">
                        <MessageSquare className="h-6 w-6 text-primary" />
                        {t('accountMyClaims')}
                    </h2>
                     {loading ? (
                        <Card><CardContent className="p-4"><Skeleton className="h-16 w-full"/></CardContent></Card>
                    ) : claims.length > 0 ? (
                       <Card>
                           <CardContent className="p-0">
                                <ul className="divide-y">
                                    {claims.map((claim) => (
                                        <li key={claim.id} className="p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{t('accountClaimForItem')} <Link href={`/browse?item=${claim.itemId}`} className="text-primary hover:underline">#{claim.itemId.substring(0, 6)}</Link></p>
                                                <p className="text-sm text-muted-foreground">{t('accountClaimStatus')}: <span className="font-medium capitalize">{t(claim.status)}</span></p>
                                            </div>
                                            {claim.status === 'accepted' && (
                                                <Button asChild size="sm">
                                                    <Link href={`/chat/${claim.chatId}`}>{t('accountViewChat')}</Link>
                                                </Button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                           </CardContent>
                       </Card>
                    ) : (
                         <div className="text-center py-16 bg-card rounded-lg border">
                            <p className="text-xl font-medium">{t('accountNoClaims')}</p>
                            <p className="text-muted-foreground mt-2">{t('accountNoClaimsDesc')}</p>
                        </div>
                    )}
                </div>
            </div>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>{t('accountDeleteItemConfirm')}</AlertDialogTitle>
                    <AlertDialogDescription>
                       {t('accountDeleteItemDesc')}
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
