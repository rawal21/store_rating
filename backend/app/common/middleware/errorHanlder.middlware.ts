import type { ErrorResponse } from "@/common/dio/response.dto";
import { type ErrorRequestHandler } from "express";
import { logger } from "@/common/service/logger.service";

// Prisma error code → HTTP status + message
const PRISMA_ERROR_MAP: Record<string, { status: number; message: string }> = {
  P2002: { status: 409, message: "A record with this value already exists" },
  P2025: { status: 404, message: "Record not found" },
  P2003: { status: 400, message: "Referenced record does not exist" },
  P2014: { status: 400, message: "Invalid relation data" },
};

const errorHandler: ErrorRequestHandler = (err, req, _res, next) => {
  // Map Prisma known errors to HTTP errors
  const prismaError = err?.code ? PRISMA_ERROR_MAP[err.code] : null;

  const status: number = prismaError?.status ?? err?.status ?? 500;
  const message: string = prismaError?.message ?? err?.message ?? "Something went wrong!";

  if (status >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} → ${status} ${message}`, {
      stack: err?.stack,
    });
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} → ${status} ${message}`);
  }

  const response: ErrorResponse = {
    success: false,
    error_code: status,
    message,
    data: err?.data ?? {},
  };

  if (process.env.NODE_ENV !== "production" && err?.stack) {
    (response as any).stack = err.stack;
  }

  _res.status(status).json(response);
  next();
};

export default errorHandler;
