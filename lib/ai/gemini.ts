import { GoogleGenAI } from "@google/genai";

/**
 * Gemini AI Client initialization.
 * Reads GEMINI_API_KEY from environment variables.
 */
const apiKey = process.env.GEMINI_API_KEY || "";

export const geminiClient = new GoogleGenAI({
  apiKey: apiKey,
});

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

/**
 * Helper to ensure API key is present before invoking AI features.
 */
export function validateGeminiConfig(): boolean {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
    return false;
  }
  return true;
}

