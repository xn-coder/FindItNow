
'use server';

/**
 * @fileOverview An AI-powered text translation flow.
 *
 * - translateText - A function that handles the text translation process.
 */
import { genkit, AIMessage } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

const ai = genkit({
  plugins: [
    googleAI({
      // Optional, but recommended for production applications
      // apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});


// Define the input schema for our translation flow
const TranslateRequestSchema = z.object({
  text: z.string(),
  targetLanguage: z.string(),
});
type TranslateRequest = z.infer<typeof TranslateRequestSchema>;

// Define the main translation flow
const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateRequestSchema,
    outputSchema: z.string(),
  },
  async ({ text, targetLanguage }) => {
    const prompt = `Translate the following text to ${targetLanguage}. Do not add any extra text, comments, or quotation marks. Just provide the raw translated text. Text to translate: "${text}"`;

    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: prompt,
      config: {
        temperature: 0.3,
      },
    });

    return llmResponse.text();
  }
);

// Define an exported wrapper function to be used in client components
export async function translateText(input: TranslateRequest): Promise<string> {
    try {
        // Validate input at the edge
        const validatedInput = TranslateRequestSchema.parse(input);
        return await translateFlow(validatedInput);
    } catch(e) {
        console.error("Translation failed", e);
        // Fallback to original text if translation fails
        return input.text;
    }
}
