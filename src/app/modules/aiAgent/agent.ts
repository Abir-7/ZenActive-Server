const GEMINI_API_KEY = "AIzaSyCP7WPliATqWAZnEBCgGS6Xm7XVWteSShM";

import { GoogleGenerativeAI } from "@google/generative-ai";
import Workout from "../workout&exercise/workout/workout.model";
import { WorkoutPlan } from "../workout&exercise/workoutPlan/workoutPlan.model";
import { Types } from "mongoose";

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
    // Create the workout plan in MongoDB
    const newPlan = await WorkoutPlan.create(data);

    if (!newPlan) {
      throw new Error("Failed to create Workout Plan.");
    }

    console.log("✅ Workout Plan Saved:", newPlan);
    return newPlan;
  },
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
export const messages: { role: string; content: string }[] = [
  { role: "system", content: SYSTEM_PROMPT },
];

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
            messages.push({
              role: "assistant",
              content: JSON.stringify(action),
            });
            break;

          case "action":
            if (
              action.function &&
              tools[action.function as keyof typeof tools]
            ) {
              try {
                console.log(`🚀 Executing function: ${action.function}`);
                const observation = await tools[
                  action.function as keyof typeof tools
                ](action.input || {});
                console.log("✅ Tool Response:", observation);

                messages.push({
                  role: "assistant",
                  content: JSON.stringify({
                    type: "observation",
                    observation,
                  }),
                });
              } catch (error: any) {
                console.error("❌ Error executing function:", error);
                messages.push({
                  role: "assistant",
                  content: JSON.stringify({
                    type: "error",
                    message: error.message,
                  }),
                });
              }
            } else {
              console.error("❌ Invalid function call:", action.function);
              messages.push({
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
            messages.push({
              role: "assistant",
              content: JSON.stringify(action),
            });
            break;

          case "output":
            console.log(`🎯 Final Output: ${action.output}`);
            messages.push({
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
    } catch (error) {
      console.error("❌ Error processing query:", error);
      finished = true;
    }
  }
}
