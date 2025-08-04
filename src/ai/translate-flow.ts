
'use server';

import { z } from 'zod';

const TranslationInputSchema = z.object({
  text: z.string(),
  targetLanguage: z.string(),
});

// In-memory cache for translations
const translationCache = new Map<string, string>();


export async function translateText(text: string, targetLanguage: string): Promise<string> {
    const validatedInput = TranslationInputSchema.parse({ text, targetLanguage });
    const { text: inputText, targetLanguage: lang } = validatedInput;

    // Simple check to avoid translating if the language is English or text is empty
    if (lang.toLowerCase().startsWith('en') || !inputText) {
        return inputText;
    }

    const cacheKey = `${lang}:${inputText}`;
    if (translationCache.has(cacheKey)) {
        console.log(`MyMemory Cache hit for: ${cacheKey}`);
        return translationCache.get(cacheKey) as string;
    }
    console.log(`MyMemory Cache miss for: ${cacheKey}`);

    try {
        const langPair = `en|${lang}`;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${langPair}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`MyMemory API request failed with status ${response.status}`);
        }
        
        const data = await response.json();

        if (data.responseStatus !== 200) {
            console.error(`MyMemory API Error: ${data.responseDetails}`);
            return inputText; // Fallback to original text
        }

        const translatedText = data.responseData.translatedText;
        
        // Post-process to remove any extra quotes if the API adds them
        const cleanedText = translatedText.replace(/^"|"$/g, '');

        // Store the result in the cache
        translationCache.set(cacheKey, cleanedText);

        return cleanedText;

    } catch (error) {
        console.error(`Translation failed for text: "${inputText}"`, error);
        // Fallback to original text in case of an error
        return inputText;
    }
}
