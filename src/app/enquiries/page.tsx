
"use client";

import { useContext, useEffect, useState, useTransition } from "react";
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, doc, getDoc, Timestamp, updateDoc, writeBatch } from "firebase/firestore";
import type { Claim, Item } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Inbox, Mail, MessageSquare, Package, User, MapPin, Calendar, CheckCircle2, Loader2, Circle, Phone, ShieldCheck, MessageCircle, Image as ImageIcon } from "lucide-react";
import { FeedbackDialog } from "@/components/feedback-dialog";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

export default function EnquiriesPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [enquiries, setEnquiries] = useState<Claim[]>([]);
    const [loadingEnquiries, setLoadingEnquiries] = useState(true);
    const [relatedItems, setRelatedItems] = useState<Record<string, Item>>({});
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const { t } = useTranslation();
    const [feedbackClaim, setFeedbackClaim] = useState<Claim | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchEnquiries = async () => {
        if (user) {
            setLoadingEnquiries(true);
            const q = query(
                collection(db, "claims"),
                where("itemOwnerId", "==", user.id),
                where("status", "in", ["open", "accepted"]),
                orderBy("submittedAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const enquiriesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate() : new Date(data.submittedAt),
                    date: data.date instanceof Timestamp ? data.date.toDate() : data.date ? new Date(data.date) : undefined,
                    chatId: doc.id, // Assign chatId from claimId
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
                            date: (itemData.date as Timestamp).toDate(),
                            createdAt: (itemData.createdAt as Timestamp)?.toDate(),
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
        if (user) {
            fetchEnquiries();
        }
    }, [user]);

    const handleAcceptClaim = (claim: Claim) => {
        startTransition(async () => {
            try {
                const claimRef = doc(db, "claims", claim.id);
                await updateDoc(claimRef, { status: 'accepted', chatId: claim.id });

                setEnquiries(prev => prev.map(e => e.id === claim.id ? { ...e, status: 'accepted', chatId: claim.id } : e));
                toast({
                    title: t('toastClaimAcceptedTitle'),
                    description: t('toastClaimAcceptedDesc'),
                });
            } catch (error) {
                console.error("Error accepting claim: ", error);
                toast({ variant: "destructive", title: "Error", description: "Could not accept the claim." });
            }
        });
    };

    const handleMarkAsResolved = (claim: Claim) => {
        startTransition(async () => {
            try {
                const batch = writeBatch(db);
                const itemRef = doc(db, "items", claim.itemId);
                batch.update(itemRef, {
                    status: 'resolved',
                    claimantInfo: { fullName: claim.fullName, email: claim.email }
                });

                const claimsQuery = query(collection(db, "claims"), where("itemId", "==", claim.itemId));
                const claimsSnapshot = await getDocs(claimsQuery);
                claimsSnapshot.forEach(claimDoc => {
                    batch.update(claimDoc.ref, { status: 'resolved' });
                });

                await batch.commit();

                toast({
                    title: t('toastEnquiryResolvedTitle'),
                    description: t('toastEnquiryResolvedDesc'),
                });
                
                setEnquiries(prev => prev.filter(e => e.itemId !== claim.itemId));
                setFeedbackClaim(claim);

            } catch (error) {
                console.error("Error resolving enquiry: ", error);
                toast({ variant: "destructive", title: "Error", description: "Could not update the enquiry." });
            }
        });
    }

    if (authLoading || !user) {
        return (
             <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
                    ))}
                </div>
            </div>
        );
    }

    const getEnquiryTitle = (itemType?: 'lost' | 'found') => {
        if (itemType === 'lost') return t('enquiriesMessageFromFinder');
        return t('enquiriesClaimOfOwnership');
    };

    const getEnquiryProofLabel = (itemType?: 'lost' | 'found') => {
        if (itemType === 'lost') return t('enquiriesFindersMessage');
        return t('enquiriesProofOfOwnership');
    }

    const getEnquirerLabel = (itemType?: 'lost' | 'found') => {
        if (itemType === 'lost') return t('enquiriesFindersDetails');
        return t('enquiriesClaimantsDetails');
    }

    return (
        <>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline flex items-center gap-3">
                            <Inbox className="h-8 w-8 text-primary"/>
                            {t('enquiriesTitle')}
                        </CardTitle>
                        <CardDescription>
                            {t('enquiriesSubtitle')}
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
                            const enquiryDate = enquiry.submittedAt instanceof Timestamp ? enquiry.submittedAt.toDate() : new Date(enquiry.submittedAt);
                            const foundDate = enquiry.date ? (enquiry.date instanceof Timestamp ? enquiry.date.toDate() : new Date(enquiry.date)) : null;

                            return (
                                <Card key={enquiry.id} className="overflow-hidden">
                                    <CardHeader className="bg-muted/50 p-4 border-b flex-row items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-primary"/>
                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                            <span className="text-sm text-muted-foreground">{t('enquiriesItemReportedAs', { itemType: t(item.type) })}</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">{t('enquiriesReceivedOn', { date: enquiryDate.toLocaleDateString() })}</span>
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
                                            {enquiry.proofImageUrl && (
                                                <div className="flex items-start gap-3">
                                                    <ImageIcon className="h-5 w-5 text-muted-foreground mt-1"/>
                                                    <div>
                                                        <p className="font-semibold">{t('claimFormProofImage')}</p>
                                                        <a href={enquiry.proofImageUrl} target="_blank" rel="noopener noreferrer">
                                                            <Image src={enquiry.proofImageUrl} alt="Proof Image" width={200} height={200} className="mt-1 rounded-md border object-cover"/>
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                            {item.type === 'lost' && enquiry.location && foundDate && (
                                                <>
                                                    <div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-muted-foreground mt-1"/><div><p className="font-semibold">{t('enquiriesLocationReported')}</p><p className="text-muted-foreground">{enquiry.location}</p></div></div>
                                                    <div className="flex items-start gap-3"><Calendar className="h-5 w-5 text-muted-foreground mt-1"/><div><p className="font-semibold">{t('enquiriesDateReported')}</p><p className="text-muted-foreground">{foundDate.toLocaleDateString()}</p></div></div>
                                                </>
                                            )}
                                        </div>
                                        <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                                            <h4 className="font-semibold text-lg">{getEnquirerLabel(item.type)}</h4>
                                            <div className="flex items-center gap-3"><User className="h-5 w-5 text-muted-foreground"/><p><span className="font-semibold">{t('enquiriesName')}</span> {enquiry.fullName}</p></div>
                                            <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-muted-foreground"/><p><span className="font-semibold">{t('enquiriesEmail')}</span> {enquiry.email}</p></div>
                                            {enquiry.phoneNumber && (<div className="flex items-center gap-3"><Phone className="h-5 w-5 text-muted-foreground"/><p><span className="font-semibold">{t('enquiriesPhone')}</span> {enquiry.phoneNumber}</p></div>)}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-muted/50 p-4 border-t flex items-center justify-end gap-2">
                                        {enquiry.status === 'open' && (
                                            <Button size="sm" variant="outline" onClick={() => handleAcceptClaim(enquiry)} disabled={isPending}>
                                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4"/>}
                                                {t('enquiriesAcceptClaim')}
                                            </Button>
                                        )}
                                        {enquiry.status === 'accepted' && (
                                            <Button asChild size="sm" variant="secondary">
                                                <Link href={`/chat/${enquiry.chatId}`}><MessageCircle className="mr-2 h-4 w-4"/>{t('chatWithClaimant')}</Link>
                                            </Button>
                                        )}
                                        <Button size="sm" onClick={() => handleMarkAsResolved(enquiry)} disabled={isPending}>
                                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4"/>}
                                            {t('enquiriesMarkAsResolved')}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-card rounded-lg border">
                        <p className="text-xl font-medium">{t('enquiriesNoEnquiries')}</p>
                        <p className="text-muted-foreground mt-2">{t('enquiriesNoEnquiriesDesc')}</p>
                    </div>
                )}
            </div>
             {feedbackClaim && user && (
                <FeedbackDialog 
                    isOpen={!!feedbackClaim} 
                    onClose={() => setFeedbackClaim(null)} 
                    claim={feedbackClaim}
                    item={relatedItems[feedbackClaim.itemId]}
                    user={user}
                />
            )}
        </>
    );
}
