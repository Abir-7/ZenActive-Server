import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  server: {
    ip: process.env.IP_ADDRESS,
    port: parseInt(process.env.PORT as string),
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
    port: parseInt(process.env.EMAIL_PORT as string),
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
  ai: {
    gemini_api_key: process.env.GEMINI_API_LEY,
  },
};
