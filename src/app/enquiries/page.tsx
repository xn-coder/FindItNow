
"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore";
import type { Claim, Item } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Inbox, Mail, MessageSquare, Package } from "lucide-react";

export default function EnquiriesPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loadingClaims, setLoadingClaims] = useState(true);
    const [claimedItems, setClaimedItems] = useState<Record<string, Item>>({});

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            const fetchClaims = async () => {
                setLoadingClaims(true);
                const q = query(
                    collection(db, "claims"), 
                    where("itemOwnerId", "==", user.id),
                    orderBy("submittedAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const claimsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Claim));
                
                const itemIds = [...new Set(claimsData.map(claim => claim.itemId))];
                const items: Record<string, Item> = {};

                for (const itemId of itemIds) {
                    const docRef = doc(db, "items", itemId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        items[itemId] = { id: docSnap.id, ...docSnap.data() } as Item;
                    }
                }

                setClaimedItems(items);
                setClaims(claimsData);
                setLoadingClaims(false);
            };
            fetchClaims();
        }
    }, [user]);

    if (authLoading || !user) {
        return (
             <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <Skeleton className="h-24 w-24 rounded-md" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-5 w-1/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-3/4" />
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
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline flex items-center gap-3">
                        <Inbox className="h-8 w-8 text-primary"/>
                        My Enquiries
                    </CardTitle>
                    <CardDescription>
                        Here are the claims submitted for items you've reported.
                    </CardDescription>
                </CardHeader>
            </Card>

            {loadingClaims ? (
                 <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <Skeleton className="h-24 w-24 rounded-md" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-5 w-1/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : claims.length > 0 ? (
                <div className="space-y-6">
                    {claims.map((claim) => {
                        const item = claimedItems[claim.itemId];
                        if (!item) return null;
                        return (
                            <Card key={claim.id} className="overflow-hidden">
                                <CardHeader className="bg-muted/50 p-4 border-b">
                                    <div className="flex items-center gap-3">
                                        <Package className="h-5 w-5 text-primary"/>
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        <span className="text-sm text-muted-foreground">(Item you reported)</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-5 w-5 text-muted-foreground"/>
                                            <p><span className="font-semibold">Claimant's Email:</span> {claim.email}</p>
                                        </div>
                                         <div className="flex items-start gap-3">
                                            <MessageSquare className="h-5 w-5 text-muted-foreground mt-1"/>
                                            <div>
                                                <p className="font-semibold">Proof of Ownership:</p>
                                                <p className="text-muted-foreground bg-slate-50 p-3 rounded-md mt-1 border">{claim.proof}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-card rounded-lg border">
                    <p className="text-xl font-medium">No enquiries yet.</p>
                    <p className="text-muted-foreground mt-2">When someone claims one of your found items, you'll see it here.</p>
                </div>
            )}
        </div>
    );
}
