import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

// middleware (to read JSON)
app.use(express.json());

// test route
app.get('/', (req: Request, res: Response) => {
    console.log(req);
    console.log(res);
    res.send('Server is running 🚀');
});

// start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});