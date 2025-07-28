
"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Item } from "@/lib/types";
import { Calendar, MapPin, Search, Edit, Trash2 } from "lucide-react";
import { Timestamp } from "firebase/firestore";

type AccountItemCardProps = {
  item: Item;
  onDelete: (item: Item) => void;
};

export function AccountItemCard({ item, onDelete }: AccountItemCardProps) {
  const date = item.date instanceof Timestamp ? item.date.toDate() : item.date;
  
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Link href={`/browse?item=${item.id}`}>
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{objectFit: 'cover'}}
              className="group-hover:scale-110 transition-transform duration-500"
              data-ai-hint="lost found item"
            />
          </Link>
           <Badge
            className="absolute top-3 right-3"
            variant={item.status === 'resolved' ? 'secondary' : item.type === 'lost' ? 'destructive' : 'default'}
          >
            {item.status === 'resolved' ? 'Resolved' : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2 font-normal">{item.category}</Badge>
        <CardTitle className="text-lg font-headline mb-2">{item.name}</CardTitle>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{date.toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-2 bg-card grid grid-cols-2 gap-2">
         <Button asChild variant="outline" size="sm">
          <Link href={`/edit-item/${item.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(item)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

