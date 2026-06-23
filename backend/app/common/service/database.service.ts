
import { PrismaClient } from "@prisma/client";
import rateLimit from "express-rate-limit";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg(connectionString!);
const prisma = new PrismaClient({ adapter });

export const initDB = async (): Promise<void> => {
  await prisma.$connect();
  console.log("db is connected ");
};

export const getPrisma = () => prisma;

// Apply to all requests
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "test" ? 0 : 100, // disable in test
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
});

// Apply to a auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 0 : 5, // disable in test
  message: "Too many login attempts, please try again later.",
  skip: () => process.env.NODE_ENV === "test",
});

