
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Item } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useTranslation } from 'react-i18next';
import { AuthContext } from '@/context/auth-context';
import { useContext } from 'react';

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

type ClaimFormProps = {
  item: Item;
  onSuccess: () => void;
};

export function ClaimForm({ item, onSuccess }: ClaimFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const claimFormSchema = z.object({
    fullName: z.string().min(2, t('validation.nameRequired')),
    email: z.string().email(t('validation.emailInvalid')),
    phoneNumber: z.string().regex(phoneRegex, t('validation.phoneInvalid')).optional().or(z.literal('')),
    proof: z.string().min(20, t('validation.proofMin')),
  });

  const form = useForm<z.infer<typeof claimFormSchema>>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      fullName: '',
      email: user?.email || '',
      phoneNumber: '',
      proof: '',
    },
  });

  async function onSubmit(values: z.infer<typeof claimFormSchema>) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication required",
            description: "You must be logged in to submit a claim.",
        });
        return;
    }
    setIsLoading(true);
    
    try {
        const claimRef = await addDoc(collection(db, "claims"), {
            itemId: item.id,
            itemOwnerId: item.userId,
            userId: user.id, // ID of the person making the claim
            fullName: values.fullName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            proof: values.proof,
            submittedAt: serverTimestamp(),
            status: 'open',
            type: 'claim',
            chatId: '', // Will be updated when claim is accepted
        });

        // The chatId will be the same as the claimId for simplicity
        await addDoc(collection(db, `chats/${claimRef.id}/messages`), {});

        toast({
            title: 'Claim Submitted!',
            description: "We've received your claim and the item reporter has been notified. They will contact you if your claim is verified.",
        });
        form.reset();
        onSuccess();

    } catch (error) {
         console.error("Error submitting claim: ", error);
         toast({
            variant: "destructive",
            title: 'Submission Failed',
            description: "There was an error submitting your claim. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('claimFormFullName')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('claimFormFullNamePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('claimFormContactEmail')}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t('claimFormContactEmailPlaceholder')} {...field} disabled={!!user} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('claimFormContactPhone')}</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder={t('claimFormContactPhonePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="proof"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('claimFormProof')}</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder={t('claimFormProofPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading || !user}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {user ? t('claimFormSubmitButton') : t('loginToClaim')}
        </Button>
      </form>
    </Form>
  );
}
