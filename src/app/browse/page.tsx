
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ItemCard } from '@/components/item-card';
import { ItemDetail } from '@/components/item-detail';
import type { Item, Category } from '@/lib/types';
import { ListFilter, Search } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';
import { translateText } from '@/ai/translate-flow';
import { getItemCategories } from '@/lib/actions';


function ItemBrowser() {
  const [items, setItems] = useState<Item[]>([]);
  const [itemCategories, setItemCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [itemType, setItemType] = useState('all');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchCategories = async () => {
        const categories = await getItemCategories();
        setItemCategories(categories);
    };
    fetchCategories();
  }, []);

  const fetchAndTranslateItems = async (language: string) => {
    setLoading(true);
    const q = query(
      collection(db, "items"),
      where("status", "==", "open"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const itemsData = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
      return { id: doc.id, ...data, date, createdAt } as Item;
    });

    if (language !== 'en') {
        const translatedItems = await Promise.all(
            itemsData.map(async (item) => {
                const [translatedName, translatedDescription] = await Promise.all([
                    translateText(item.name, language),
                    translateText(item.description, language)
                ]);
                return { ...item, name: translatedName, description: translatedDescription };
            })
        );
        setItems(translatedItems);
    } else {
        setItems(itemsData);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchAndTranslateItems(i18n.language);
  }, [i18n.language]);


  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const lowerSearchTerm = searchTerm.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.description.toLowerCase().includes(lowerSearchTerm) ||
        item.location.toLowerCase().includes(lowerSearchTerm);
      
      const matchesCategory = category === 'all' || item.category === category;
      const matchesType = itemType === 'all' || item.type === itemType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [items, searchTerm, category, itemType]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">{t('browseTitle')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('browseSubtitle')}
        </p>
      </div>

      <div className="bg-card p-4 rounded-lg shadow-sm border space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            type="search"
            placeholder={t('browseSearchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
            />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-4">
            <Select value={itemType} onValueChange={setItemType}>
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('itemtype')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{t('alltypes')}</SelectItem>
                <SelectItem value="lost">{t('lost')}</SelectItem>
                <SelectItem value="found">{t('found')}</SelectItem>
            </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('category')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{t('allcategories')}</SelectItem>
                {itemCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                    {t(cat.name as any)}
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
            <ItemCard 
              key={item.id} 
              item={item}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg">
          <p className="text-xl font-medium">{t('browseNoItems')}</p>
          <p className="text-muted-foreground mt-2">{t('browseNoItemsDesc')}</p>
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
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchAndTranslateItem = async () => {
      if (itemId) {
        setLoading(true);
        const docRef = doc(db, "items", itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
          let fetchedItem = { id: docSnap.id, ...data, date } as Item;
          
          if (i18n.language !== 'en') {
             const [translatedName, translatedDescription, translatedLocation] = await Promise.all([
                translateText(fetchedItem.name, i18n.language),
                translateText(fetchedItem.description, i18n.language),
                translateText(fetchedItem.location, i18n.language)
            ]);
            fetchedItem = { ...fetchedItem, name: translatedName, description: translatedDescription, location: translatedLocation };
          }
          setItem(fetchedItem);

        } else {
          setItem(undefined); // Not found
        }
        setLoading(false);
      }
    };
    if (itemId) {
        fetchAndTranslateItem();
    }
  }, [itemId, i18n.language]);

  if (itemId) {
    if (loading || item === null) {
      // Still loading
      return <div>{t('loading')}</div>;
    }
    if (item === undefined) {
      return (
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold">{t('browseItemNotFound')}</h1>
          <p className="text-muted-foreground mt-2">{t('browseItemNotFoundDesc')}</p>
          <Button asChild className="mt-4">
            <a href="/browse">{t('browseBackButton')}</a>
          </Button>
        </div>
      )
    }
    
    return <ItemDetail item={item} />;
  }

  return <ItemBrowser />;
}
