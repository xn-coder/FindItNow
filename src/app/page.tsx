import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus, LocateFixed, Search } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { mockItems } from '@/lib/data';

const recentlyFoundItems = mockItems.filter(item => item.type === 'found').slice(0, 3);

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary tracking-tight">
          Lost something?
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          Our community and smart technology are here to help you find what's yours. Report a lost item or browse found items with ease.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/report-lost">Report a Lost Item</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/browse">Browse Found Items</Link>
          </Button>
        </div>
      </section>

      <section id="how-it-works" className="py-12">
        <h2 className="text-3xl font-bold text-center font-headline">How It Works</h2>
        <p className="text-center mt-2 text-foreground/70">A simple, two-step process to reunite you with your belongings.</p>
        <div className="mt-12 grid md:grid-cols-2 gap-8 text-center">
          <Card className="transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <FilePlus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mt-4">1. Report Item</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">Quickly fill out a form with details about your lost or found item. The more details, the better!</p>
            </CardContent>
          </Card>
          <Card className="transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <LocateFixed className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mt-4">2. Get Reunited</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">We connect you with the finder or owner of the item, helping you get your belongings back safely.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="recently-found" className="py-12">
        <h2 className="text-3xl font-bold text-center font-headline">Recently Found Items</h2>
        <p className="text-center mt-2 text-foreground/70">Check out what our community has found recently.</p>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {recentlyFoundItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative h-48 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                  data-ai-hint="lost found item"
                />
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.location}</p>
                <p className="text-sm text-muted-foreground">{item.date.toLocaleDateString()}</p>
                <Button asChild variant="link" className="p-0 mt-2">
                  <Link href={`/browse?item=${item.id}`}>View Details <Search className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/browse">View All Items</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
