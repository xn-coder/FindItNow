

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileCheck, Sparkles, Building, Zap, Users, ArrowRight, MessageSquare, UserCheck, Share2, Star, Quote, Check, Search } from 'lucide-react';
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
                src="https://img.freepik.com/free-vector/employment-insurance-abstract-concept_335657-3057.jpg?t=st=1753337203~exp=1753340803~hmac=e540540dec3ac212ee2b5912d6254dcb40eadb20b7bd58aad4e8868ee8895d75&w=1380"
                alt="Illustration of people looking at lost and found items"
                width={500}
                height={400}
                className="rounded-lg"
                data-ai-hint="lost and found"
              />
            </div>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Search className="h-10 w-10 text-primary" />
            <h3 className="font-headline text-3xl font-semibold text-foreground">Search</h3>
            <p className="text-muted-foreground">You can search for your lost item here.</p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <FileCheck className="h-10 w-10 text-primary" />
            <h3 className="font-headline text-3xl font-semibold text-foreground">Report</h3>
            <p className="text-muted-foreground">Have you found something? Create a found report.</p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Building className="h-10 w-10 text-primary" />
            <h3 className="font-headline text-3xl font-semibold text-foreground">For Businesses</h3>
            <p className="text-muted-foreground">Our solutions for lost and found offices: airports, hotels, and more.</p>
          </div>
        </div>
      </section>
      
      <section id="features" className="py-12">
        <div className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-x-16 gap-y-12">
          
          {/* Column 1: Benefits & Success Story */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold font-headline mb-6">Benefits</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Check className="h-6 w-6 text-primary" />
                  <span className="text-lg">Save time and effort</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-6 w-6 text-primary" />
                  <span className="text-lg">Receive notifications</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-6 w-6 text-primary" />
                  <span className="text-lg">More successful matches</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold font-headline mb-6">Success stories</h2>
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 border-2 border-primary">
                  <AvatarImage src="https://img.freepik.com/free-photo/pretty-smiling-joyfully-female-with-fair-hair-dressed-casually-looking-with-satisfaction_176420-15187.jpg?semt=ais_hybrid&w=740" alt="Anna Muller's avatar" data-ai-hint="woman face"/>
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div>
                  <blockquote className="text-lg italic text-foreground/80">"I found my laptop using this platform the very next day, I'm very grateful!"</blockquote>
                  <p className="font-semibold mt-2 text-muted-foreground">- Anna Muller</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 2: Download App & FAQ */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold font-headline mb-2">Download our app</h2>
              <p className="text-lg text-muted-foreground mb-6">Find lost or found items on the go</p>
              <div className="flex gap-4">
                 <Button variant="outline" size="lg" className="flex items-center gap-2 bg-background h-auto py-2">
                    <AppStoreIcon className="h-8 w-8"/>
                    <div>
                      <p className="text-xs -mb-1 text-left">Download on the</p>
                      <p className="text-lg font-semibold leading-5">App Store</p>
                    </div>
                 </Button>
                 <Button variant="outline" size="lg" className="flex items-center gap-2 bg-background h-auto py-2">
                    <GooglePlayIcon className="h-8 w-8"/>
                    <div>
                      <p className="text-xs -mb-1 text-left">GET IT ON</p>
                      <p className="text-lg font-semibold leading-5">Google Play</p>
                    </div>
                 </Button>
              </div>
            </div>
            <div className="space-y-3">
                <Link href="#faq" className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                  <span className="font-medium">How do I report a found item?</span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="#faq" className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                  <span className="font-medium">Is the service free of charge?</span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                 <Link href="#faq" className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                  <span className="font-medium">How can I edit my listings?</span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                 <Link href="#faq" className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                  <span className="font-medium">Can I search in another city?</span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Link>
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

      <section id="new-testimonials" className="py-12 bg-muted/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">Loved by our users</h2>
            <p className="text-muted-foreground mt-2">Here's what people are saying about FindItNow.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="flex flex-col bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6 flex-grow space-y-4">
                 <Quote className="h-6 w-6 text-primary/70" />
                <div className="flex gap-1 mb-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                </div>
                <blockquote className="text-lg font-medium leading-relaxed flex-grow">"This platform is a lifesaver! I lost my wallet and got it back within a day. The process was so simple."</blockquote>
              </CardContent>
              <CardFooter className="p-6 pt-4 mt-auto">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://placehold.co/100x100" alt="User 1" data-ai-hint="woman face"/>
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Maria Jones</p>
                    <p className="text-sm text-muted-foreground">Happy User</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card className="flex flex-col bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6 flex-grow space-y-4">
                 <Quote className="h-6 w-6 text-primary/70" />
                <div className="flex gap-1 mb-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                </div>
                <blockquote className="text-lg font-medium leading-relaxed flex-grow">"I found a phone and reported it here. The owner contacted me the same evening. So glad I could help!"</blockquote>
              </CardContent>
              <CardFooter className="p-6 pt-4 mt-auto">
                 <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://placehold.co/100x100" alt="User 2" data-ai-hint="man face"/>
                    <AvatarFallback>DK</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">David Kim</p>
                    <p className="text-sm text-muted-foreground">Good Samaritan</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card className="flex flex-col bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6 flex-grow space-y-4">
                 <Quote className="h-6 w-6 text-primary/70" />
                <div className="flex gap-1 mb-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400"/>
                </div>
                <blockquote className="text-lg font-medium leading-relaxed flex-grow">"The AI matching feature is brilliant. It suggested a match for my lost keys that I never would have found on my own."</blockquote>
              </CardContent>
              <CardFooter className="p-6 pt-4 mt-auto">
                 <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://placehold.co/100x100" alt="User 3" data-ai-hint="woman face"/>
                    <AvatarFallback>LS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Linda Smith</p>
                    <p className="text-sm text-muted-foreground">Grateful User</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
