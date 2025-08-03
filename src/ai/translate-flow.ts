'use server';

import { genkit, AIMessage, Part } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

// Initialize Genkit and configure the Google AI plugin
genkit({
  plugins: [
    googleAI({
      // Optional, but recommended for production applications
      // apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

// Define the input schema for our translation flow
export const TranslateRequestSchema = z.object({
  text: z.string(),
  targetLanguage: z.string(),
});

// Define the main translation flow
const translateFlow = genkit.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateRequestSchema,
    outputSchema: z.string(),
  },
  async ({ text, targetLanguage }) => {
    const prompt = `Translate the following text to ${targetLanguage}. Do not add any extra text, comments, or quotation marks. Just provide the raw translated text. Text to translate: "${text}"`;

    const llmResponse = await genkit.generate({
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
export async function translateText(input: z.infer<typeof TranslateRequestSchema>): Promise<string> {
    try {
        return await translateFlow(input);
    } catch(e) {
        console.error("Translation failed", e);
        // Fallback to original text if translation fails
        return input.text;
    }
}
