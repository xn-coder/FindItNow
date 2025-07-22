"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { matchItems, type MatchItemsOutput } from "@/ai/flows/match-items";
import { Loader2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  lostItemDescription: z.string().min(10, "Please provide a more detailed description."),
  locationLastSeen: z.string().min(3, "Please provide a location."),
});

export default function SmartMatchesPage() {
  const [matches, setMatches] = useState<MatchItemsOutput>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lostItemDescription: "",
      locationLastSeen: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMatches([]);
    try {
      const result = await matchItems(values);
      if (result && result.length > 0) {
        setMatches(result);
        toast({
          title: "Matches Found!",
          description: `We found ${result.length} potential match(es) for your item.`,
        });
      } else {
        toast({
          title: "No Matches Found",
          description: "We couldn't find any close matches. You can still browse all items.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error finding matches:", error);
      toast({
        title: "An Error Occurred",
        description: "Something went wrong while searching for matches. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-primary" />
            AI Smart Matches
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Let our AI help you find your lost item by matching it against our database of found items.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Describe Your Lost Item</CardTitle>
          <CardDescription>
            Provide a detailed description, including any unique or distinguishing marks, and where you last saw it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="lostItemDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lost Item Description & Distinguishing Marks</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., A blue Hydro Flask with a Yosemite sticker and a small dent near the bottom." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationLastSeen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Last Seen</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Grand Central Terminal, near track 23" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Find Matches
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && <p className="text-center text-muted-foreground">AI is thinking...</p>}

      {matches.length > 0 && (
        <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center font-headline">Potential Matches</h2>
            {matches.sort((a,b) => b.matchScore - a.matchScore).map((match, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>Found Item Match</CardTitle>
                        <div className="flex items-center gap-2 pt-2">
                           <Progress value={match.matchScore * 100} className="w-1/2" />
                           <span className="text-sm font-medium text-primary">{Math.round(match.matchScore * 100)}% Match</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold">Description:</p>
                        <p className="text-muted-foreground">{match.foundItemDescription}</p>
                        <p className="font-semibold mt-4">Location Found:</p>
                        <p className="text-muted-foreground">{match.locationFound}</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline">This might be it!</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
