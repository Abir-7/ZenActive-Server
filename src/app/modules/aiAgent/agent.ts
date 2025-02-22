// import { WorkoutService } from "../workout&exercise/workout/workout.service";
// import { createWorkoutPlan } from "../workout&exercise/workoutPlan/workoutPlan.controller";
// import { WorkoutPlanService } from "../workout&exercise/workoutPlan/workoutPlan.service";

// const tools = {
//   getAllWorkout: WorkoutService.getAllWorkouts,
//   createWorkoutPlan: WorkoutPlanService.createWorkout,
// };

// const SYSTEM_PROMPT = `You are an AI To-Do List Assistant. You can manage workout plans by adding, viewing, updating, and deleting.

// You are an AI Assistant with START, PLAN, ACTION, Observation, and Output State. Wait for the user prompt and first PLAN using available tools. After Planning, Take the action with appropriate tools and wait for Observation based on Action. Once you get the observations, Return the AI response based on START prompt and observations.

// workout schema:
//   {name: string;
//   description?: string;
//   exercises: Types.ObjectId[];
//   points: number;
//   image: string;
// }

// workout plan schema:
// name: string;
//    description?: string;
//    duration: number;
//    workouts: [Types.ObjectId];
//    points: number;
//    isDeleted: boolean;
//    image: string;
//    about: string;

// Available Tools:
// -  getAllWorkout(): Returns all the workout from Database
// -  createWorkoutPlan(  {duration: number;
//   workouts: [Types.ObjectId];
//   points: number;
//   image: string;
//   about: string;}): Creates workout plan

// Example:
// START
// PLAN: The user wants to create a workout plan for 8 week using available workout from getAllWorkout(). The plan will be described as a full-body workout.

// ACTION: Creating workout plan with available workouts , given (name ,description,duration,points,about,image)

// Observation: The workout plan is created successfully with the given details.

// Output: The workout plan is ready, and it has been created successfully with a 30-minute duration, including exercises A, B, and C, worth 50 points, and described as "Full-body workout."

// START
// { "type": "user", "user": "Create a full body workout plan for 7week  with available workouts and given (description,name,points,about,image)}

// { "type": "plan", "plan": "I will gather all available workout using getAllWorkout() and then create a workout plan with the provided data " }

// { "type": "action", "function": "createWorkoutPlan", "input": "{name: string;
//    description?: string;
//    duration: number;
//    workouts: [Types.ObjectId];
//    points: number;
//    isDeleted: boolean;
//    image: string;
//    about: string; }" }

// { "type": "observation", "observation": "Workout plan created successfully." }
// { "type": "output", "output": "Your 7weeke workout plan has been created successfully, give the response

// `;

// import { OpenAIClient } from 'openai';

// const client = new OpenAIClient({
//   apiKey: 'your-api-key-here',
// });

// const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

// while (true) {
//     const query = readlineSync.question('>> ');
//     const userMessage = {
//         type: 'user',
//         user: query,
//     };
//     messages.push({ role: 'user', content: JSON.stringify(userMessage) });

//     while (true) {
//         const chat = await client.chat.completions.create({
//             model: 'gpt-4o',
//             messages: messages,
//             response_format: { type: 'json_object' },
//         });
//         const result = chat.choices[0].message.content;
//         messages.push({ role: 'assistant', content: result });

//         const action = JSON.parse(result);

//         if (action.type === 'output') {
//             console.log('●: ${action.output}');
//             break;
//         } else if (action.type === 'action') {
//             const fn = tools[action.function as keyof typeof tools];
//             if (!fn) throw new Error('Invalid Tool Call');
//             const observation = fn(action.input);
//             const observationMessage = {
//                 type: 'observation',
//                 observation: observation,
//             };
//             messages.push({
//                 role: 'developer',
//                 content: JSON.stringify(observationMessage),
//             })
//         }
//     }

//    }

import { WorkoutPlanService } from "../workout&exercise/workoutPlan/workoutPlan.service";
import { WorkoutService } from "../workout&exercise/workout/workout.service";

const GEMINI_API_KEY = "AIzaSyCP7WPliATqWAZnEBCgGS6Xm7XVWteSShM";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const tools = {
  getAllWorkout: WorkoutService.getAllWorkouts,
  createWorkoutPlan: WorkoutPlanService.createWorkout,
};

const SYSTEM_PROMPT = `You are an AI To-Do List Assistant. You can manage workout plans by adding, viewing, updating, and deleting.

You are an AI Assistant with START, PLAN, ACTION, Observation, and Output State. Wait for the user prompt and first PLAN using available tools. After Planning, Take the action with appropriate tools and wait for Observation based on Action. Once you get the observations, Return the AI response based on START prompt and observations.

workout schema:
  {name: string;
  description?: string;
  exercises: Types.ObjectId[]; 
  points: number;
  image: string;
}

workout plan schema:
name: string;
   description?: string;
   duration: number;
   workouts: [Types.ObjectId];
   points: number;
   isDeleted: boolean;
   image: string;
   about: string;

Available Tools:
- getAllWorkout(): Returns all the workout from Database
- createWorkoutPlan( {duration: number; workouts: [Types.ObjectId]; points: number; image: string; about: string;}): Creates workout plan`;

const messages = [{ role: "system", content: SYSTEM_PROMPT }];

async function getGeminiResponse(messages: object[]) {
  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `
 how are u?
          `,
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();
  console.log(data, "---------kk----");
  return data;
}

import readlineSync from "readline-sync";
async function processUserQuery() {
  while (true) {
    const query = readlineSync.question(">> ");
    const userMessage = {
      type: "user",
      user: query,
    };
    messages.push({ role: "user", content: JSON.stringify(userMessage) });

    while (true) {
      try {
        const result = await getGeminiResponse(messages);
        console.log(result, "gg---->");
        // const action = JSON.parse(result.choices[0].message.content);

        // if (action.type === "output") {
        //   console.log(`●: ${action.output}`);
        // } else if (action.type === "action") {
        //   const fn = tools[action.function as keyof typeof tools];
        //   if (!fn) throw new Error("Invalid Tool Call");
        //   console.log(fn, "----fn");
        //   const observation = await fn(action.input);
        //   const observationMessage = {
        //     type: "observation",
        //     observation: observation,
        //   };

        //   messages.push({
        //     role: "developer",
        //     content: JSON.stringify(observationMessage),
        //   });
        // }
      } catch (error) {
        console.log("object -->", error);
      }
    }
  }
}

processUserQuery();
