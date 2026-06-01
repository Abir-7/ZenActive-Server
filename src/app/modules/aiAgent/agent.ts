import Workout from "../workout&exercise/workout/workout.model";
import { WorkoutPlan } from "../workout&exercise/workoutPlan/workoutPlan.model";
import { Types } from "mongoose";
import { getGeminiResponse } from "../../utils/getGeminiResponse";

export const tools = {
  getAllWorkouts: async () => {
    return await Workout.find({ isDeleted: false }).select("name description points _id");
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
    const newPlan = await WorkoutPlan.create(data);
    if (!newPlan) {
      throw new Error("Failed to create Workout Plan.");
    }
    return newPlan;
  },
};

const SYSTEM_PROMPT = `
You are an AI Workout Assistant. Your goal is to create workout plans for users.
You operate in a loop: PLAN, ACTION, OBSERVATION, OUTPUT.

### Available Tools
- getAllWorkouts(): Fetch available workouts.
- createWorkoutPlans(plan): Save the generated workout plan.

### WorkoutPlan Schema for createWorkoutPlans:
{
  "name": "string",
  "description": "string",
  "duration": number (days),
  "workouts": ["ObjectId"], (Exactly one workout per day. If duration is 7, you need 7 workout IDs)
  "points": number,
  "image": "string (use a relevant placeholder URL if needed)",
  "about": "string"
}

### Instructions:
1. When asked to make a plan, first use getAllWorkouts to see what's available.
2. Based on the available workouts, create a distribution for the requested duration.
3. Use createWorkoutPlans to save it.
4. Respond with a final "output" type message.

ALWAYS respond with valid JSON.
Response format should be an array of objects:
[
  { "type": "plan", "plan": "Description of what you will do" },
  { "type": "action", "function": "functionName", "input": { ... } },
  { "type": "output", "output": "Final message to user" }
]
`;

export async function processQuery(userInput: string): Promise<any> {
  const history: any[] = [
    { type: "user", user: userInput }
  ];

  let finished = false;
  let finalResult = null;
  let iterations = 0;
  const maxIterations = 10;

  while (!finished && iterations < maxIterations) {
    iterations++;
    try {
      const prompt = JSON.stringify(history);
      const parsedResponse = await getGeminiResponse(prompt, SYSTEM_PROMPT, true);

      if (!parsedResponse || !Array.isArray(parsedResponse)) {
        console.error("❌ Invalid response from AI:", parsedResponse);
        break;
      }

      for (const action of parsedResponse) {
        history.push(action);

        switch (action.type) {
          case "plan":
            console.log(`📝 Plan: ${action.plan}`);
            break;

          case "action":
            if (action.function && tools[action.function as keyof typeof tools]) {
              try {
                console.log(`🚀 Executing: ${action.function}`);
                const observation = await tools[action.function as keyof typeof tools](action.input || {});
                history.push({ type: "observation", observation });
              } catch (error: any) {
                history.push({ type: "error", message: error.message });
              }
            }
            break;

          case "output":
            console.log(`🎯 Output: ${action.output}`);
            finalResult = action.output;
            finished = true;
            break;
        }
      }
    } catch (error) {
      console.error("❌ Error in AI loop:", error);
      finished = true;
    }
  }

  return finalResult;
}
