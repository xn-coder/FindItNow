
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Item } from "@/lib/types";
import { Calendar, MapPin, Search } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { useContext } from "react";
import { LanguageContext } from "@/context/language-context";

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  const date = item.date instanceof Timestamp ? item.date.toDate() : item.date;
  const { t } = useContext(LanguageContext);
  
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{objectFit: 'cover'}}
            className="group-hover:scale-110 transition-transform duration-500"
            data-ai-hint="lost found item"
          />
           <Badge
            className="absolute top-3 right-3"
            variant={item.status === 'resolved' ? 'secondary' : item.type === 'lost' ? 'destructive' : 'default'}
          >
            {item.status === 'resolved' ? t('resolved') : t(item.type)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2 font-normal">{t(item.category as any)}</Badge>
        <CardTitle className="text-lg font-headline mb-2">{item.name}</CardTitle>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{date.toLocaleDateString(t('locale'))}</span>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4 bg-card">
        <Button asChild variant="link" className="w-full p-0">
          <Link href={`/browse?item=${item.id}`}>
            {t('viewDetails')}
            <Search className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
