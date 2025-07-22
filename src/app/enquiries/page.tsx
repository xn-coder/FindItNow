
"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, doc, getDoc, Timestamp } from "firebase/firestore";
import type { Claim, Item } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Inbox, Mail, MessageSquare, Package, User } from "lucide-react";

export default function EnquiriesPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [enquiries, setEnquiries] = useState<Claim[]>([]);
    const [loadingEnquiries, setLoadingEnquiries] = useState(true);
    const [relatedItems, setRelatedItems] = useState<Record<string, Item>>({});

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            const fetchEnquiries = async () => {
                setLoadingEnquiries(true);
                // Fetch all claims/messages where the current user is the item owner
                const q = query(
                    collection(db, "claims"), 
                    where("itemOwnerId", "==", user.id),
                    orderBy("submittedAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const enquiriesData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return { 
                        id: doc.id, 
                        ...data,
                        submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate() : new Date(data.submittedAt)
                    } as Claim
                });
                
                // Get the unique item IDs from the enquiries
                const itemIds = [...new Set(enquiriesData.map(enquiry => enquiry.itemId))];
                const items: Record<string, Item> = {};

                // Fetch the details for each unique item
                for (const itemId of itemIds) {
                    if (itemId) {
                        const docRef = doc(db, "items", itemId);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            const itemData = docSnap.data();
                            items[itemId] = { 
                                id: docSnap.id, 
                                ...itemData,
                                date: itemData.date instanceof Timestamp ? itemData.date.toDate() : new Date(itemData.date),
                                createdAt: itemData.createdAt instanceof Timestamp ? itemData.createdAt.toDate() : new Date(itemData.createdAt),
                             } as Item;
                        }
                    }
                }

                setRelatedItems(items);
                setEnquiries(enquiriesData);
                setLoadingEnquiries(false);
            };
            fetchEnquiries();
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

    const getEnquiryTitle = (itemType?: 'lost' | 'found') => {
        if (itemType === 'lost') {
            return 'Message from Finder';
        }
        return 'Claim of Ownership';
    };
    
    const getEnquiryProofLabel = (itemType?: 'lost' | 'found') => {
        if (itemType === 'lost') {
            return 'Finder\'s Message:';
        }
        return 'Proof of Ownership:';
    }

    const getEnquirerLabel = (itemType?: 'lost' | 'found') => {
        if (itemType === 'lost') {
            return "Finder's Details";
        }
        return "Claimant's Details";
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
                        Here are the claims and messages submitted for items you've reported.
                    </CardDescription>
                </CardHeader>
            </Card>

            {loadingEnquiries ? (
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
            ) : enquiries.length > 0 ? (
                <div className="space-y-6">
                    {enquiries.map((enquiry) => {
                        const item = relatedItems[enquiry.itemId];
                        if (!item) return null;
                        const enquiryDate = enquiry.submittedAt instanceof Timestamp ? enquiry.submittedAt.toDate() : enquiry.submittedAt;
                        return (
                            <Card key={enquiry.id} className="overflow-hidden">
                                <CardHeader className="bg-muted/50 p-4 border-b flex-row items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Package className="h-5 w-5 text-primary"/>
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        <span className="text-sm text-muted-foreground">(Item you reported as {item.type})</span>
                                    </div>
                                     <span className="text-sm text-muted-foreground">
                                        {enquiryDate.toLocaleDateString()}
                                    </span>
                                </CardHeader>
                                <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                         <h4 className="font-semibold text-lg">{getEnquiryTitle(item.type)}</h4>
                                         <div className="flex items-start gap-3">
                                            <MessageSquare className="h-5 w-5 text-muted-foreground mt-1"/>
                                            <div>
                                                <p className="font-semibold">{getEnquiryProofLabel(item.type)}</p>
                                                <p className="text-muted-foreground bg-slate-50 p-3 rounded-md mt-1 border">{enquiry.proof}</p>
                                            </div>
                                        </div>
                                    </div>
                                     <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                                         <h4 className="font-semibold text-lg">{getEnquirerLabel(item.type)}</h4>
                                        <div className="flex items-center gap-3">
                                            <User className="h-5 w-5 text-muted-foreground"/>
                                            <p><span className="font-semibold">Name:</span> {enquiry.fullName}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-5 w-5 text-muted-foreground"/>
                                            <p><span className="font-semibold">Email:</span> {enquiry.email}</p>
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
                    <p className="text-muted-foreground mt-2">When someone claims your found item or messages you about a lost one, you'll see it here.</p>
                </div>
            )}
        </div>
    );
}

