"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapInterval = void 0;
const mapInterval = (interval) => {
    if (interval === "half-year") {
        return "month";
    }
    return interval;
};
exports.mapInterval = mapInterval;
