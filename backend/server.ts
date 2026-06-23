import { loadConfig } from "@/common/helper/config.helper";
loadConfig();

import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";

import { logger, morganStream } from "@/common/service/logger.service";
import { initSwagger } from "@/common/service/swagger.service";
import { initPassport } from "@/common/service/jwt-service";
import { initDB } from "@/common/service/database.service";
import { globalLimiter } from "@/common/middleware/ratelimitor.middleware";
import errorHandler from "@/common/middleware/errorHanlder.middlware";
import routes from "@routes";
import { type IUser } from "@/user/user.dto";

// ── Global type augmentation ──────────────────────────────────────────────────
declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> {}
    interface Request {
      user?: User;
    }
  }
}

const port = Number(process.env.PORT || 3000);

export const app: Express = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(
  helmet({
    // Allow Swagger UI to load its own scripts/styles inline
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3001"],
    credentials: true,
  })
);

// ── HTTP request logging (morgan → winston) ───────────────────────────────────
app.use(
  morgan("combined", { stream: morganStream })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(globalLimiter);

// ── Static files ──────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ── Swagger UI ────────────────────────────────────────────────────────────────
initSwagger(app);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", docs: "/api/docs" });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api", routes);

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Bootstrap ────────────────────────────────────────────────────────────────
const initApp = async (): Promise<void> => {
  try {
    await initDB();
    initPassport();

    app.listen(port, () => {
      logger.info(`🚀  Server running on http://localhost:${port}`);
      logger.info(`📄  Swagger UI:      http://localhost:${port}/api/docs`);
    });
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
};

void initApp();
