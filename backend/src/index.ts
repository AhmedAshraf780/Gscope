import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import config from './config/config';
import { initDB } from './database';

const app = express();

app.use(cors({
  origin: '*',
}));


// middleware (to read JSON)
app.use(express.json());

// test route
app.get('/', (req: Request, res: Response) => {
  console.log(req);
  console.log(res);
  res.send('Server is running 🚀');
});

// start server
app.listen(config.port, async () => {
  await initDB(__dirname + '/database/database.db');
  console.log(`Server running on http://localhost:${config.port}`);
});
