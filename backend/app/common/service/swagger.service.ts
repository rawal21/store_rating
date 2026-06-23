import { type Express, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";

const swaggerFilePath = path.join(process.cwd(), "swagger.json");

const getSwaggerDocument = () => {
  if (!fs.existsSync(swaggerFilePath)) return null;
  return JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
};

/**
 * Mounts Swagger UI at /api/docs.
 * Reads swagger.json on every request so spec changes reflect without restart.
 */
export const initSwagger = (app: Express): void => {
  if (!fs.existsSync(swaggerFilePath)) {
    console.warn("[Swagger] swagger.json not found — skipping Swagger UI");
    return;
  }

  const options: swaggerUi.SwaggerUiOptions = {
    customSiteTitle: "Store Rating API Docs",
    customCss: ".swagger-ui .topbar { display: none }",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
      url: "/api/docs.json",   // ← Swagger UI fetches spec from this endpoint
    },
  };

  // Serve the raw spec — always reads fresh from disk
  app.get("/api/docs.json", (_req: Request, res: Response) => {
    const doc = getSwaggerDocument();
    if (!doc) return res.status(404).json({ error: "swagger.json not found" });
    res.setHeader("Content-Type", "application/json");
    res.json(doc);
  });

  // Mount the UI — it will load the spec from /api/docs.json above
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(undefined, options));
};
