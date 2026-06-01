import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { config } from "../config";

const GEMINI_API_KEY = config.ai.gemini_api_key as string;

export async function getGeminiResponse(
  prompt: string,
  systemInstruction?: string,
  isJsonResponse: boolean = false
): Promise<any> {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  
  const modelOptions: any = {
    model: "gemini-2.0-flash",
  };

  if (systemInstruction) {
    modelOptions.systemInstruction = systemInstruction;
  }

  const model = genAI.getGenerativeModel(modelOptions);

  const generationConfig: any = {};
  if (isJsonResponse) {
    generationConfig.responseMimeType = "application/json";
  }

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
  });

  const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (isJsonResponse && responseText) {
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Failed to parse Gemini JSON response:", error);
      return responseText;
    }
  }

  return responseText ?? null;
}
