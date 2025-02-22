"use strict";
// import { WorkoutService } from "../workout&exercise/workout/workout.service";
// import { createWorkoutPlan } from "../workout&exercise/workoutPlan/workoutPlan.controller";
// import { WorkoutPlanService } from "../workout&exercise/workoutPlan/workoutPlan.service";
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
const workoutPlan_service_1 = require("../workout&exercise/workoutPlan/workoutPlan.service");
const workout_service_1 = require("../workout&exercise/workout/workout.service");
const GEMINI_API_KEY = "AIzaSyCP7WPliATqWAZnEBCgGS6Xm7XVWteSShM";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const tools = {
    getAllWorkout: workout_service_1.WorkoutService.getAllWorkouts,
    createWorkoutPlan: workoutPlan_service_1.WorkoutPlanService.createWorkout,
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
function getGeminiResponse(messages) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(GEMINI_API_URL, {
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
        const data = yield response.json();
        console.log(data, "---------kk----");
        return data;
    });
}
const readline_sync_1 = __importDefault(require("readline-sync"));
function processUserQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            const query = readline_sync_1.default.question(">> ");
            const userMessage = {
                type: "user",
                user: query,
            };
            messages.push({ role: "user", content: JSON.stringify(userMessage) });
            while (true) {
                try {
                    const result = yield getGeminiResponse(messages);
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
                }
                catch (error) {
                    console.log("object -->", error);
                }
            }
        }
    });
}
processUserQuery();
