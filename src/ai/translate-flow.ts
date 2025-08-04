
'use server';

import { genkit, AIMessage, Message } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [
    googleAI({
      // apiKey: process.env.GEMINI_API_KEY, // The API key is set in the environment
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

// In-memory cache for translations
const translationCache = new Map<string, string>();

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
    
    // Simple check to avoid translating if the language is English or text is empty
    if (targetLanguage.toLowerCase().startsWith('en') || !text) {
        return text;
    }

    const cacheKey = `${targetLanguage}:${text}`;
    if (translationCache.has(cacheKey)) {
        console.log(`Cache hit for: ${cacheKey}`);
        return translationCache.get(cacheKey) as string;
    }
     console.log(`Cache miss for: ${cacheKey}`);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Skipping real translation.");
      return text; // Return original text if API key is missing
    }

    try {
        const { output } = await translatePrompt({ text, targetLanguage });
        const translatedText = output as string;

        // Store the result in the cache
        translationCache.set(cacheKey, translatedText);

        return translatedText;

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
