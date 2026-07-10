import { betterAuth } from "better-auth";
import { pool } from "./db";

const productionUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
  baseURL: productionUrl,
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CORRETOR",
      },
      status: {
        type: "string",
        defaultValue: "ONLINE",
      }
    }
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://crm.localhost:3000",
    "https://crm.localhost:3000",
    "https://venacorseguros.com",
    "https://www.venacorseguros.com",
    "https://crm.venacorseguros.com",
    "http://venacorseguros.com",
    "http://www.venacorseguros.com",
    "http://crm.venacorseguros.com",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
});

