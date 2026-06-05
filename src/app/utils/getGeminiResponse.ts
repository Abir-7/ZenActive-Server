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

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (isJsonResponse && responseText) {
      try {
        return JSON.parse(responseText);
      } catch (error) {
        throw new Error(`Failed to parse Gemini JSON response: ${responseText}`);
      }
    }

    return responseText ?? null;
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error.message || error);
    
    // Check for rate limit error (429)
    if (error.message && error.message.includes("429")) {
      throw new Error("Our AI assistant is currently at maximum capacity. Please wait a moment and try again, or create your workout plan manually.");
    }
    
    throw new Error(`Gemini Error: ${error.message || "Unknown error"}`);
  }
}
