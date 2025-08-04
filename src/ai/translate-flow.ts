
'use server';

import { genkit, AIMessage, Message } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [
    googleAI({
      // apiKey: process.env.GEMINI_API_KEY, // Uncomment if you have the key in .env
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

const TranslationInputSchema = z.object({
  text: z.string(),
  targetLanguage: z.string(),
});

const TranslationOutputSchema = z.string();


const translatePrompt = ai.definePrompt({
    name: 'translatePrompt',
    input: { schema: TranslationInputSchema },
    output: { format: 'text' },
    prompt: async ({ text, targetLanguage }) => {
        return {
            role: 'user',
            content: [{ text: `Translate the following text to ${targetLanguage}: "${text}"\n\nReturn only the translated text, without any introductory phrases or quotation marks.` }],
        };
    },
});


const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslationInputSchema,
    outputSchema: TranslationOutputSchema,
  },
  async ({ text, targetLanguage }) => {
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Skipping translation.");
      return text; // Return original text if API key is missing
    }
    
    // Simple check to avoid translating if the language is English
    if (targetLanguage.toLowerCase().startsWith('en')) {
        return text;
    }
    if (!text) {
        return "";
    }

    try {
        const { output } = await translatePrompt({ text, targetLanguage });
        return output as string;

    } catch (error) {
        console.error(`Translation failed for text: "${text}"`, error);
        // Fallback to original text in case of an error
        return text;
    }
  }
);

export async function translateText(text: string, targetLanguage: string): Promise<string> {
    return translateFlow({ text, targetLanguage });
}
