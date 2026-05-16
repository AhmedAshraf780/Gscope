import { NextFunction, Request, Response } from "express";
import { clients } from "..";

export const sseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const url = req.originalUrl;
  if (url.startsWith("/events") || url.startsWith("/monitor")) {
    return next();
  }

  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start; // 5ms

    const event = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      errorMsg: res.errorMsg,
      requestId: req.gym_id,
      duration,
      time: new Date().toISOString(),
    };

    const data = `data: ${JSON.stringify(event)}\n\n`;

    for (const client of clients) {
      client.write(data);
    }
  });
  next();
};
