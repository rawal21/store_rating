import dotenv from "dotenv";
import process from "process";
import path from "path";

export const loadConfig = () => {
  const env = process.env.NODE_ENV ?? "local";
  const basePath = path.join(process.cwd(), ".env");
  const filepath = path.join(process.cwd(), `.env.${env}`);
  const fallbackPath = path.join(process.cwd(), ".env.local");
  
  dotenv.config({ path: basePath }); // Load base .env first
  dotenv.config({ path: filepath }); // Override with env-specific
  dotenv.config({ path: fallbackPath }); // Fallback to local if test/other is missing or partial

};
