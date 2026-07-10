import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { pool } from "./db";

function getBaseURL(): string {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return "http://localhost:3000";
}

function getTrustedOrigins(): string[] {
  const origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://meucrm.com.br",
    "https://api.meucrm.com.br",
    "http://meucrm.com.br",
    "http://api.meucrm.com.br",
  ];
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    origins.push(process.env.NEXT_PUBLIC_SITE_URL);
  }
  return origins;
}

const baseURL = getBaseURL();

export const auth = betterAuth({
  baseURL,
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(),
  ],
  advanced: {
    useSecureCookies: baseURL.startsWith("https"),
    crossSubDomainCookies: {
      enabled: !baseURL.includes("localhost"),
      domain: baseURL.includes("localhost")
        ? undefined
        : `.${new URL(baseURL).hostname.replace(/^(api|crm)\./, '')}`,
    },
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
  trustedOrigins: getTrustedOrigins(),
});

