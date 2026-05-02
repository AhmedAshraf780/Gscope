import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
dotenv.config();
import config from "./config/config";
import { initDB } from "./database";
import { swaggerSpec } from "./config/swagger";
import memberRouter from "./routes/member.routes";
import authRouter from "./routes/auth.routes";

import logsRouter from "./routes/logs.routes";
import companyRouter from "./routes/company.routes";
import { connectRedis } from "./config/redis";
import path from "path";
import { sseMiddleware } from "./middlewares/sse.middleware";
import { authMiddleware } from "./middlewares/auth.middleware";
import cookieParser from "cookie-parser";
import bankRouter from "./routes/bank.routes";
import offerRouter from "./routes/offer.routes";
import reportRouter from "./routes/report.routes";

declare global {
  namespace Express {
    interface Request {
      gym_id?: number;
    }
  }
}
export const clients: Response[] = [];
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// middleware (to read JSON)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(sseMiddleware);
app.use(cookieParser());

app.get("/monitor", (_, res: Response) => {
  res.sendFile(path.join(__dirname, "monitor", "index.html"));
});

app.get("/events", (req, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  clients.push(res);

  req.on("close", () => {
    const index = clients.indexOf(res);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

// test route
app.get("/", (_: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/members", authMiddleware, memberRouter);
app.use("/api/v1/companies", authMiddleware, companyRouter);
app.use("/api/v1/logs", authMiddleware, logsRouter);
app.use("/api/v1/bank", authMiddleware, bankRouter);
app.use("/api/v1/offers", authMiddleware, offerRouter);
app.use("/api/v1/reports", authMiddleware, reportRouter);

// start server
app.listen(config.port, async () => {
  await initDB(__dirname + "/database/database.db");
  await connectRedis();
  console.log(`Server running on http://localhost:${config.port}`);
});
