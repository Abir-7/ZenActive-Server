import OpenAI from "openai";
import { config } from "../config";

const OPENAI_API_KEY = config.ai.openai_api_key as string;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function getOpenAIResponse(
  prompt: string,
  systemInstruction?: string,
  isJsonResponse: boolean = false
): Promise<any> {
  const messages: any[] = [];

  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }

  messages.push({ role: "user", content: prompt });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      response_format: isJsonResponse ? { type: "json_object" } : undefined,
    });

    const responseText = response.choices[0].message.content;

    if (isJsonResponse && responseText) {
      try {
        return JSON.parse(responseText);
      } catch (error) {
        throw new Error(`Failed to parse OpenAI JSON response: ${responseText}`);
      }
    }

    return responseText ?? null;
  } catch (error: any) {
    console.error("❌ OpenAI API Error:", error.message || error);
    throw new Error(`OpenAI Error: ${error.message || "Unknown error"}`);
  }
}
