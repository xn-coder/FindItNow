
"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Message } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';

type AdminChatViewerProps = {
  chatId: string;
};

export function AdminChatViewer({ chatId }: AdminChatViewerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, `chats/${chatId}/messages`), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Message));
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
        console.error(`Failed to fetch messages for chat ${chatId}:`, error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const participantIds = useMemo(() => {
    const ids = new Set<string>();
    messages.forEach(msg => {
        if (msg.senderId !== 'system') {
            ids.add(msg.senderId);
        }
    });
    return Array.from(ids);
  }, [messages]);


  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-12 w-3/4 ml-auto" />
        <Skeleton className="h-12 w-3/4" />
      </div>
    );
  }

  if (messages.length === 0) {
      return (
          <div className="text-center text-muted-foreground p-8">
              No chat history found for this claim.
          </div>
      )
  }

  return (
    <Card className="flex-1 flex flex-col max-h-[60vh]">
      <CardContent ref={scrollContainerRef} className="flex-1 p-6 space-y-4 overflow-y-auto">
        {messages.map((message) => {
           if (message.senderId === 'system') {
            return (
              <div key={message.id} className="text-center text-xs text-muted-foreground italic my-4">
                - {message.text} -
              </div>
            )
           }
           const isFirstParticipant = message.senderId === participantIds[0];
           return (
              <div
                key={message.id}
                className={cn(
                  'flex items-end gap-2 max-w-[75%]',
                   isFirstParticipant ? 'mr-auto' : 'ml-auto flex-row-reverse'
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback><User/></AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'rounded-lg px-4 py-2',
                    !isFirstParticipant
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.senderId.substring(0, 6)}...
                  </p>
                </div>
              </div>
          )}
        )}
      </CardContent>
    </Card>
  );
}
