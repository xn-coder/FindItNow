'use server';
/**
 * @fileOverview This file defines a Genkit flow for matching lost and found items.
 *
 * - matchItems - A function that takes a lost item description and location and returns a list of potentially matching found items.
 * - MatchItemsInput - The input type for the matchItems function.
 * - MatchItemsOutput - The output type for the matchItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchItemsInputSchema = z.object({
  lostItemDescription: z.string().describe('Description of the lost item, including distinguishing marks.'),
  locationLastSeen: z.string().describe('The location where the item was last seen.'),
});
export type MatchItemsInput = z.infer<typeof MatchItemsInputSchema>;

const MatchedItemSchema = z.object({
  foundItemDescription: z.string().describe('Description of the found item, including distinguishing marks.'),
  locationFound: z.string().describe('The location where the item was found.'),
  matchScore: z.number().describe('A score indicating the strength of the match (0-1).'),
});

const MatchItemsOutputSchema = z.array(MatchedItemSchema).describe('A list of potentially matching found items.');
export type MatchItemsOutput = z.infer<typeof MatchItemsOutputSchema>;

export async function matchItems(input: MatchItemsInput): Promise<MatchItemsOutput> {
  return matchItemsFlow(input);
}

const matchItemsPrompt = ai.definePrompt({
  name: 'matchItemsPrompt',
  input: {schema: MatchItemsInputSchema},
  output: {schema: MatchItemsOutputSchema},
  prompt: `You are an AI assistant helping to match lost items with found items.

  Given the following description and location of a lost item, identify potentially matching found items. Return a list of found items with a match score between 0 and 1, where 1 is a perfect match.

  Lost Item Description: {{{lostItemDescription}}}
  Location Last Seen: {{{locationLastSeen}}}

  Consider the descriptions and locations of the found items when determining the match score. Focus on matching distinguishing marks.

  Output the results as a JSON array of objects, where each object represents a potential match with the following keys:

  - foundItemDescription: Description of the found item.
  - locationFound: The location where the item was found.
  - matchScore: A score indicating the strength of the match (0-1).
  `,
});

const matchItemsFlow = ai.defineFlow(
  {
    name: 'matchItemsFlow',
    inputSchema: MatchItemsInputSchema,
    outputSchema: MatchItemsOutputSchema,
  },
  async input => {
    const {output} = await matchItemsPrompt(input);
    return output!;
  }
);

