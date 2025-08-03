
"use client";

import Image from "next/image";
import type { Item } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Check, Mail, MapPin, Sparkles, User } from "lucide-react";
import { ClaimForm } from "./claim-form";
import { Timestamp } from "firebase/firestore";
import { FoundItemForm } from "./found-item-form";
import { useContext } from "react";
import { LanguageContext } from "@/context/language-context";

type ItemDetailProps = {
    item: Item;
};

export function ItemDetail({ item }: ItemDetailProps) {
    const date = item.date instanceof Timestamp ? item.date.toDate() : item.date;
    const { t, language } = useContext(LanguageContext);
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-4">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                         <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{objectFit: 'cover'}}
                            data-ai-hint="lost found item"
                        />
                         <Badge
                            className="absolute top-4 right-4 text-sm py-1 px-3"
                            variant={item.status === 'resolved' ? 'secondary' : item.type === 'lost' ? 'destructive' : 'default'}
                         >
                            {t(item.status as any) === "Open" ? t(item.type === 'lost' ? 'lostItem' : 'found') : t(item.status as any)}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <Badge variant="secondary" className="mb-2 font-medium">{t(item.category as any)}</Badge>
                        <h1 className="text-3xl md:text-4xl font-bold font-headline">{item.name}</h1>
                    </div>

                    <div className="space-y-4 text-base text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-primary" />
                            <span>{item.type === 'lost' ? t('itemLastSeen') : t('itemFoundAt')} <strong>{item.location}</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <span>{item.type === 'lost' ? t('itemLostOn') : t('itemFoundOn')} <strong>{date.toLocaleDateString(t('locale'), { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
                        </div>
                    </div>

                    <p className="text-foreground/90 leading-relaxed">{item.description}</p>
                </div>
            </div>

            <Separator className="my-8 md:my-12" />

            {item.status === 'resolved' ? (
                 <Card className="border-2 border-green-500/50 shadow-lg">
                    <CardHeader className="text-center">
                        <Check className="mx-auto h-8 w-8 text-green-500 mb-2" />
                        <CardTitle className="text-2xl font-headline text-green-600">{t('itemResolvedTitle')}</CardTitle>
                        <CardDescription className="max-w-md mx-auto">
                            {t('itemResolvedDesc')}
                        </CardDescription>
                    </CardHeader>
                    {item.claimantInfo && (
                    <CardContent>
                        <div className="max-w-md mx-auto bg-green-50/50 border border-green-200 p-4 rounded-lg space-y-3">
                             <h4 className="font-semibold text-lg text-center">{t('itemClaimantInfo')}</h4>
                             <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground"/>
                                <div>
                                    <p className="font-semibold">{t('itemClaimantName')}</p>
                                    <p className="text-muted-foreground">{item.claimantInfo.fullName}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground"/>
                                <div>
                                    <p className="font-semibold">{t('itemClaimantEmail')}</p>
                                    <p className="text-muted-foreground">{item.claimantInfo.email}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    )}
                </Card>
            ) : (
                <>
                    {item.type === 'found' && (
                        <Card className="border-2 border-primary/50 shadow-lg">
                            <CardHeader className="text-center">
                                <Sparkles className="mx-auto h-8 w-8 text-primary mb-2" />
                                <CardTitle className="text-2xl font-headline">{t('isThisYourItemTitle')}</CardTitle>
                                <CardDescription className="max-w-md mx-auto">
                                    {t('isThisYourItemDesc')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ClaimForm item={item} />
                            </CardContent>
                        </Card>
                    )}

                    {item.type === 'lost' && (
                        <FoundItemForm item={item} />
                    )}
                </>
            )}
        </div>
    );
}
