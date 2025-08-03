
"use client";

import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { StarIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { Claim, Item } from '@/lib/types';
import type { AuthUser } from '@/context/auth-context';
import { submitFeedback } from '@/lib/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { LanguageContext } from '@/context/language-context';

const feedbackSchema = z.object({
  rating: z.number().min(1, 'Please select a rating.').max(5),
  story: z.string().min(10, 'Please share a bit more about your experience.').max(500),
});

type FeedbackDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  claim: Claim;
  item: Item;
  user: AuthUser;
};

export function FeedbackDialog({ isOpen, onClose, claim, item, user }: FeedbackDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useContext(LanguageContext);
  
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      story: t('feedbackDefaultStory').replace('{itemName}', item.name),
    },
  });

  const { watch, setValue } = form;
  const rating = watch('rating');

  async function onSubmit(values: z.infer<typeof feedbackSchema>) {
    setIsLoading(true);
    try {
      // The person giving feedback is the one who made the claim/message.
      // If the reporter is a partner, the claimant is the user.
      // If the reporter is a user, the claimant might be the finder.
      // We should attribute the feedback to the person who *got the item back*.
      const personWhoLostItem = item.type === 'lost' ? user : { id: claim.userId || '', email: claim.email, isPartner: false, businessName: '' };
      const personWhoFoundItem = item.type === 'found' ? user : { id: claim.userId || '', email: claim.email, isPartner: false, businessName: '' };

      const feedbackData = {
        ...values,
        userId: personWhoLostItem.id, // The user who lost the item
        userName: item.type === 'lost' ? (user.isPartner ? user.businessName : user.email) : claim.fullName,
        itemName: item.name,
        finderId: personWhoFoundItem.id,
        finderName: item.type ==='found' ? (user.isPartner ? user.businessName : user.email) : claim.fullName,
        itemId: item.id,
      };

      await submitFeedback(feedbackData);
      
      toast({
        title: 'Thank you for your feedback!',
        description: 'Your story will help inspire others.',
      });
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not submit your feedback. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Success! How was your experience?</DialogTitle>
          <DialogDescription>
            You've marked the enquiry for "{item.name}" as resolved. Please take a moment to share your feedback.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                   <FormControl>
                      <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                              <StarIcon
                                  key={i}
                                  className={cn(
                                      'h-8 w-8 cursor-pointer',
                                      i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                  )}
                                  onClick={() => setValue('rating', i + 1, { shouldValidate: true })}
                              />
                          ))}
                      </div>
                   </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="story"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Success Story</FormLabel>
                   <FormControl>
                      <Textarea
                          rows={4}
                          placeholder="Tell us how you were reunited with your item..."
                          {...field}
                      />
                   </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Skip
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Feedback
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
