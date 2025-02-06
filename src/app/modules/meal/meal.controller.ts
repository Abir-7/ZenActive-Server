import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MealService } from "./meal.service";
import httpStatus from "http-status";

const createMeal = catchAsync(async (req, res) => {
  let image = null;

  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }
  const value = {
    ...req.body,
    image,
  };

  console.log(value);
  const result = await MealService.createMeal(value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Meal successfully created.",
  });
});

const updateMeal = catchAsync(async (req, res) => {
  const { id } = req.params;

  let image = null;
  let value = null;
  if (req.files && "image" in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  if (image) {
    value = {
      ...req.body,
      image,
    };
  } else {
    value = req.body;
  }

  const result = await MealService.updateMeal(id, value);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Meal successfully updated.",
  });
});

const deleteMeal = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await MealService.deleteMeal(id);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Meal successfully deleted.",
  });
});

const getAllMeals = catchAsync(async (req, res) => {
  const filter = req.query; // You can pass filters here if needed (e.g., { category: 'vegan' })

  const result = await MealService.getAllMeals(filter);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Meals retrieved successfully.",
  });
});

const getAllUserMeals = catchAsync(async (req, res) => {
  const filter = req.query; // You can pass filters here if needed (e.g., { category: 'vegan' })

  const { userId } = req.user;

  const result = await MealService.getAlluserMeals(filter, userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Meals retrieved successfully.",
  });
});

const getSingleMeal = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await MealService.getSingleMeal(id);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Meal retrieved successfully.",
  });
});

export const MealController = {
  updateMeal,
  createMeal,
  deleteMeal,
  getAllMeals,
  getSingleMeal,
  getAllUserMeals,
};
