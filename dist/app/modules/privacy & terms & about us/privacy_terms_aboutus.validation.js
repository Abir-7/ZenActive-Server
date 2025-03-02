"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodAboutUsSchema = exports.zodTermsSchema = exports.zodPrivacySchema = void 0;
const zod_1 = require("zod");
exports.zodPrivacySchema = zod_1.z.object({
    body: zod_1.z.object({
        privacy: zod_1.z.string().optional(),
    }),
});
exports.zodTermsSchema = zod_1.z.object({
    body: zod_1.z.object({
        terms: zod_1.z.string().optional(),
    }),
});
exports.zodAboutUsSchema = zod_1.z.object({
    body: zod_1.z.object({
        about: zod_1.z.string().optional(),
    }),
});
