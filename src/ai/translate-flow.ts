
'use server';

/**
 * @fileOverview An AI-powered text translation flow.
 * - translateText - A function that handles the text translation process.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

// Initialize Genkit with the Google AI plugin.
// The GEMINI_API_KEY environment variable is used automatically.
const ai = genkit({
  plugins: [
    googleAI(),
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
    // Construct a clear prompt for the LLM
    const prompt = `Translate the following text to ${targetLanguage}. Do not add any extra text, comments, or quotation marks. Just provide the raw translated text. Text to translate: "${text}"`;

    // Call the LLM to generate the translation
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: prompt,
      config: {
        temperature: 0.3, // Lower temperature for more predictable, direct translations
      },
    });

    // Return the translated text
    return llmResponse.text;
  }
);

// Define an exported wrapper function to be used in client components
export async function translateText(input: TranslateRequest): Promise<string> {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
            console.warn("Translation skipped: GEMINI_API_KEY is not configured.");
            return input.text;
        }
        // Validate input at the edge for type safety
        const validatedInput = TranslateRequestSchema.parse(input);
        // Execute the flow and return the result
        return await translateFlow(validatedInput);
    } catch(e) {
        console.error("Translation failed", e);
        // Fallback to original text if translation fails to prevent crashes
        return input.text;
    }
}
