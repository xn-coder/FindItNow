
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { getAllClaims, updateClaimStatus } from "@/lib/actions";
import type { Claim } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ThumbsUp, ThumbsDown, MessageSquare, Eye, Loader2, User, Mail, Package, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function ClaimManagementPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const fetchedClaims = await getAllClaims();
      setClaims(fetchedClaims);
    } catch (error) {
      console.error("Failed to fetch claims:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not fetch claims." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            (claim.itemName && claim.itemName.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (claim.fullName && claim.fullName.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (claim.email && claim.email.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (claim.status && claim.status.toLowerCase().includes(lowerCaseSearchTerm))
        );
    });
  }, [claims, searchTerm]);

  const handleStatusUpdate = (claimId: string, status: 'accepted' | 'rejected' | 'resolved') => {
    startTransition(async () => {
      try {
        await updateClaimStatus(claimId, status);
        toast({ title: "Claim Updated", description: `The claim has been marked as ${status}.` });
        await fetchClaims();
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to update the claim." });
      }
    });
  };

  const getStatusVariant = (status: Claim['status']) => {
    switch (status) {
        case 'open': return 'default';
        case 'accepted': return 'secondary';
        case 'resolving': return 'outline';
        case 'resolved': return 'secondary';
        case 'rejected': return 'destructive';
        default: return 'outline';
    }
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Claims & Verification</CardTitle>
          <CardDescription>View, manage, and verify all claims submitted on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by item, claimant, email, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length: 6}).map((_, i) => (
                <Card key={i}><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
            ))}
        </div>
      ) : filteredClaims.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClaims.map((claim) => (
            <Card key={claim.id} className="flex flex-col">
              <CardHeader>
                 <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{claim.itemName}</CardTitle>
                        <CardDescription>Claim ID: #{claim.id.substring(0, 6)}</CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(claim.status)} className="capitalize">{claim.status}</Badge>
                 </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <Separator />
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3"><User className="h-4 w-4 text-muted-foreground"/><span>{claim.fullName}</span></div>
                    <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground"/><span>{claim.email}</span></div>
                    <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground"/><span>{new Date(claim.submittedAt as Date).toLocaleString()}</span></div>
                     <div className="flex items-center gap-3"><Package className="h-4 w-4 text-muted-foreground"/>
                        <Link href={`/browse?item=${claim.itemId}`} className="text-primary hover:underline">View Item</Link>
                     </div>
                </div>
                <Separator />
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full"><Eye className="mr-2 h-4 w-4" />View Proof</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Proof of Ownership</DialogTitle>
                            <DialogDescription>Submitted by {claim.fullName}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                            <p className="text-sm text-muted-foreground bg-slate-50 p-3 rounded-md mt-1 border">{claim.proof}</p>
                            {claim.proofImageUrl && (
                                <div>
                                    <p className="font-semibold mb-2">Attached Image:</p>
                                    <div className="relative aspect-video w-full">
                                        <Image src={claim.proofImageUrl} alt="Proof Image" layout="fill" objectFit="contain" className="rounded-md border"/>
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
              </CardContent>
              <CardFooter className="bg-muted/50 p-2 flex gap-2">
                <Button asChild size="sm" variant="secondary" className="flex-1">
                  <Link href={`/chat/${claim.chatId}`} target="_blank"><MessageSquare className="mr-2 h-4 w-4"/>Chat</Link>
                </Button>
                {claim.status === 'open' && (
                  <>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleStatusUpdate(claim.id, 'accepted')} disabled={isPending}>
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <ThumbsUp className="mr-2 h-4 w-4"/>} Accept
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleStatusUpdate(claim.id, 'rejected')} disabled={isPending}>
                       {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <ThumbsDown className="mr-2 h-4 w-4"/>} Reject
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="p-10 text-center">
                 <p>No claims found matching your criteria.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
