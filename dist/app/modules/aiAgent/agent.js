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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.tools = void 0;
exports.processQuery = processQuery;
const GEMINI_API_KEY = "AIzaSyCP7WPliATqWAZnEBCgGS6Xm7XVWteSShM";
const generative_ai_1 = require("@google/generative-ai");
const workout_model_1 = __importDefault(require("../workout&exercise/workout/workout.model"));
const workoutPlan_model_1 = require("../workout&exercise/workoutPlan/workoutPlan.model");
exports.tools = {
    getAllWorkouts: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield workout_model_1.default.find({ isDeleted: false });
    }),
    createWorkoutPlans: (data) => __awaiter(void 0, void 0, void 0, function* () {
        // Create the workout plan in MongoDB
        const newPlan = yield workoutPlan_model_1.WorkoutPlan.create(data);
        if (!newPlan) {
            throw new Error("Failed to create Workout Plan.");
        }
        console.log("✅ Workout Plan Saved:", newPlan);
        return newPlan;
    }),
};
// System Prompt
const SYSTEM_PROMPT = `
You are an AI To-Do List Assistant operating in these states: START, PLAN, ACTION, OBSERVATION, OUTPUT.

Follow these steps:
- Wait for the user's prompt.
- PLAN using available tools.
- SEND the PLAN.
- Execute ACTION using tools.
- Wait for OBSERVATION.
- Respond in OUTPUT.

### **Workout Schema**
Workout DB Schema:
{
  name: string;
  description?: string;
  exercises: Types.ObjectId[];
  points: number;
  image: string;
  isDeleted: boolean;
}

WorkoutPlan DB Schema:
{
  name: string;
  description?: string;
  duration: number;
  workouts: [Types.ObjectId];
  points: number;
  isDeleted: boolean;
  image: string;
  about: string;
}

### **Available Tools**
- getAllWorkouts(): Fetch all workouts.
- createWorkoutPlans(plan: WorkoutPlanSchema): Save the workout plan.

 ** create data only one time**
 
### **Example Interaction**
START
{ "type": "user", "user": "Make a workout plan for 1 week" }
{ "type": "plan", "plan": "Fetch all available workouts using getAllWorkouts()" }
{ "type": "action", "function": "getAllWorkouts", "input": {} }
 { "type": "plan", "plan": "Distribute workouts across 7 days ensuring each day has exactly one workout.  example: '8week = 56 day then workouts arry will with 56 workout id'" }
{ "type": "observation", "observation": "[{workout1}, {workout2}, ...]" }
{ "type": "action", "function": "createWorkoutPlans", "input": "{ generatedWorkoutPlan }" }
{ "type": "observation", "observation": "{ _id }" }
{ "type": "output", "output": "Your 1-week workout plan has been created successfully!" }

`;
// Messages history
exports.messages = [
    { role: "system", content: SYSTEM_PROMPT },
];
// Function to interact with Gemini API
function getGeminiResponse(messages) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = JSON.stringify(messages);
        const result = yield model.generateContent(prompt);
        return (_g = (_f = (_e = (_d = (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text) !== null && _g !== void 0 ? _g : null;
    });
}
// Extract JSON safely from AI response
function extractJSON(text) {
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
                    return JSON.parse(cleanedJSON);
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
}
function processQuery(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.messages.push({
            role: "user",
            content: JSON.stringify({ type: "user", user: userInput }),
        });
        let finished = false;
        while (!finished) {
            try {
                const result = yield getGeminiResponse(exports.messages);
                if (!result) {
                    console.error("⚠️ No response received from Gemini AI");
                    break;
                }
                console.log("🔍 Raw AI Response:", result);
                // Extract JSON from AI response
                let parsedResponse = extractJSON(result);
                if (!parsedResponse) {
                    console.error("❌ Failed to extract JSON from AI response.");
                    break;
                }
                if (!Array.isArray(parsedResponse)) {
                    parsedResponse = [parsedResponse]; // Ensure it is always an array
                }
                for (const action of parsedResponse) {
                    switch (action.type) {
                        case "plan":
                            console.log(`📝 Plan: ${action.plan}`);
                            exports.messages.push({
                                role: "assistant",
                                content: JSON.stringify(action),
                            });
                            break;
                        case "action":
                            if (action.function &&
                                exports.tools[action.function]) {
                                try {
                                    console.log(`🚀 Executing function: ${action.function}`);
                                    const observation = yield exports.tools[action.function](action.input || {});
                                    console.log("✅ Tool Response:", observation);
                                    exports.messages.push({
                                        role: "assistant",
                                        content: JSON.stringify({
                                            type: "observation",
                                            observation,
                                        }),
                                    });
                                }
                                catch (error) {
                                    console.error("❌ Error executing function:", error);
                                    exports.messages.push({
                                        role: "assistant",
                                        content: JSON.stringify({
                                            type: "error",
                                            message: error.message,
                                        }),
                                    });
                                }
                            }
                            else {
                                console.error("❌ Invalid function call:", action.function);
                                exports.messages.push({
                                    role: "assistant",
                                    content: JSON.stringify({
                                        type: "error",
                                        message: `Invalid function: ${action.function}`,
                                    }),
                                });
                            }
                            break;
                        case "observation":
                            console.log("📡 Observation:", action.observation);
                            exports.messages.push({
                                role: "assistant",
                                content: JSON.stringify(action),
                            });
                            break;
                        case "output":
                            console.log(`🎯 Final Output: ${action.output}`);
                            exports.messages.push({
                                role: "assistant",
                                content: JSON.stringify(action),
                            });
                            finished = true;
                            break;
                        default:
                            console.error("❌ Unknown action type:", action.type);
                            break;
                    }
                }
            }
            catch (error) {
                console.error("❌ Error processing query:", error);
                finished = true;
            }
        }
    });
}
