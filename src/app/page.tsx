
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FilePlus, Search, Sparkles, ShieldCheck, Zap, Users, ArrowRight, MessageSquare, UserCheck } from 'lucide-react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AppStoreIcon, GooglePlayIcon } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function Home() {

  return (
    <div className="space-y-20">
      <section className="py-8 md:py-16">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold font-headline text-foreground tracking-tight">
                    Lost or found?
                </h1>
                <p className="text-lg text-muted-foreground">
                    Verloren oder gefunden
                </p>
                 <p className="text-lg text-muted-foreground -mt-4">
                    Perdu ou trouvé
                </p>
                <div className="flex flex-col sm:flex-row justify-start items-start gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
                    <Link href="/browse">Search for lost items</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                    <Link href="/report-found">Report found item</Link>
                    </Button>
                </div>
            </div>
             <div className="hidden md:flex justify-center">
              <Image 
                src="https://placehold.co/500x300.png" 
                alt="Lost and found items" 
                width={500} 
                height={300}
                className="rounded-lg"
                data-ai-hint="lost found items" 
              />
            </div>
        </div>
      </section>

      <section id="how-it-works" className="py-12 bg-muted/50 rounded-xl">
         <div className="container">
            <h2 className="text-3xl font-bold text-center font-headline">How it works</h2>
            <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center gap-4">
                     <div className="p-4 rounded-full w-fit bg-background border">
                        <FilePlus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xl">Submit report</h3>
                    <p className="text-muted-foreground">File a report to list your lost or found item</p>
                </div>
                 <div className="flex flex-col items-center gap-4">
                     <div className="p-4 rounded-full w-fit bg-background border">
                        <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xl">AI matches items</h3>
                    <p className="text-muted-foreground">Our AI finds possible matches automatically</p>
                </div>
                 <div className="flex flex-col items-center gap-4">
                     <div className="p-4 rounded-full w-fit bg-background border">
                        <UserCheck className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xl">Verified users</h3>
                    <p className="text-muted-foreground">Follow instructions to reclaim your property</p>
                </div>
            </div>
             <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="h-6 w-6 text-primary shrink-0"/>
                    <div>
                        <h4 className="font-semibold">Secure reports</h4>
                        <p className="text-sm text-muted-foreground">Your information is protected</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Zap className="h-6 w-6 text-primary shrink-0"/>
                    <div>
                        <h4 className="font-semibold">Fast matching</h4>
                        <p className="text-sm text-muted-foreground">Get results in less time</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Users className="h-6 w-6 text-primary shrink-0"/>
                    <div>
                        <h4 className="font-semibold">Verified users</h4>
                        <p className="text-sm text-muted-foreground">Trusted by 1,000+ users</p>
                    </div>
                </div>
             </div>
         </div>
      </section>

        <section id="testimonials-and-apps" className="py-12">
            <div className="container grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                     <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarImage src="https://placehold.co/40x40.png" alt="Sarah's avatar" data-ai-hint="woman face"/>
                                    <AvatarFallback>S</AvatarFallback>
                                </Avatar>
                                <div>
                                    <blockquote className="text-lg font-medium">"A valuable service that really works!"</blockquote>
                                    <p className="text-sm text-muted-foreground mt-2">Highly recommend this platform for lost items</p>
                                    <p className="font-semibold mt-4">Sarah</p>
                                </div>
                            </div>
                        </CardContent>
                     </Card>
                     <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                 <Avatar>
                                    <AvatarImage src="https://placehold.co/40x40.png" alt="Thomas' avatar" data-ai-hint="man face"/>
                                    <AvatarFallback>T</AvatarFallback>
                                </Avatar>
                                <div>
                                     <blockquote className="text-lg font-medium">"A valuable service that really works!"</blockquote>
                                    <p className="font-semibold mt-4">Thomas</p>
                                </div>
                            </div>
                        </CardContent>
                     </Card>
                </div>
                 <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold font-headline">Track & report on the go</h2>
                    <p className="mt-2 text-muted-foreground">Get our app for Android or iOS</p>
                    <div className="mt-6 flex justify-center md:justify-start gap-4">
                        <Link href="#">
                            <GooglePlayIcon className="h-12"/>
                            <span className="sr-only">Get on Google Play</span>
                        </Link>
                         <Link href="#">
                            <AppStoreIcon className="h-12"/>
                            <span className="sr-only">Download on the App Store</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>

      <section id="faq" className="py-12 border-t">
        <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-center font-headline">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="w-full mt-8">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg">What items can I report?</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                    You can report any item you have lost or found. This includes electronics, wallets, keys, accessories, bags, clothing, bottles, toys, documents, and more. If it's lost, someone might find it!
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg">How does the matching work?</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                    Our system uses the details you provide—like item category, description, location, and date—to find potential matches. Our AI helps to identify similarities between lost and found reports to increase the chances of a successful reunion.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg">Is there a fee to use this service?</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                    No, our core service is completely free for individuals to report and search for lost and found items. Our goal is to help reunite people with their belongings.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </section>
    </div>
  );
}
