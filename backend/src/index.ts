import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
dotenv.config();
import config from './config/config';
import { initDB } from './database';
import { swaggerSpec } from './config/swagger';
import memberRouter from './routes/member.routes';

const app = express();

app.use(cors({
  origin: '*',
}));


// middleware (to read JSON)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

// test route
app.get('/', (_: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

// routes
app.use("/api/v1/:gym_id/members", memberRouter)

// start server
app.listen(config.port, async () => {
  await initDB(__dirname + '/database/database.db');
  console.log(`Server running on http://localhost:${config.port}`);
});
