import { Router } from "express";
import { createExpense, deleteExpense, getAllExpenses, getExpenseById, getTotalByDateRange, getTotalByCategory, getTotalExpenses, getTotalExpensesByDateRange, updateExpense } from "../controllers/expensesController";
const router = Router();

router.post("/", createExpense);
router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);
router.get("/total", getTotalExpenses);
router.get("/total-by-date-range", getTotalExpensesByDateRange);
router.get("/total-by-category", getTotalByCategory);
router.get("/total-by-date-range/:start/:end", getTotalByDateRange);

export default router;
