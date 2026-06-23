import winston from "winston";

const { combine, timestamp, colorize, printf, json, errors } = winston.format;

const isDev = process.env.NODE_ENV !== "production";

// Human-readable format for development
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  })
);

// Structured JSON for production / log aggregation
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  format: isDev ? devFormat : prodFormat,
  transports: [
    new winston.transports.Console(),
    // Persist errors to file regardless of environment
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

/**
 * Morgan stream adapter — pipes morgan HTTP logs into winston.
 */
export const morganStream = {
  write: (message: string) => logger.http(message.trim()),
};
