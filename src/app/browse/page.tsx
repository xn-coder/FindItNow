'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ItemCard } from '@/components/item-card';
import { ItemDetail } from '@/components/item-detail';
import { itemCategories } from '@/lib/data';
import type { Item } from '@/lib/types';
import { ListFilter, Search } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


function ItemBrowser() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [itemType, setItemType] = useState('all');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
       const q = query(
        collection(db, "items"), 
        where("status", "==", "open")
      );
      const querySnapshot = await getDocs(q);
      const itemsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore Timestamp to JS Date
        const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
        return { id: doc.id, ...data, date } as Item;
      });
      setItems(itemsData);
      setLoading(false);
    };

    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = category === 'all' || item.category === category;
      const matchesType = itemType === 'all' || item.type === itemType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [items, searchTerm, category, itemType]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">Browse Items</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find what you're looking for, or see what others have found.
        </p>
      </div>

      <div className="bg-card p-4 rounded-lg shadow-sm border space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Search by name, description, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
            />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-4">
            <Select value={itemType} onValueChange={setItemType}>
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Item Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="found">Found</SelectItem>
            </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {itemCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                    {cat}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
      </div>
      
      {loading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="flex flex-col h-full overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 flex-grow space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
                <Separator />
                <CardFooter className="p-4">
                  <Skeleton className="h-8 w-full" />
                </CardFooter>
              </Card>
            ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item: Item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg">
          <p className="text-xl font-medium">No items found.</p>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get('item');
  const [item, setItem] = useState<Item | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (itemId) {
        setLoading(true);
        const docRef = doc(db, "items", itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
          setItem({ id: docSnap.id, ...data, date } as Item);
        } else {
          setItem(undefined); // Not found
        }
        setLoading(false);
      }
    };
    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  if (itemId) {
    if (loading || item === null) {
      // Still loading
      return <div>Loading...</div>;
    }
    if (item === undefined) {
      return (
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold">Item not found</h1>
          <p className="text-muted-foreground mt-2">The item you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <a href="/browse">Back to Browse</a>
          </Button>
        </div>
      )
    }
    return <ItemDetail item={item} />;
  }

  return <ItemBrowser />;
}
