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
exports.setupCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const userMealPlan_model_1 = __importDefault(require("../modules/userMealPlan/userMealPlan.model"));
const dailyExercise_model_1 = __importDefault(require("../modules/usersDailyExercise/dailyExercise.model"));
const setupCronJobs = () => {
    // delete user meal plan at 12Am everyday
    node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield userMealPlan_model_1.default.deleteMany();
            console.log(`Deleted ${result.deletedCount} meal plans.`);
        }
        catch (error) {
            console.error("Error deleting meal plans:", error);
        }
    }));
    //end
    node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield dailyExercise_model_1.default.deleteMany();
            console.log(`Deleted ${result.deletedCount} DailyExercise.`);
        }
        catch (error) {
            console.error("Error deleting DailyExercise:", error);
        }
    }));
};
exports.setupCronJobs = setupCronJobs;
