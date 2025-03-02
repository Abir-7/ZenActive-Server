"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJson = getJson;
function getJson(text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const start = text.indexOf("{");
            if (start === -1)
                return null;
            let braceCount = 0;
            let inString = false;
            let escaped = false;
            for (let i = start; i < text.length; i++) {
                const char = text[i];
                if (char === '"' && !escaped)
                    inString = !inString;
                if (!inString) {
                    if (char === "{")
                        braceCount++;
                    else if (char === "}")
                        braceCount--;
                    if (braceCount === 0) {
                        const jsonString = text.substring(start, i + 1);
                        // ✅ Clean JSON from AI response before parsing
                        const cleanedJSON = jsonString
                            .replace(/\n/g, "") // Remove new lines
                            .replace(/\t/g, "") // Remove tabs
                            .replace(/\r/g, "") // Remove carriage returns
                            .replace(/,\s*}/g, "}"); // Remove trailing commas before closing brace
                        return yield Promise.resolve(JSON.parse(cleanedJSON));
                    }
                }
                escaped = char === "\\" && !escaped;
            }
        }
        catch (error) {
            console.error("❌ JSON Parsing Error:", error.message);
            console.error("🔍 Raw AI Response:", text);
            return null;
        }
        return null;
    });
}
