import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { MealRoute } from "../modules/meal/meal.route";

import { BadgeRoute } from "../modules/badge/badge.route";

// import { BlockRoute } from "../modules/userConnection/blocklist/blocklist.route";
import { FriendListRoute } from "../modules/userConnection/friendList/friendlist.route";
import { UserMealPlanRoute } from "../modules/userMealPlan/userMealPlan.route";
import { PostRoute } from "../modules/blog/post/post.route";
import { CommentRoute } from "../modules/blog/comments/comment.route";
import { LikeRoute } from "../modules/blog/likes/like.router";

import { AppDataRoute } from "../modules/userAppData/appdata.route";

import { ChatRouter } from "../modules/userChat/chat.route";

import { WorkoutPlanRoute } from "../modules/workout&exercise/workoutPlan/workoutPlan.route";
import { UserWorkoutPlanRoute } from "../modules/userWorkoutPlan/userWorkoutPlan.router";
import { ExerciseRoute } from "../modules/workout&exercise/exercise/exercise.route";
import { WorkoutRoute } from "../modules/workout&exercise/workout/workout.route";
import { FeedbackRoute } from "../modules/userFeedback/feedback.route";
import { UserBadgeRoute } from "../modules/usersBadge/userBadge.route";
//import { PackageRoute } from "../modules/payment/package/package.route";

import { PrivacyTermsAboutUsRoute } from "../modules/privacy & terms & about us/privacy_terms_aboutus.route";
import { DailyExerciseRoutes } from "../modules/usersDailyExercise/dailyExercise.route";
import { WorkoutVideoRoutes } from "../modules/workout&exercise/workoutVideos/workoutVideo.route";
import { GroupRoute } from "../modules/socialGroup/Group/group.route";
import { UserGroupRoute } from "../modules/socialGroup/UsersGroup/userGroup.route";
import { NotificationRoute } from "../modules/notification/notification.route";
import { PaymentRoute } from "../modules/payment/payment/payment.route";
import { SubscriptionPlanRoute } from "../modules/payment/subscription/subscription.route";

const router = Router();

const apiRoutes = [
  { path: "/user", route: UserRoute },
  { path: "/auth", route: AuthRoute },
  { path: "/meal", route: MealRoute },
  { path: "/workout-plan", route: WorkoutPlanRoute },
  { path: "/workout-plan", route: UserWorkoutPlanRoute },
  { path: "/badge", route: BadgeRoute },
  // { path: "/package", route: PackageRoute },
  // { path: "/block-list", route: BlockRoute },
  { path: "/friend", route: FriendListRoute },
  { path: "/meal-plan", route: UserMealPlanRoute },
  { path: "/app-data", route: AppDataRoute },
  { path: "/group", route: GroupRoute },
  { path: "/user-group", route: UserGroupRoute },
  { path: "/post", route: PostRoute },
  { path: "/comment", route: CommentRoute },
  { path: "/like", route: LikeRoute },
  { path: "/chat", route: ChatRouter },
  { path: "/exercise", route: ExerciseRoute },
  { path: "/workout", route: WorkoutRoute },
  { path: "/workout-video", route: WorkoutVideoRoutes },
  { path: "/feedback", route: FeedbackRoute },
  { path: "/user-badge", route: UserBadgeRoute },
  { path: "/privacy&terms", route: PrivacyTermsAboutUsRoute },
  { path: "/daily-exercise", route: DailyExerciseRoutes },
  { path: "/notification", route: NotificationRoute },
  { path: "/payment", route: PaymentRoute },
  { path: "/subscription-plan", route: SubscriptionPlanRoute },
];
apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
