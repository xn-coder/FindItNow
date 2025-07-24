
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FilePlus, Sparkles, ShieldCheck, Zap, Users, ArrowRight, MessageSquare, UserCheck, Share2 } from 'lucide-react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AppStoreIcon, GooglePlayIcon, SecureReportsIcon, VerifiedUsersIcon, FastMatchingIcon } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function Home() {

  return (
    <div className="space-y-20">
      <section className="py-8 md:py-16">
        <div className="container grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
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
                    <Link href="/report-lost">Search for lost items</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                    <Link href="/report-found">Report found item</Link>
                    </Button>
                </div>
            </div>
             <div className="flex justify-center">
              <Image
                src="https://img.freepik.com/free-vector/lost-and-found-banner-with-things-in-boxes_107791-11158.jpg?w=826"
                alt="Illustration of people looking at lost and found items"
                width={500}
                height={400}
                className="rounded-lg"
                data-ai-hint="lost and found"
              />
            </div>
        </div>
      </section>

      <section id="how-it-works" className="py-12">
         <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center font-headline">How it works</h2>
            <div className="mt-12 grid md:grid-cols-3 gap-y-12 gap-x-8 text-center">
                <div className="flex flex-col items-center gap-4">
                    <FilePlus className="h-12 w-12 text-black" strokeWidth={1.5}/>
                    <h3 className="font-semibold text-xl">Submit report</h3>
                    <p className="text-muted-foreground">File a report to list your lost or found item</p>
                </div>
                 <div className="flex flex-col items-center gap-4">
                    <Share2 className="h-12 w-12 text-black" strokeWidth={1.5}/>
                    <h3 className="font-semibold text-xl">AI matches items</h3>
                    <p className="text-muted-foreground">Our AI finds possible matches automatically</p>
                </div>
                 <div className="flex flex-col items-center gap-4">
                    <UserCheck className="h-12 w-12 text-black" strokeWidth={1.5}/>
                    <h3 className="font-semibold text-xl">Verified users</h3>
                    <p className="text-muted-foreground">Follow instructions to reclaim your property</p>
                </div>
                 <div className="flex flex-col items-center gap-4">
                    <SecureReportsIcon className="h-10 w-10 text-black" />
                    <h3 className="font-semibold text-xl">Secure reports</h3>
                    <p className="text-muted-foreground">Your information is protected</p>
                </div>
                 <div className="flex flex-col items-center gap-4">
                    <FastMatchingIcon className="h-10 w-10 text-black" />
                    <h3 className="font-semibold text-xl">Fast matching</h3>
                    <p className="text-muted-foreground">Get results in less time</p>
                </div>
                 <div className="flex flex-col items-center gap-4">
                    <VerifiedUsersIcon className="h-10 w-10 text-black" />
                    <h3 className="font-semibold text-xl">Verified users</h3>
                    <p className="text-muted-foreground">Trusted by 1,000+ users</p>
                </div>
            </div>
         </div>
      </section>

      <section id="testimonials-download" className="py-12 bg-muted/50">
        <div className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center font-headline">What our users say</h2>
              <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20 border-2 border-primary">
                      <AvatarImage src="https://img.freepik.com/free-photo/pretty-smiling-joyfully-female-with-fair-hair-dressed-casually-looking-with-satisfaction_176420-15187.jpg?semt=ais_hybrid&w=740" alt="Sarah's avatar" data-ai-hint="woman face"/>
                      <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                  <div>
                      <blockquote className="text-lg font-medium leading-relaxed">"A valuable service that really works!"</blockquote>
                      <p className="font-semibold mt-2">Sarah</p>
                  </div>
              </div>
                <div className="flex items-start gap-4">
                  <div className="flex-grow">
                        <blockquote className="text-lg font-medium leading-relaxed text-right">"Highly recommend this platform for lost items"</blockquote>
                      <p className="font-semibold mt-2 text-right">Thomas</p>
                  </div>
                    <Avatar className="w-20 h-20 border-2 border-primary">
                      <AvatarImage src="https://images.unsplash.com/photo-1624421998513-77a9ebb43d0d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW1lcmljYW4lMjBib3l8ZW58MHx8MHx8fDA%3D" alt="Thomas' avatar" data-ai-hint="man face"/>
                      <AvatarFallback>T</AvatarFallback>
                  </Avatar>
              </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold font-headline">Track &amp; report on the go</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get our app for Android or iOS to get instant notifications and manage your reports easily.
            </p>
            <div className="mt-6 flex justify-center md:justify-start gap-4">
               <Button variant="outline" size="lg" className="flex items-center gap-2 bg-background">
                  <GooglePlayIcon className="h-6 w-6"/>
                  <div>
                    <p className="text-xs -mb-1">Get on</p>
                    <p className="text-base font-semibold">Google Play</p>
                  </div>
               </Button>
               <Button variant="outline" size="lg" className="flex items-center gap-2 bg-background">
                  <AppStoreIcon className="h-6 w-6"/>
                  <div>
                    <p className="text-xs -mb-1">Download on the</p>
                    <p className="text-base font-semibold">App Store</p>
                  </div>
               </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-12 border-t">
        <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center font-headline mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full grid md:grid-cols-2 gap-x-8 gap-y-2">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="font-semibold text-lg text-left">What items can I report?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                    You can report any item you have lost or found. This includes electronics, wallets, keys, accessories, bags, clothing, bottles, toys, documents, and more. If it's lost, someone might find it!
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="font-semibold text-lg text-left">How does the matching work?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                    Our system uses the details you provide—like item category, description, location, and date—to find potential matches. Our AI helps to identify similarities between lost and found reports to increase the chances of a successful reunion.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="font-semibold text-lg text-left">Is there a fee to use this service?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                    No, our core service is completely free for individuals to report and search for lost and found items. Our goal is to help reunite people with their belongings.
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-4">
                    <AccordionTrigger className="font-semibold text-lg text-left">How do I claim a found item?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                        If you believe a listed found item is yours, open the item's detail page and use the 'Claim Item' form. Provide specific details that only the owner would know to prove your ownership. The person who found the item will be notified of your claim.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger className="font-semibold text-lg text-left">What if someone claims my item?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                        You will receive an email notification with the claimant's message. It is your responsibility to review their proof of ownership and coordinate the return. Always meet in a public, safe location.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger className="font-semibold text-lg text-left">Is my personal information safe?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                        Yes, we take your privacy seriously. Your contact information is only for verification and to connect you with a potential owner or finder. It is not displayed publicly on the website.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </section>
    </div>
  );
}
