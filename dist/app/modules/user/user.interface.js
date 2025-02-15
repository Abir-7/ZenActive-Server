"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalCondition = exports.MovementDifficulty = exports.Injury = exports.ActivityLevel = exports.Restrictions = exports.DietType = exports.PrimaryGoals = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["Male"] = "Male";
    Gender["Female"] = "Female";
})(Gender || (exports.Gender = Gender = {}));
var PrimaryGoals;
(function (PrimaryGoals) {
    PrimaryGoals["BuildMuscle"] = "Build Muscle";
    PrimaryGoals["LoseWeight"] = "Lose Weight";
    PrimaryGoals["ImproveEndurance"] = "Improve Endurance";
    PrimaryGoals["IncreaseFlexibility"] = "Increase Flexibility";
    PrimaryGoals["BoostEnergy"] = "Boost Energy";
    PrimaryGoals["EnhanceMentalHealth"] = "Enhance Mental health";
    PrimaryGoals["GainWeight"] = "Gain Weight";
})(PrimaryGoals || (exports.PrimaryGoals = PrimaryGoals = {}));
var DietType;
(function (DietType) {
    DietType["Vegan"] = "Vegan";
    DietType["Vegetarian"] = "Vegetarian";
    DietType["NoPreference"] = "No Preference";
    DietType["KetoLowCarb"] = "Keto/Low Carb";
    DietType["GlutenFree"] = "Gluten-Free";
})(DietType || (exports.DietType = DietType = {}));
var Restrictions;
(function (Restrictions) {
    Restrictions["GlutenFree"] = "Gluten-Free";
    Restrictions["NutFree"] = "Nut-Free";
    Restrictions["DairyFree"] = "Dairy-Free";
})(Restrictions || (exports.Restrictions = Restrictions = {}));
var ActivityLevel;
(function (ActivityLevel) {
    ActivityLevel["Sedentary"] = "Sedentary (little to no exercise)";
    ActivityLevel["LightlyActive"] = "Lightly Active (light exercise 1-3 days/week)";
    ActivityLevel["ModeratelyActive"] = "Moderately Active (exercise 3-5 days/week)";
    ActivityLevel["VeryActive"] = "Very Active (hard exercise 6-7 days/week)";
    ActivityLevel["SuperActive"] = "Super Active (intense exercise every day)";
})(ActivityLevel || (exports.ActivityLevel = ActivityLevel = {}));
var Injury;
(function (Injury) {
    Injury["NoInjuries"] = "No Injuries";
    Injury["BackPain"] = "Back Pain";
    Injury["KneeIssues"] = "Knee Issues";
    Injury["ShoulderInjuries"] = "Shoulder Injuries";
    Injury["AnkleSprains"] = "Ankle Sprains";
})(Injury || (exports.Injury = Injury = {}));
var MovementDifficulty;
(function (MovementDifficulty) {
    MovementDifficulty["NoDifficulty"] = "No Difficulty";
    MovementDifficulty["OverheadMovements"] = "Overhead Movements";
    MovementDifficulty["DeepSquats"] = "Deep Squats";
    MovementDifficulty["RotationalMovements"] = "Rotational Movements";
    MovementDifficulty["ForwardBends"] = "Forward Bends";
})(MovementDifficulty || (exports.MovementDifficulty = MovementDifficulty = {}));
var MedicalCondition;
(function (MedicalCondition) {
    MedicalCondition["NoMedicalConditions"] = "No Medical Conditions";
    MedicalCondition["Asthma"] = "Asthma";
    MedicalCondition["HeartConditions"] = "Heart Conditions";
    MedicalCondition["Diabetes"] = "Diabetes";
    MedicalCondition["Arthritis"] = "Arthritis";
})(MedicalCondition || (exports.MedicalCondition = MedicalCondition = {}));
