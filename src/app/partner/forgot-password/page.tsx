
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPartnerByEmail, updatePartnerPassword } from "@/lib/actions";
import { OtpDialog } from "@/components/otp-dialog";
import { useTranslation } from "react-i18next";
import { sendEmail } from "@/lib/email";

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export default function PartnerForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const forgotPasswordSchema = z.object({
    email: z.string().email(t('validation.emailInvalid')),
  });

  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    try {
      const partner = await getPartnerByEmail(values.email);
      if (!partner) {
          throw new Error('No partner found with this email address.');
      }

      const generatedOtp = generateOtp();
      await sendEmail({
          to_email: values.email,
          subject: "Your FindItNow Partner Password Reset Code",
          message: `Your one-time password is: ${generatedOtp}`,
      });
      
      setOtp(generatedOtp);
      setEmail(values.email);
      setIsOtpOpen(true);
      toast({
        title: "Verification Required",
        description: "We've sent a one-time password to your email.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOtpVerification(password?: string) {
    if (!password) {
        toast({
            variant: "destructive",
            title: "Password Required",
            description: "Please enter and confirm a new password.",
        });
        return;
    }
    
    setIsLoading(true);
    try {
        await updatePartnerPassword({ email, password });
        toast({
            title: "Password Reset Successful",
            description: "You can now log in with your new password.",
        });
        setIsOtpOpen(false);
        router.push("/partner/login");

    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Password Reset Failed",
            description: error.message,
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">{t('forgotPasswordTitle')} for Partners</CardTitle>
            <CardDescription>
              {t('forgotPasswordSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contactEmailLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="partner@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('forgotPasswordButton')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <OtpDialog
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onVerify={handleOtpVerification}
        expectedOtp={otp}
        isNewUser={true} // Re-using the logic to show password fields
        isLoading={isLoading}
      />
    </>
  );
}
