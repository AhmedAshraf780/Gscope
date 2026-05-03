import { Request, Response } from 'express';
import { db } from '../database';

export const createExpense = async (req: Request, res: Response) => {
    try {
        const { title, amount, date, category, notes } = req.body;
        const gym_id = Number(req.gym_id);
        if (!gym_id || isNaN(gym_id)) {
            return res.status(400).json({ message: "invalide gym id" })
        }
        const gym = await db.getCompanyById(gym_id)
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" })
        }
        if (!title || !amount) {
            return res.status(400).json({ message: "Please provide name and amount" })
        }

        const expense = await db.createExpense({ title, amount, date, category, notes });
        res.status(201).json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllExpenses = async (_req: Request, res: Response) => {
    try {
        const gym_id = Number(_req.gym_id);

        if (!gym_id || isNaN(gym_id)) {
            return res.status(400).json({ message: "invalide gym id" })
        }
        const gym = db.getCompanyById(gym_id)
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" })
        }
        const expenses = await db.getAllExpenses();
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getExpenseById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const gym_id = Number(req.gym_id);
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "expense id is required" });
        }
        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(404).json({ message: "gym not found" });
        }
        const expense = await db.getExpenseById(Number(id));
        if (!expense) {
            return res.status(404).json({ message: "expense not found" });
        }
        return res.status(200).json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateExpense = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const gym_id = Number(req.gym_id);
        const { title, amount, date, category, notes } = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "expense id is required" });
        }
        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(404).json({ message: "gym not found" });
        }
        const expense = await db.updateExpense({ id: Number(id), title, amount, date, category, notes });
        if (!expense) {
            return res.status(404).json({ message: "expense not found" });
        }
        return res.status(200).json({ message: "expense updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteExpense = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const gym_id = Number(req.gym_id);

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "expense id is required" });
        }
        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(404).json({ message: "gym not found" });
        }
        const expense = await db.deleteExpense(Number(id));
        if (!expense) {
            return res.status(404).json({ message: "expense not found" });
        }
        return res.status(200).json({ message: "expense deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const getTotalExpenses = async (req: Request, res: Response) => {
    try {
        const gym_id = Number(req.gym_id);
        if (!gym_id || isNaN(gym_id)) {
            return res.status(400).json({ message: "invalide gym id" })
        }
        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(404).json({ message: "gym not found" });
        }
        const total = await db.getTotalExpenses();
        if (!total) {
            return res.status(404).json({ message: "expenses not found" });
        }
        return res.status(200).json({ total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getTotalExpensesByDateRange = async (req: Request, res: Response) => {
    try {
        const gym_id = Number(req.gym_id);
        const { start, end } = req.query;

        if (!gym_id || isNaN(gym_id)) {
            return res.status(400).json({ message: "invalide gym id" })
        }
        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(404).json({ message: "gym not found" });
        }
        if (!start || !end) {
            return res.status(400).json({ message: "start and end dates are required" });
        }
        const total = await db.getTotalByDateRange(start as string, end as string);
        if (!total) {
            return res.status(404).json({ message: "expenses not found" });
        }
        return res.status(200).json({ total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const getTotalByDateRange = async (req: Request, res: Response) => {
    try {
        const gym_id = Number(req.gym_id);
        const { start, end } = req.query;

        if (!gym_id || isNaN(gym_id)) {
            return res.status(400).json({ message: "invalide gym id" })
        }
        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(404).json({ message: "gym not found" });
        }
        if (!start || !end) {
            return res.status(400).json({ message: "start and end dates are required" });
        }
        const total = await db.getTotalByDateRange(start as string, end as string);
        if (!total) {
            return res.status(404).json({ message: "expenses not found" });
        }
        return res.status(200).json({ total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const getTotalByCategory = async (req: Request, res: Response) => {
    try {
        const gym_id = Number(req.gym_id);
        const { start, end } = req.query;

        if (!gym_id || isNaN(gym_id)) {
            return res.status(400).json({ message: "invalide gym id" })
        }
        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(404).json({ message: "gym not found" });
        }
        if (!start || !end) {
            return res.status(400).json({ message: "start and end dates are required" });
        }
        const total = await db.getTotalByCategory();
        if (total) {
            return res.status(404).json({ message: "expenses not found" });
        }
        return res.status(200).json({ results: total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}   
