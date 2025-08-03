
'use client';

import { useState, useMemo, useEffect, useContext } from 'react';
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
import { LanguageContext } from '@/context/language-context';
import { translateText } from '@/ai/translate-flow';


function ItemBrowser() {
  const [items, setItems] = useState<Item[]>([]);
  const [translatedItems, setTranslatedItems] = useState<Record<string, Partial<Item>>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [itemType, setItemType] = useState('all');
  const { t, language } = useContext(LanguageContext);

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

  useEffect(() => {
    async function translateItems() {
      if (language === 'en' || items.length === 0) {
        setTranslatedItems({});
        return;
      }
      
      const newTranslations: Record<string, Partial<Item>> = {};
      for (const item of items) {
        try {
          const [translatedName, translatedDescription] = await Promise.all([
            translateText({ text: item.name, targetLanguage: language }),
            translateText({ text: item.description, targetLanguage: language }),
          ]);
          newTranslations[item.id] = { name: translatedName, description: translatedDescription };
        } catch (error) {
          console.error(`Could not translate item ${item.id}:`, error);
          newTranslations[item.id] = { name: item.name, description: item.description }; // Fallback
        }
      }
      setTranslatedItems(newTranslations);
    }
    translateItems();
  }, [items, language]);


  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const originalName = item.name.toLowerCase();
      const originalDescription = item.description.toLowerCase();
      const translatedName = translatedItems[item.id]?.name?.toLowerCase() || '';
      const translatedDescription = translatedItems[item.id]?.description?.toLowerCase() || '';
      const lowerSearchTerm = searchTerm.toLowerCase();

      const matchesSearch =
        originalName.includes(lowerSearchTerm) ||
        originalDescription.includes(lowerSearchTerm) ||
        (translatedName && translatedName.includes(lowerSearchTerm)) ||
        (translatedDescription && translatedDescription.includes(lowerSearchTerm)) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = category === 'all' || item.category === category;
      const matchesType = itemType === 'all' || item.type === itemType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [items, translatedItems, searchTerm, category, itemType]);

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
                <SelectItem key={cat} value={cat}>
                    {t(cat as any)}
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
              item={{
                ...item,
                name: translatedItems[item.id]?.name || item.name,
                description: translatedItems[item.id]?.description || item.description,
              }}
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
  const [translatedItem, setTranslatedItem] = useState<Partial<Item> | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useContext(LanguageContext);

  useEffect(() => {
    const fetchItem = async () => {
      if (itemId) {
        setLoading(true);
        const docRef = doc(db, "items", itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
          const fetchedItem = { id: docSnap.id, ...data, date } as Item;
          setItem(fetchedItem);
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

  useEffect(() => {
    async function translateItem() {
      if (item && language !== 'en') {
        try {
          const [translatedName, translatedDescription] = await Promise.all([
            translateText({ text: item.name, targetLanguage: language }),
            translateText({ text: item.description, targetLanguage: language }),
          ]);
          setTranslatedItem({ name: translatedName, description: translatedDescription });
        } catch (error) {
          console.error(`Could not translate item ${item.id}:`, error);
          setTranslatedItem({ name: item.name, description: item.description }); // Fallback
        }
      } else {
        setTranslatedItem(null); // Clear translation for English or if no item
      }
    }
    translateItem();
  }, [item, language]);

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
    
    const displayItem = {
      ...item,
      name: translatedItem?.name || item.name,
      description: translatedItem?.description || item.description,
    };

    return <ItemDetail item={displayItem} />;
  }

  return <ItemBrowser />;
}
