export function extractJSON(text: string): any {
  try {
    const start = text.indexOf("{");
    if (start === -1) return null;

    let braceCount = 0;
    let inString = false;
    let escaped = false;

    for (let i = start; i < text.length; i++) {
      const char = text[i];
      if (char === '"' && !escaped) inString = !inString;
      if (!inString) {
        if (char === "{") braceCount++;
        else if (char === "}") braceCount--;
        if (braceCount === 0) {
          const jsonString = text.substring(start, i + 1);

          // ✅ Clean JSON from AI response before parsing
          const cleanedJSON = jsonString
            .replace(/\n/g, "") // Remove new lines
            .replace(/\t/g, "") // Remove tabs
            .replace(/\r/g, "") // Remove carriage returns
            .replace(/,\s*}/g, "}"); // Remove trailing commas before closing brace

          return JSON.parse(cleanedJSON);
        }
      }
      escaped = char === "\\" && !escaped;
    }
  } catch (error: any) {
    console.error("❌ JSON Parsing Error:", error.message);
    console.error("🔍 Raw AI Response:", text);
    return null;
  }
  return null;
}
