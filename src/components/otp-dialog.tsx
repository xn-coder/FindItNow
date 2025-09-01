
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Label } from './ui/label';

type OtpDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (password?: string) => void;
  expectedOtp: string;
  isNewUser: boolean; // True if this dialog needs to collect a new password (e.g. forgot password)
  isLoading: boolean;
};

export function OtpDialog({ isOpen, onClose, onVerify, expectedOtp, isNewUser, isLoading }: OtpDialogProps) {
  const [enteredOtp, setEnteredOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVerify = () => {
    setError(null);
    if (enteredOtp !== expectedOtp) {
      setError('Invalid OTP. Please try again.');
      return;
    }

    if (isNewUser) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }
    // Only pass the password if it's a flow that sets a new one (like forgot password)
    onVerify(isNewUser ? password : undefined);
  };

  const handleClose = () => {
    // Reset state on close
    setEnteredOtp('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
          <DialogDescription>
            {isNewUser
              ? 'Enter the OTP we sent to your email. You will also need to set a new password.'
              : 'Enter the OTP we sent to your email to confirm your identity.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="otp">One-Time Password (OTP)</Label>
            <Input
              id="otp"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
            />
          </div>
          {isNewUser && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Set New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>
            </>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleVerify} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
