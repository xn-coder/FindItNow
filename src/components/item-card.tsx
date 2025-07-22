import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Item } from "@/lib/types";
import { Calendar, MapPin, Search } from "lucide-react";

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={item.imageUrl}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint="lost found item"
          />
          <Badge
            className="absolute top-2 right-2"
            variant={item.type === 'lost' ? 'destructive' : 'default'}
          >
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2 font-normal">{item.category}</Badge>
        <CardTitle className="text-lg font-headline mb-2">{item.name}</CardTitle>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{item.date.toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4 bg-muted/50">
        <Button asChild variant="link" className="w-full p-0">
          <Link href={`/browse?item=${item.id}`}>
            View Details
            <Search className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
