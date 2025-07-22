
"use client";

import Image from "next/image";
import type { Item } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { ClaimForm } from "./claim-form";
import { Timestamp } from "firebase/firestore";

type ItemDetailProps = {
    item: Item;
};

export function ItemDetail({ item }: ItemDetailProps) {
    const date = item.date instanceof Timestamp ? item.date.toDate() : item.date;
    
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
                            variant={item.type === 'lost' ? 'destructive' : 'default'}
                         >
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Item
                        </Badge>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <Badge variant="secondary" className="mb-2 font-medium">{item.category}</Badge>
                        <h1 className="text-3xl md:text-4xl font-bold font-headline">{item.name}</h1>
                    </div>

                    <div className="space-y-4 text-base text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-primary" />
                            <span>{item.type === 'lost' ? 'Last seen at' : 'Found at'} <strong>{item.location}</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <span>{item.type === 'lost' ? 'Lost on' : 'Found on'} <strong>{date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
                        </div>
                    </div>

                    <p className="text-foreground/90 leading-relaxed">{item.description}</p>
                </div>
            </div>

            <Separator className="my-8 md:my-12" />

            {item.type === 'found' && (
                 <Card className="border-2 border-primary/50 shadow-lg">
                    <CardHeader className="text-center">
                        <Sparkles className="mx-auto h-8 w-8 text-primary mb-2" />
                        <CardTitle className="text-2xl font-headline">Is This Your Item?</CardTitle>
                        <CardDescription className="max-w-md mx-auto">
                            To claim this item, please provide some proof of ownership. This helps us ensure it gets back to the right person.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ClaimForm item={item} />
                    </CardContent>
                </Card>
            )}

             {item.type === 'lost' && (
                 <Card className="border-2">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-headline">Have you found this item?</CardTitle>
                        <CardDescription>
                           If you have found this item, please contact the owner to arrange its return. The reporter's contact email is provided below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-lg font-semibold">{item.contact}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
