
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
import { Inbox, Mail, MessageSquare, Package, User, CheckCircle2, Loader2, Phone, ShieldCheck, MessageCircle, Image as ImageIcon, Hourglass, Eye } from "lucide-react";
import { FeedbackDialog } from "@/components/feedback-dialog";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { translateText } from "@/ai/translate-flow";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PartnerEnquiriesPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const { toast } = useToast();
    const { t, i18n } = useTranslation();
    const [originalEnquiries, setOriginalEnquiries] = useState<Claim[]>([]);
    const [translatedEnquiries, setTranslatedEnquiries] = useState<Claim[]>([]);
    const [loadingEnquiries, setLoadingEnquiries] = useState(true);
    const [relatedItems, setRelatedItems] = useState<Record<string, Item>>({});
    const [isPending, startTransition] = useTransition();
    const [feedbackClaim, setFeedbackClaim] = useState<Claim | null>(null);

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
                 where("status", "in", ["open", "accepted", "resolving"]),
                orderBy("submittedAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            let enquiriesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    submittedAt: (data.submittedAt as Timestamp).toDate(),
                    chatId: doc.id, // Assign chatId from claimId
                } as Claim
            });

            setOriginalEnquiries(enquiriesData);
            setTranslatedEnquiries(enquiriesData);
            
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
                         } as Item;
                    }
                }
            }

            setRelatedItems(items);
            setLoadingEnquiries(false);
        }
    };

    useEffect(() => {
        if (user?.isPartner) {
            fetchEnquiries();
        }
    }, [user]);

    useEffect(() => {
        const translateEnquiries = async () => {
            if (i18n.language === 'en') {
                setTranslatedEnquiries(originalEnquiries);
                return;
            }
            if (originalEnquiries.length === 0) return;

            const translated = await Promise.all(
                originalEnquiries.map(async (enquiry) => {
                    const [translatedItemName, translatedProof] = await Promise.all([
                        translateText(enquiry.itemName, i18n.language),
                        translateText(enquiry.proof, i18n.language),
                    ]);
                    return { ...enquiry, itemName: translatedItemName, proof: translatedProof };
                })
            );
            setTranslatedEnquiries(translated);
        };
        translateEnquiries();
    }, [i18n.language, originalEnquiries]);

     const handleAcceptClaim = (claim: Claim) => {
        startTransition(async () => {
            try {
                const claimRef = doc(db, "claims", claim.id);
                await updateDoc(claimRef, { status: 'accepted', chatId: claim.id });

                setOriginalEnquiries(prev => prev.map(e => e.id === claim.id ? { ...e, status: 'accepted', chatId: claim.id } : e));
                setTranslatedEnquiries(prev => prev.map(e => e.id === claim.id ? { ...e, status: 'accepted', chatId: claim.id } : e));
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
                 // Set the current claim to 'resolving'
                const claimRef = doc(db, "claims", claim.id);
                await updateDoc(claimRef, { status: 'resolving' });
                
                setOriginalEnquiries(prev => prev.map(e => e.id === claim.id ? { ...e, status: 'resolving' } : e));
                setTranslatedEnquiries(prev => prev.map(e => e.id === claim.id ? { ...e, status: 'resolving' } : e));
                
                toast({
                    title: t('toastEnquiryResolvingTitle'),
                    description: t('toastEnquiryResolvingDesc'),
                });
                
            } catch (error) {
                console.error("Error initiating resolution: ", error);
                toast({ variant: "destructive", title: "Error", description: "Could not start the resolution process." });
            }
        });
    }

    if (authLoading || !user) {
        return (
             <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
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
                            <Inbox className="h-8 w-8 text-primary"/>
                            {t('enquiriesTitle')}
                        </CardTitle>
                        <CardDescription>
                            {t('partnerEnquiriesSubtitle')}
                        </CardDescription>
                    </CardHeader>
                </Card>

                {loadingEnquiries ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Card key={i}><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
                        ))}
                    </div>
                ) : translatedEnquiries.length > 0 ? (
                    <div className="space-y-6">
                        {translatedEnquiries.map((enquiry) => {
                            const item = relatedItems[enquiry.itemId];
                            if (!item) return null;
                            
                            return (
                                <Card key={enquiry.id} className="overflow-hidden">
                                    <CardHeader className="bg-muted/50 p-4 border-b flex-row items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-primary"/>
                                            <h3 className="font-semibold text-lg">{enquiry.itemName}</h3>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {t('enquiriesReceivedOn', {date: enquiry.submittedAt.toLocaleDateString()})}
                                        </span>
                                    </CardHeader>
                                    <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-lg">{t('enquiriesClaimOfOwnership')}</h4>
                                                 <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />{t('viewProof')}</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>{t('proofOfOwnership')}</DialogTitle>
                                                            <DialogDescription>{t('proofSubmittedBy', {name: enquiry.fullName})}</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <p className="text-sm text-muted-foreground bg-slate-50 p-3 rounded-md mt-1 border">{enquiry.proof}</p>
                                                            {enquiry.proofImageUrl && (
                                                                <div>
                                                                    <p className="font-semibold mb-2">{t('claimFormProofImage')}</p>
                                                                    <Image src={enquiry.proofImageUrl} alt="Proof Image" width={400} height={400} className="rounded-md border object-cover w-full"/>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                        <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                                            <h4 className="font-semibold text-lg">{t('enquiriesClaimantsDetails')}</h4>
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
                                             <>
                                                <Button asChild size="sm" variant="secondary">
                                                    <Link href={`/chat/${enquiry.chatId}`}><MessageCircle className="mr-2 h-4 w-4"/>{t('chatWithClaimant')}</Link>
                                                </Button>
                                                <Button size="sm" onClick={() => handleMarkAsResolved(enquiry)} disabled={isPending}>
                                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4"/>}
                                                    {t('enquiriesMarkAsResolved')}
                                                </Button>
                                            </>
                                        )}
                                         {enquiry.status === 'resolving' && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Hourglass className="h-4 w-4 animate-spin" />
                                                <span>{t('enquiriesWaitingForConfirmation')}</span>
                                            </div>
                                        )}
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-card rounded-lg border">
                        <p className="text-xl font-medium">{t('enquiriesNoEnquiries')}</p>
                        <p className="text-muted-foreground mt-2">{t('partnerEnquiriesNoEnquiriesDesc')}</p>
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

    
