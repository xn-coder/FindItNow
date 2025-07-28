
"use client";

import { useContext, useEffect, useState, useTransition } from "react";
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import type { Claim, Item } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Inbox, Mail, MessageSquare, Package, User, CheckCircle2, Loader2, Phone } from "lucide-react";

export default function PartnerEnquiriesPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [enquiries, setEnquiries] = useState<Claim[]>([]);
    const [loadingEnquiries, setLoadingEnquiries] = useState(true);
    const [relatedItems, setRelatedItems] = useState<Record<string, Item>>({});
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        if (!authLoading && (!user || !user.isPartner)) {
            router.push('/partner/login');
        }
    }, [user, authLoading, router]);

    const fetchEnquiries = async () => {
        if (user) {
            setLoadingEnquiries(true);
            const q = query(
                collection(db, "claims"),
                where("itemOwnerId", "==", user.id),
                where("status", "==", "open"),
                orderBy("submittedAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const enquiriesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate() : new Date(data.submittedAt),
                } as Claim
            });

            const itemIds = [...new Set(enquiriesData.map(enquiry => enquiry.itemId))];
            const items: Record<string, Item> = {};

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
                         } as Item;
                    }
                }
            }

            setRelatedItems(items);
            setEnquiries(enquiriesData);
            setLoadingEnquiries(false);
        }
    };

    useEffect(() => {
        if (user?.isPartner) {
            fetchEnquiries();
        }
    }, [user]);

    const handleMarkAsResolved = (claimId: string, itemId: string) => {
        startTransition(async () => {
            try {
                const claimRef = doc(db, "claims", claimId);
                await updateDoc(claimRef, { status: 'resolved' });
                
                const itemRef = doc(db, "items", itemId);
                await updateDoc(itemRef, { status: 'resolved' });

                toast({
                    title: "Enquiry Resolved",
                    description: "You've marked this enquiry as resolved.",
                });
                
                setEnquiries(prev => prev.filter(e => e.id !== claimId));
            } catch (error) {
                console.error("Error resolving enquiry: ", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not update the enquiry. Please try again.",
                });
            }
        });
    }

    if (authLoading || !user) {
        return (
             <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <Skeleton className="h-24 w-full" />
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
                        Item Enquiries
                    </CardTitle>
                    <CardDescription>
                        Here are the open claims for items you've reported. Review the proof and contact the claimant to arrange a return.
                    </CardDescription>
                </CardHeader>
            </Card>

            {loadingEnquiries ? (
                 <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
                    ))}
                </div>
            ) : enquiries.length > 0 ? (
                <div className="space-y-6">
                    {enquiries.map((enquiry) => {
                        const item = relatedItems[enquiry.itemId];
                        if (!item) return null;
                        
                        return (
                            <Card key={enquiry.id} className="overflow-hidden">
                                <CardHeader className="bg-muted/50 p-4 border-b flex-row items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Package className="h-5 w-5 text-primary"/>
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                    </div>
                                     <span className="text-sm text-muted-foreground">
                                        Received on: {enquiry.submittedAt.toLocaleDateString()}
                                    </span>
                                </CardHeader>
                                <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                         <h4 className="font-semibold text-lg">Claim of Ownership</h4>
                                         <div className="flex items-start gap-3">
                                            <MessageSquare className="h-5 w-5 text-muted-foreground mt-1"/>
                                            <div>
                                                <p className="font-semibold">Proof of Ownership:</p>
                                                <p className="text-muted-foreground bg-slate-50 p-3 rounded-md mt-1 border">{enquiry.proof}</p>
                                            </div>
                                        </div>
                                    </div>
                                     <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                                         <h4 className="font-semibold text-lg">Claimant's Details</h4>
                                        <div className="flex items-center gap-3">
                                            <User className="h-5 w-5 text-muted-foreground"/>
                                            <p><span className="font-semibold">Name:</span> {enquiry.fullName}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-5 w-5 text-muted-foreground"/>
                                            <p><span className="font-semibold">Email:</span> {enquiry.email}</p>
                                        </div>
                                        {enquiry.phoneNumber && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-5 w-5 text-muted-foreground"/>
                                                <p><span className="font-semibold">Phone:</span> {enquiry.phoneNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/50 p-4 border-t flex items-center justify-end">
                                    <Button
                                        size="sm"
                                        onClick={() => handleMarkAsResolved(enquiry.id, enquiry.itemId)}
                                        disabled={isPending}
                                    >
                                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4"/>}
                                        Mark as Resolved
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-card rounded-lg border">
                    <p className="text-xl font-medium">No open enquiries.</p>
                    <p className="text-muted-foreground mt-2">When someone claims an item you've reported, you'll see it here.</p>
                </div>
            )}
        </div>
    );
}

    
