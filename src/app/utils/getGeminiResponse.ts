import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

const GEMINI_API_KEY = config.ai.gemini_api_key as string;

export async function getGeminiResponse(messages: string): Promise<any> {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const result = await model.generateContent(messages);

  return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}
