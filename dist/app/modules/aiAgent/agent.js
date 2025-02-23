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
exports.tools = exports.messages = exports.SYSTEM_PROMPT = void 0;
exports.getGeminiResponse = getGeminiResponse;
exports.extractJSON = extractJSON;
exports.processUserQuery = processUserQuery;
const generative_ai_1 = require("@google/generative-ai");
const workoutPlan_service_1 = require("../workout&exercise/workoutPlan/workoutPlan.service");
const workout_model_1 = __importDefault(require("../workout&exercise/workout/workout.model"));
// Gemini API key and redesigned system prompt.
const GEMINI_API_KEY = "AIzaSyCP7WPliATqWAZnEBCgGS6Xm7XVWteSShM";
exports.SYSTEM_PROMPT = `
You are an AI Assistant responsible for managing workout plans in a MongoDB database using CRUD operations.
Your primary goal is to create structured workout plans with the following condition:
  - Each day in the workout plan must have exactly one unique workout. That is, if the plan spans multiple days, the number of workouts must equal the plan's duration, ensuring no day is assigned more than one workout.

Available operations (execute asynchronously):
- getAllWorkout({}): Retrieve all available workouts from the database.
- createWorkoutPlan(data): Create a new workout plan.
- getWorkoutPlans(): Retrieve all workout plans.
- updateWorkoutPlan(id, data): Update a workout plan by ID.
- deleteWorkoutPlan(id): Soft-delete a workout plan by ID.

Data Interfaces:
IWorkout:
{
  name: string;
  description?: string;
  exercises: Types.ObjectId[];
  points: number;
  image: string;
  isDeleted: boolean;
}

IWorkoutPlan:
{
  name: string;
  description?: string;
  duration: number; // total days of the plan
  workouts: [Types.ObjectId]; // Array of workout IDs (one for each day)
  points: number;
  isDeleted: boolean;
  image: string;
  about: string;
}

Additional Conditions:
1. The number of workout IDs in the workouts array must equal the duration.
2. Use getAllWorkout first to fetch available workouts.
3. Ensure each workout in the plan is unique and assigned to a single day.

Your responses must follow this JSON protocol:
{
  "type": "plan" | "action" | "observation" | "output",
  "plan"?: "explanation of what you will do",
  "function"?: "name of the function to call",
  "input"?: { ... },
  "observation"?: "result of a tool call",
  "output"?: "final message to the user"
}
`;
exports.messages = [
    { role: "system", content: exports.SYSTEM_PROMPT },
];
exports.tools = {
    getAllWorkout: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield workout_model_1.default.find();
    }),
    createWorkoutPlan: workoutPlan_service_1.WorkoutPlanService.createWorkoutPlan,
};
/**
 * Calls the Gemini API and returns its response text.
 */
function getGeminiResponse(messages) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = JSON.stringify(messages);
        const result = yield model.generateContent(prompt);
        if ((result === null || result === void 0 ? void 0 : result.response) && ((_a = result.response.candidates) === null || _a === void 0 ? void 0 : _a.length)) {
            return (_b = result.response.candidates[0].content.parts[0].text) !== null && _b !== void 0 ? _b : null;
        }
        return null;
    });
}
/**
 * Extracts the first complete JSON object from a given text by matching balanced braces.
 */
function extractJSON(text) {
    console.log("Full Gemini response text:", text);
    const start = text.indexOf("{");
    if (start === -1)
        return null;
    let braceCount = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < text.length; i++) {
        const char = text[i];
        if (char === '"' && !escaped) {
            inString = !inString;
        }
        if (!inString) {
            if (char === "{") {
                braceCount++;
            }
            else if (char === "}") {
                braceCount--;
                if (braceCount === 0) {
                    const jsonStr = text.substring(start, i + 1);
                    console.log("Extracted JSON string:", jsonStr);
                    return jsonStr;
                }
            }
        }
        escaped = char === "\\" && !escaped;
    }
    return null;
}
/**
 * Processes a user query by communicating with Gemini.
 * It adds the user query to the conversation, retrieves the plan/action/output,
 * executes the required tool actions, and logs the final output.
 *
 * This loop supports multiple actions in sequence.
 * For example, the agent can first call getAllWorkout to retrieve available workouts,
 * then use that information to prepare a createWorkoutPlan call that respects the condition.
 */
function processUserQuery(query) {
    return __awaiter(this, void 0, void 0, function* () {
        //   const query = readlineSync.question(">> ");
        exports.messages.push({
            role: "user",
            content: JSON.stringify({ type: "user", user: query }),
        });
        console.log(exports.messages);
        let finished = false;
        while (!finished) {
            try {
                const result = yield getGeminiResponse(exports.messages);
                if (!result) {
                    console.log("No response from Gemini");
                    break;
                }
                const jsonString = extractJSON(result);
                if (!jsonString) {
                    throw new Error("No valid JSON found in the response");
                }
                // Parse the JSON. If the JSON represents an array of actions, process them sequentially.
                let actions = [];
                const parsed = JSON.parse(jsonString);
                if (Array.isArray(parsed)) {
                    actions = parsed;
                }
                else {
                    actions.push(parsed);
                }
                for (const action of actions) {
                    if (action.type === "plan") {
                        exports.messages.push({ role: "assistant", content: JSON.stringify(action) });
                    }
                    else if (action.type === "action") {
                        const fn = exports.tools[action.function];
                        if (!fn) {
                            throw new Error("Invalid Tool Call: " + action.function);
                        }
                        const observation = yield fn(action.input.id ? action.input.id : action.input);
                        console.log(observation, "------>");
                        exports.messages.push({
                            role: "developer",
                            content: JSON.stringify({ type: "observation", observation }),
                        });
                    }
                    else if (action.type === "output") {
                        console.log(`Final Output: ${action.output}`);
                        finished = true;
                    }
                }
            }
            catch (error) {
                console.error("Error processing action:", error);
                finished = true;
            }
        }
    });
}
