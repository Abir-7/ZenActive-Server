"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const meal_route_1 = require("../modules/meal/meal.route");
const challenge_route_1 = require("../modules/challenge( maybe not needed)/challenge.route");
const badge_route_1 = require("../modules/badge/badge.route");
const blocklist_route_1 = require("../modules/userConnection/blocklist/blocklist.route");
const friendlist_route_1 = require("../modules/userConnection/friendList/friendlist.route");
const userMealPlan_route_1 = require("../modules/userMealPlan/userMealPlan.route");
const post_route_1 = require("../modules/blog/post/post.route");
const comment_route_1 = require("../modules/blog/comments/comment.route");
const like_router_1 = require("../modules/blog/likes/like.router");
const group_route_1 = require("../modules/socialGroup/group.route");
const appdata_route_1 = require("../modules/userAppData/appdata.route");
const chat_route_1 = require("../modules/userChat/chat.route");
const workoutPlan_route_1 = require("../modules/workout&exercise/workoutPlan/workoutPlan.route");
const userWorkoutPlan_router_1 = require("../modules/userWorkoutPlan/userWorkoutPlan.router");
const exercise_route_1 = require("../modules/workout&exercise/exercise/exercise.route");
const workout_route_1 = require("../modules/workout&exercise/workout/workout.route");
const feedback_route_1 = require("../modules/userFeedback/feedback.route");
const userBadge_route_1 = require("../modules/usersBadge/userBadge.route");
//import { PackageRoute } from "../modules/payment/package/package.route";
const subscription_route_1 = require("../modules/payment/subscription/subscription.route");
const privacy_terms_aboutus_route_1 = require("../modules/privacy & terms & about us/privacy_terms_aboutus.route");
const dailyExercise_route_1 = require("../modules/usersDailyExercise/dailyExercise.route");
const workoutVideo_route_1 = require("../modules/workout&exercise/workoutVideos/workoutVideo.route");
const router = (0, express_1.Router)();
const apiRoutes = [
    { path: "/user", route: user_route_1.UserRoute },
    { path: "/auth", route: auth_route_1.AuthRoute },
    { path: "/meal", route: meal_route_1.MealRoute },
    { path: "/workout-plan", route: workoutPlan_route_1.WorkoutPlanRoute },
    { path: "/workout-plan", route: userWorkoutPlan_router_1.UserWorkoutPlanRoute },
    { path: "/challenge", route: challenge_route_1.ChallengeRoute },
    { path: "/badge", route: badge_route_1.BadgeRoute },
    // { path: "/package", route: PackageRoute },
    { path: "/block-list", route: blocklist_route_1.BlockRoute },
    { path: "/friend", route: friendlist_route_1.FriendListRoute },
    { path: "/meal-plan", route: userMealPlan_route_1.UserMealPlanRoute },
    { path: "/app-data", route: appdata_route_1.AppDataRoute },
    { path: "/group", route: group_route_1.GroupRoute },
    { path: "/post", route: post_route_1.PostRoute },
    { path: "/comment", route: comment_route_1.CommentRoute },
    { path: "/like", route: like_router_1.LikeRoute },
    { path: "/chat", route: chat_route_1.ChatRouter },
    { path: "/exercise", route: exercise_route_1.ExerciseRoute },
    { path: "/workout", route: workout_route_1.WorkoutRoute },
    { path: "/workout-video", route: workoutVideo_route_1.WorkoutVideoRoutes },
    { path: "/feedback", route: feedback_route_1.FeedbackRoute },
    { path: "/user-badge", route: userBadge_route_1.UserBadgeRoute },
    { path: "/subscription", route: subscription_route_1.SubscriptionRoute },
    { path: "/privacy&terms", route: privacy_terms_aboutus_route_1.PrivacyTermsAboutUsRoute },
    { path: "/daily-exercise", route: dailyExercise_route_1.DailyExerciseRoutes },
];
apiRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
