import { betterAuth } from "better-auth";
import { pool } from "./db";

export const auth = betterAuth({
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
  // Ensure that the domain is trusted
  trustedOrigins: [
    "http://localhost:3000",
    "http://crm.localhost:3000",
    "https://crm.localhost:3000",
    "https://venacorseguros.com",
    "https://www.venacorseguros.com",
    "https://crm.venacorseguros.com",
    "http://venacorseguros.com",
    "http://www.venacorseguros.com",
    "http://crm.venacorseguros.com"
  ],
});

