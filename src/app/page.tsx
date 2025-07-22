import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus, LocateFixed, Search, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { mockItems } from '@/lib/data';

const recentlyFoundItems = mockItems.filter(item => item.type === 'found').slice(0, 3);

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="relative text-center py-20 md:py-32 overflow-hidden rounded-xl bg-card border">
         <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent z-0"></div>
         <div className="absolute inset-0 backdrop-blur-sm"></div>
        <div className="container relative z-10">
          <Badge variant="secondary" className="mb-4 text-sm py-1 px-4 rounded-full">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            Reuniting owners with their items
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-foreground tracking-tight">
            Lost It? We'll Help You Find It.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Our community and smart technology are here to help you find what's yours. Report a lost item or browse found items with ease.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/report-lost">Report a Lost Item</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <Link href="/browse">Browse Found Items</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-12">
        <h2 className="text-3xl font-bold text-center font-headline">How It Works</h2>
        <p className="text-center mt-2 text-muted-foreground">A simple, two-step process to reunite you with your belongings.</p>
        <div className="mt-12 grid md:grid-cols-2 gap-8 text-center">
          <Card className="transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl border-2 border-transparent hover:border-primary/50">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                <FilePlus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mt-4 font-headline text-2xl">1. Report Item</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Quickly fill out a form with details about your lost or found item. The more details, the better!</p>
            </CardContent>
          </Card>
          <Card className="transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl border-2 border-transparent hover:border-primary/50">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                <LocateFixed className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mt-4 font-headline text-2xl">2. Get Reunited</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">We connect you with the finder or owner of the item, helping you get your belongings back safely.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="recently-found" className="py-12">
        <h2 className="text-3xl font-bold text-center font-headline">Recently Found Items</h2>
        <p className="text-center mt-2 text-muted-foreground">Check out what our community has found recently.</p>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentlyFoundItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group border-2 border-transparent hover:border-primary/50 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-56 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{objectFit: 'cover'}}
                  className="transition-transform duration-500 group-hover:scale-110"
                  data-ai-hint="lost found item"
                />
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                <h3 className="font-semibold font-headline text-lg">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.location}</p>
                <p className="text-sm text-muted-foreground">{item.date.toLocaleDateString()}</p>
                <Button asChild variant="link" className="p-0 mt-4 text-base">
                  <Link href={`/browse?item=${item.id}`}>View Details <Search className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link href="/browse">View All Items</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
