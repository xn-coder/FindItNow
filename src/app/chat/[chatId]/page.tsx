
"use client";

import { useState, useEffect, useRef, useContext, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import type { Message, Claim, Item } from '@/lib/types';
import { AuthContext } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sendMessage } from '@/lib/actions';
import { Send, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function ChatPage() {
    const { chatId } = useParams();
    const { user, loading: authLoading } = useContext(AuthContext);
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [claim, setClaim] = useState<Claim | null>(null);
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the bottom of the chat container when new messages arrive
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (!chatId || !user) return;

        const fetchClaimAndItem = async () => {
            setLoading(true);
            const claimRef = doc(db, 'claims', chatId as string);
            const claimSnap = await getDoc(claimRef);

            if (claimSnap.exists()) {
                const claimData = claimSnap.data() as Claim;
                 // Security check
                if (user.id !== claimData.itemOwnerId && user.id !== claimData.userId) {
                    // Not authorized to view this chat
                    setClaim(null);
                    setLoading(false);
                    return;
                }
                setClaim(claimData);

                const itemRef = doc(db, 'items', claimData.itemId);
                const itemSnap = await getDoc(itemRef);
                if (itemSnap.exists()) {
                    setItem(itemSnap.data() as Item);
                }

            } else {
                setClaim(null);
            }
             setLoading(false);
        };
        
        fetchClaimAndItem();

        const q = query(collection(db, `chats/${chatId}/messages`), orderBy('createdAt'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            } as Message));
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [chatId, user]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user || !chatId) return;
        
        setIsSending(true);
        try {
            await sendMessage({
                chatId: chatId as string,
                senderId: user.id,
                text: newMessage,
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    if (loading || authLoading) {
         return (
             <div className="h-[70vh] flex flex-col">
                <Skeleton className="h-24 w-full mb-4" />
                <div className="flex-grow space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-12 w-3/4 ml-auto" />
                    <Skeleton className="h-12 w-3/4" />
                </div>
                <Skeleton className="h-12 w-full mt-4" />
            </div>
        );
    }
    
    if (!claim) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('chatNotFoundTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{t('chatNotFoundDesc')}</p>
                </CardContent>
            </Card>
        );
    }

    const otherPartyName = user?.id === claim.itemOwnerId ? claim.fullName : item?.contact;

    return (
        <div className="max-w-4xl mx-auto h-[80vh] flex flex-col">
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>{t('chatTitle')} <Link href={`/browse?item=${claim.itemId}`} className="text-primary hover:underline">{item?.name || 'Item'}</Link></CardTitle>
                    <CardDescription>{t('chattingWith')} {otherPartyName}</CardDescription>
                </CardHeader>
            </Card>
            <Card className="flex-grow flex flex-col">
                 <CardContent ref={scrollContainerRef} className="flex-grow overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                'flex items-end gap-2 max-w-[75%]',
                                message.senderId === user?.id ? 'ml-auto flex-row-reverse' : 'mr-auto'
                            )}
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><User/></AvatarFallback>
                            </Avatar>
                            <div
                                className={cn(
                                    'rounded-lg px-4 py-2',
                                    message.senderId === user?.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                )}
                            >
                                <p className="text-sm">{message.text}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
                <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isSending}
                        />
                        <Button type="submit" disabled={isSending || newMessage.trim() === ''}>
                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
