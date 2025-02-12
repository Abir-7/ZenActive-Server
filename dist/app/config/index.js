"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.config = {
    server: {
        ip: process.env.IP_ADDRESS,
        port: parseInt(process.env.PORT),
        environment: process.env.NODE_ENV,
    },
    database: {
        url: process.env.DATABASE_URL,
    },
    security: {
        bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
        jwt: {
            secret: process.env.JWT_SECRET,
            expireIn: process.env.JWT_EXPIRE_IN || "30d",
            refreshSecret: process.env.JWT_REFRESH_SECRET,
            refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "90d",
        },
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    googleMaps: {
        apiKey: process.env.GOOGLE_MAPS,
    },
    email: {
        from: process.env.EMAIL_FROM,
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
    },
    firebase: {
        serviceType: process.env.SERVICE_TYPE,
        projectId: process.env.PROJECT_ID,
        privateKeyId: process.env.PRIVET_KEY_ID,
        privateKey: process.env.PRIVET_KEY,
        clientEmail: process.env.CLIENT_EMAIL,
        clientId: process.env.CLIENT_ID,
        authUri: process.env.AUTH_URI,
        tokenUri: process.env.TOKEN_URI,
        authProviderCertUrl: process.env.AUTH_PROVIDER_CERT_URL,
        clientCertUrl: process.env.CLIENT_CERT_URL,
        universeDomain: process.env.UNIVERSE_DOMAIN,
    },
};
