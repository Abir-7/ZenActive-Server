const GEMINI_API_KEY = "AIzaSyCP7WPliATqWAZnEBCgGS6Xm7XVWteSShM";

import { GoogleGenerativeAI } from "@google/generative-ai";
import Workout from "../workout&exercise/workout/workout.model";
import { WorkoutPlan } from "../workout&exercise/workoutPlan/workoutPlan.model";
import { Types } from "mongoose";

// System Prompt
export const SYSTEM_PROMPT = `
You are an AI assistant responsible for managing a MongoDB database.
Your role is to handle CRUD operations for multiple collections in a structured and valid manner.

## Available Operations:
- getAllWorkouts(): Retrieve all available workouts.
- createWorkoutPlans({
    name: string;
    description?: string;
    duration: number (convert week to days);
    workouts: Types.ObjectId[] (**If 84 days, workouts will be 84, workout IDs can be repeated**);
    points: number;
    image: string;
    about: string;
  }): Create a new workout plan ensuring correct workout count per duration.

## Special Rules for Workout Plans:
- Each workout plan must have **exactly one workout per day**.
- The **number of workouts must match the duration**.
- Fetch available workouts and adjust the count if necessary.

## Response Format:
{
  "type": "plan" | "action" | "observation" | "output",
  "plan"?: "explanation of what you will do",
  "function"?: "name of the function to call",
  "input"?: { ... },
  "observation"?: "result of a tool call",
  "output"?: "final message to the user"
}

**Ensure all responses are valid JSON and execute the appropriate tools correctly.**
**Always return the response from the tool to confirm the action was successful.**

`;

// Messages history
export const messages: { role: string; content: string }[] = [
  { role: "system", content: SYSTEM_PROMPT },
];

// Tools for database operations
export const tools = {
  getAllWorkouts: async () => {
    return await Workout.find({ isDeleted: false });
  },

  createWorkoutPlans: async (data: {
    name: string;
    description?: string;
    duration: number;
    workouts: Types.ObjectId[];
    points: number;
    image: string;
    about: string;
  }) => {
    try {
      if (data.duration < 1) {
        throw new Error("Duration must be at least 1 day.");
      }

      const allWorkouts = await Workout.find({ isDeleted: false });

      if (allWorkouts.length === 0) {
        throw new Error("No available workouts found.");
      }

      // Ensure workouts match the duration
      if (data.workouts.length !== data.duration) {
        console.warn(
          `⚠️ Workout count (${data.workouts.length}) does not match duration (${data.duration}). Adjusting...`
        );

        // Assign workouts in a loop to match the duration exactly
        const selectedWorkouts: Types.ObjectId[] = [];
        for (let i = 0; i < data.duration; i++) {
          selectedWorkouts.push(allWorkouts[i % allWorkouts.length]._id);
        }

        data.workouts = selectedWorkouts;
      }

      console.log("📌 Creating Workout Plan with:", data);

      // Create the workout plan in MongoDB
      const newPlan = await WorkoutPlan.create(data);

      if (!newPlan) {
        throw new Error("Failed to create Workout Plan.");
      }

      console.log("✅ Workout Plan Saved:", newPlan);
      return newPlan;
    } catch (error) {
      console.error("❌ Error in createWorkoutPlans:", error);
      throw new Error("Error creating workout plan.");
    }
  },
};

// Function to interact with Gemini API
async function getGeminiResponse(messages: object[]): Promise<any> {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = JSON.stringify(messages);
  const result = await model.generateContent(prompt);

  return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

// Extract JSON safely from AI response
function extractJSON(text: string): any {
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

// Process user query and ensure multiple tools can be used if needed
export async function processQuery(userInput: string): Promise<void> {
  messages.push({
    role: "user",
    content: JSON.stringify({ type: "user", user: userInput }),
  });

  let finished = false;

  while (!finished) {
    try {
      const result = await getGeminiResponse(messages);

      if (!result) {
        console.error("⚠️ No response received from Gemini AI");
        break;
      }

      console.log("🔍 Raw AI Response:", result);

      // Try extracting JSON
      let parsedResponse = extractJSON(result);
      if (!parsedResponse) {
        console.error("❌ Failed to extract JSON from AI response.");
        break;
      }

      if (!Array.isArray(parsedResponse)) {
        parsedResponse = [parsedResponse]; // Ensure it's always an array
      }

      for (const action of parsedResponse) {
        switch (action.type) {
          case "plan":
            console.log(`Plan: ${action.plan}`);
            messages.push({
              role: "assistant",
              content: JSON.stringify(action),
            });
            break;
          case "action":
            if (action.function) {
              const fn = tools[action.function as keyof typeof tools];

              if (!fn) {
                console.error("Invalid function call:", action.function);
                messages.push({
                  role: "assistant",
                  content: JSON.stringify({
                    type: "error",
                    message: `Invalid function: ${action.function}`,
                  }),
                });
                continue;
              }

              try {
                console.log(`Executing function: ${action.function}`);
                const observation = await fn(action.input);
                console.log("✅ Tool Response:", observation);

                messages.push({
                  role: "assistant",
                  content: JSON.stringify({ type: "observation", observation }),
                });
              } catch (error: any) {
                console.error("Error executing function:", error);
                messages.push({
                  role: "assistant",
                  content: JSON.stringify({
                    type: "error",
                    message: error.message,
                  }),
                });
              }
            }
            break;
          case "output":
            console.log(`Final Output: ${action.output}`);
            messages.push({
              role: "assistant",
              content: JSON.stringify(action),
            });
            finished = true;
            break;
          default:
            console.error("Unknown action type:", action.type);
            break;
        }
      }
    } catch (error) {
      console.error("❌ Error processing query:", error);
      finished = true;
    }
  }
}
