"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import type { Item } from "@/lib/types";
import { Timestamp } from "firebase/firestore";
import { ItemCard } from "@/components/item-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { User, Mail } from "lucide-react";

export default function AccountPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [items, setItems] = useState<Item[]>([]);
    const [loadingItems, setLoadingItems] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            const fetchItems = async () => {
                setLoadingItems(true);
                const q = query(
                    collection(db, "items"), 
                    where("userId", "==", user.id),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const itemsData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
                    return { id: doc.id, ...data, date } as Item;
                });
                setItems(itemsData);
                setLoadingItems(false);
            };
            fetchItems();
        }
    }, [user]);

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
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline flex items-center gap-3">
                        <User className="h-8 w-8 text-primary"/>
                        My Account
                    </CardTitle>
                    <CardDescription>
                        Welcome back! Here's an overview of your activity.
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
                <h2 className="text-2xl font-bold font-headline mb-4">My Submissions</h2>
                 {loadingItems ? (
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
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-16 bg-card rounded-lg border">
                        <p className="text-xl font-medium">You haven't submitted any items yet.</p>
                        <p className="text-muted-foreground mt-2">Report a lost or found item to see it here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
