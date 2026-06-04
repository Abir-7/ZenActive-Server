import { config } from "../config";
import { getGeminiResponse } from "./getGeminiResponse";
import { getOpenAIResponse } from "./getOpenAIResponse";

export async function getAIResponse(
  prompt: string,
  systemInstruction?: string,
  isJsonResponse: boolean = false
): Promise<any> {
  const provider = config.ai.provider;

  if (provider === "openai") {
    if (!config.ai.openai_api_key) {
      throw new Error("OpenAI API Key is missing in configuration.");
    }
    return getOpenAIResponse(prompt, systemInstruction, isJsonResponse);
  } else {
    // Default to Gemini
    if (!config.ai.gemini_api_key) {
      throw new Error("Gemini API Key is missing in configuration.");
    }
    return getGeminiResponse(prompt, systemInstruction, isJsonResponse);
  }
}
