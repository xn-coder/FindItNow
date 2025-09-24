
"use client";

import { ReportForm } from '@/components/report-form';
import { db } from '@/lib/firebase';
import type { Item } from '@/lib/types';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function EditItemPage() {
    const { id } = useParams();
    const { user, loading: authLoading } = useContext(AuthContext);
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || authLoading) return;
        if (!user) {
            setError("You must be logged in to edit an item.");
            setLoading(false);
            return;
        }

        const fetchItem = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'items', id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    if (!user.isAdmin && data.userId !== user.id) {
                         setError("You are not authorized to edit this item.");
                         setLoading(false);
                         return;
                    }

                    setItem({ 
                        id: docSnap.id, 
                        ...data,
                        date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date)
                    } as Item);
                } else {
                    setError("Item not found.");
                }
            } catch (err) {
                console.error("Error fetching item:", err);
                setError("Failed to fetch item data.");
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id, user, authLoading]);

    if (loading || authLoading) {
        return (
             <div className="max-w-3xl mx-auto space-y-8">
                <Skeleton className="h-24 w-full" />
                <div className="space-y-6 p-8">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-24 w-full" />
                     <Skeleton className="h-12 w-1/3" />
                </div>
            </div>
        )
    }

     if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <Alert variant="destructive" className="max-w-lg">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!item) {
        return null; // or some other placeholder
    }

    return (
        <div>
            <ReportForm itemType={item.type} existingItem={item} />
        </div>
    );
}
