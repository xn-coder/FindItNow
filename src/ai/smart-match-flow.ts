
'use server';

/**
 * @fileOverview An AI-powered flow to find potential matches for lost items.
 * - suggestMatches - A function that suggests potential matches for a lost item.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import type { Item } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

// Initialize Genkit with the Google AI plugin.
// The GEMINI_API_KEY environment variable is used automatically.
const ai = genkit({
  plugins: [
    googleAI(),
  ],
});


const MatchRequestSchema = z.object({
    lostItem: z.any(), // Using z.any() for the complex Item type
});

const MatchResponseSchema = z.array(z.string()).describe("An array of IDs of the found items that are potential matches.");

const suggestMatchesFlow = ai.defineFlow(
    {
        name: 'suggestMatchesFlow',
        inputSchema: MatchRequestSchema,
        outputSchema: MatchResponseSchema,
    },
    async ({ lostItem }) => {
        // 1. Fetch all 'found' items from Firestore
        const foundItemsQuery = query(collection(db, "items"), where("type", "==", "found"));
        const querySnapshot = await getDocs(foundItemsQuery);
        const foundItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));

        // 2. Construct the prompt for the LLM
        const prompt = `
            You are a smart matching assistant for a lost and found application.
            Your task is to compare a "lost item" report against a list of "found item" reports and identify the most likely matches.
            Focus on key details like category, color, brand, and especially any unique distinguishing marks. Location and date are also important but can have some flexibility.

            Here is the Lost Item:
            - Name: ${lostItem.name}
            - Category: ${lostItem.category}
            - Description: ${lostItem.description}
            - Distinguishing Marks: ${lostItem.distinguishingMarks || 'None'}
            - Location Last Seen: ${lostItem.location}
            - Date Lost: ${lostItem.date.toDateString()}

            Here is the list of Found Items:
            ${foundItems.map(item => `
                ---
                ID: ${item.id}
                Name: ${item.name}
                Category: ${item.category}
                Description: ${item.description}
                Distinguishing Marks: ${item.distinguishingMarks || 'None'}
                Location Found: ${item.location}
                Date Found: ${(item.date as Timestamp).toDate().toDateString()}
            `).join('\n')}

            Based on the information provided, please return a JSON array containing only the string IDs of the found items that are the most probable matches for the lost item.
            Do not include items that are poor matches. If there are no good matches, return an empty array.
            Your response must be a valid JSON array of strings. Do not include any other text or explanation.
        `;

        // 3. Call the LLM
        const llmResponse = await ai.generate({
            model: 'googleai/gemini-1.5-flash-latest',
            prompt: prompt,
            config: {
                temperature: 0.2,
            },
        });
        
        try {
            // 4. Parse the response and return
            const responseText = llmResponse.text.replace(/```json/g, '').replace(/```/g, '').trim();
            const matchedIds = JSON.parse(responseText);
            return MatchResponseSchema.parse(matchedIds);
        } catch (error) {
            console.error("Failed to parse LLM response for matches:", error);
            return []; // Return empty array on parsing failure
        }
    }
);


export async function suggestMatches(lostItem: Item): Promise<string[]> {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
        console.warn("Smart matching skipped: GEMINI_API_KEY is not configured.");
        return [];
    }
    return await suggestMatchesFlow({ lostItem });
}
