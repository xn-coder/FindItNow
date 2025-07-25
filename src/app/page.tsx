

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileCheck, Sparkles, Building, Zap, Users, ArrowRight, MessageSquare, UserCheck, Share2, Star, Quote, Check, Search } from 'lucide-react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AppStoreIcon, GooglePlayIcon, SecureReportsIcon, VerifiedUsersIcon, FastMatchingIcon } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';


export default function Home() {
  const { t } = useContext(LanguageContext);

  return (
    <div className="space-y-16">
      <section className="py-8 md:py-16">
        <div className="container grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-foreground tracking-tight">
                    {t('heroTitle1')}
                </h1>
                <p className="text-lg text-muted-foreground">
                    {t('heroSubtitle')}
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow py-4 px-10 text-lg sm:text-xl h-auto">
                    <Link href="/browse">{t('heroButtonLost')}</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto py-4 px-10 text-lg sm:text-xl h-auto border-2 border-foreground">
                    <Link href="/report-found">{t('heroButtonFound')}</Link>
                    </Button>
                </div>
            </div>
             <div className="flex justify-center">
              <Image
                src="/hero.png"
                alt="FindItNow hero image"
                width={500}
                height={400}
                className="rounded-lg object-cover"
                data-ai-hint="lost and found items"
              />
            </div>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Link href="/browse" className="flex flex-col items-center space-y-4 p-4 rounded-lg hover:bg-muted transition-colors">
            <Image 
              src="/search.jpg"
              alt="Search icon"
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
            <h3 className="font-headline text-2xl lg:text-3xl font-semibold text-foreground">{t('feature1Title')}</h3>
            <p className="text-muted-foreground">{t('feature1Desc')}</p>
          </Link>
          <div className="flex flex-col items-center space-y-4 p-4 rounded-lg">
            <Image 
              src="/report.jpg"
              alt="Report icon"
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
            <h3 className="font-headline text-2xl lg:text-3xl font-semibold text-foreground">{t('feature2Title')}</h3>
            <p className="text-muted-foreground">{t('feature2Desc')}</p>
          </div>
          <div className="flex flex-col items-center space-y-4 p-4 rounded-lg">
            <Image 
              src="/business.jpg"
              alt="Business icon"
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
            <h3 className="font-headline text-2xl lg:text-3xl font-semibold text-foreground">{t('feature3Title')}</h3>
            <p className="text-muted-foreground">{t('feature3Desc')}</p>
          </div>
        </div>
      </section>
      
      <section id="features" className="py-12">
        <div className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-x-16 gap-y-12">
          
          {/* Column 1: Benefits & Success Story */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold font-headline mb-6">{t('benefitsTitle')}</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Check className="h-6 w-6 text-primary" />
                  <span className="text-lg">{t('benefit1')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-6 w-6 text-primary" />
                  <span className="text-lg">{t('benefit2')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-6 w-6 text-primary" />
                  <span className="text-lg">{t('benefit3')}</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold font-headline mb-6">{t('successTitle')}</h2>
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 border-2 border-primary">
                  <AvatarImage src="/profile.jpeg" alt="Anna Muller's avatar" data-ai-hint="woman face"/>
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div>
                  <blockquote className="text-lg italic text-foreground/80">"{t('successQuote')}"</blockquote>
                  <p className="font-semibold mt-2 text-muted-foreground">- Anna Muller</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 2: Download App & FAQ */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold font-headline mb-2">{t('downloadTitle')}</h2>
              <p className="text-lg text-muted-foreground mb-6">{t('downloadSubtitle')}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <Button variant="outline" size="lg" className="flex items-center gap-2 bg-background h-auto py-2">
                    <AppStoreIcon className="h-8 w-8"/>
                    <div>
                      <p className="text-xs -mb-1 text-left">{t('downloadOn')}</p>
                      <p className="text-lg font-semibold leading-5">App Store</p>
                    </div>
                 </Button>
                 <Button variant="outline" size="lg" className="flex items-center gap-2 bg-background h-auto py-2">
                    <GooglePlayIcon className="h-8 w-8"/>
                    <div>
                      <p className="text-xs -mb-1 text-left">{t('getItOn')}</p>
                      <p className="text-lg font-semibold leading-5">Google Play</p>
                    </div>
                 </Button>
              </div>
            </div>
            <div className="space-y-3">
                <Link href="#faq" className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                  <span className="font-medium text-sm sm:text-base">{t('faqLink1')}</span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="#faq" className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                  <span className="font-medium text-sm sm:text-base">{t('faqLink2')}</span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                 <Link href="#faq" className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                  <span className="font-medium text-sm sm:text-base">{t('faqLink3')}</span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                 <Link href="#faq" className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                  <span className="font-medium text-sm sm:text-base">{t('faqLink4')}</span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Link>
            </div>
          </div>

        </div>
      </section>

      <section id="new-testimonials" className="py-12 bg-muted/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">{t('testimonialsTitle')}</h2>
            <p className="text-muted-foreground mt-2">{t('testimonialsSubtitle')}</p>
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
                <blockquote className="text-lg font-medium leading-relaxed flex-grow">"{t('testimonial1Quote')}"</blockquote>
              </CardContent>
              <CardFooter className="p-6 pt-4 mt-auto">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://placehold.co/100x100" alt="User 1" data-ai-hint="woman face"/>
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Maria Jones</p>
                    <p className="text-sm text-muted-foreground">{t('testimonial1Role')}</p>
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
                <blockquote className="text-lg font-medium leading-relaxed flex-grow">"{t('testimonial2Quote')}"</blockquote>
              </CardContent>
              <CardFooter className="p-6 pt-4 mt-auto">
                 <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://placehold.co/100x100" alt="User 2" data-ai-hint="man face"/>
                    <AvatarFallback>DK</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">David Kim</p>
                    <p className="text-sm text-muted-foreground">{t('testimonial2Role')}</p>
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
                <blockquote className="text-lg font-medium leading-relaxed flex-grow">"{t('testimonial3Quote')}"</blockquote>
              </CardContent>
              <CardFooter className="p-6 pt-4 mt-auto">
                 <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://placehold.co/100x100" alt="User 3" data-ai-hint="woman face"/>
                    <AvatarFallback>LS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Linda Smith</p>
                    <p className="text-sm text-muted-foreground">{t('testimonial3Role')}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      <section id="faq" className="py-12 border-t">
        <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center font-headline mb-8">{t('faqTitle')}</h2>
            <Accordion type="single" collapsible className="w-full grid md:grid-cols-2 gap-x-8 gap-y-2">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="font-semibold text-lg text-left">{t('faq1Title')}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{t('faq1Content')}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="font-semibold text-lg text-left">{t('faq2Title')}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{t('faq2Content')}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="font-semibold text-lg text-left">{t('faq3Title')}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{t('faq3Content')}</AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-4">
                    <AccordionTrigger className="font-semibold text-lg text-left">{t('faq4Title')}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{t('faq4Content')}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger className="font-semibold text-lg text-left">{t('faq5Title')}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{t('faq5Content')}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger className="font-semibold text-lg text-left">{t('faq6Title')}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{t('faq6Content')}</AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </section>
    </div>
  );
}
