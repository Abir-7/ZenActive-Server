import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyCP7WPliATqWAZnEBCgGS6Xm7XVWteSShM";

export async function getGeminiResponse(messages: string): Promise<any> {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(messages);

  return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}
