import { Router } from "express";
import { createExpense, deleteExpense, getAllExpenses, getExpenseById, getTotalByDateRange, getTotalByCategory, getTotalExpenses, getTotalExpensesByDateRange, updateExpense } from "../controllers/expensesController";
const router = Router();

/**
 * @swagger
 * /api/v1/expenses:
 *   post:
 *     tags: [Expenses]
 *     summary: Create a new expense
 *     description: Record a new expense and deduct from bank balance
 *     parameters:
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Electricity bill"
 *               amount:
 *                 type: number
 *                 example: 150.50
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-15"
 *               category:
 *                 type: string
 *                 example: "utilities"
 *               notes:
 *                 type: string
 *                 example: "Monthly electricity"
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Gym not found
 *       500:
 *         description: Internal server error
 */
router.post("/", createExpense);

/**
 * @swagger
 * /api/v1/expenses:
 *   get:
 *     tags: [Expenses]
 *     summary: Get all expenses
 *     description: Retrieve all expenses for the gym
 *     parameters:
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of expenses
 *       400:
 *         description: Invalid gym ID
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllExpenses);

/**
 * @swagger
 * /api/v1/expenses/{id}:
 *   get:
 *     tags: [Expenses]
 *     summary: Get expense by ID
 *     description: Retrieve a single expense by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense data
 *       400:
 *         description: Invalid expense ID
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getExpenseById);

/**
 * @swagger
 * /api/v1/expenses/{id}:
 *   put:
 *     tags: [Expenses]
 *     summary: Update an expense
 *     description: Update an existing expense by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated bill"
 *               amount:
 *                 type: number
 *                 example: 200
 *               date:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       400:
 *         description: Invalid expense ID
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateExpense);

/**
 * @swagger
 * /api/v1/expenses/{id}:
 *   delete:
 *     tags: [Expenses]
 *     summary: Delete an expense
 *     description: Delete an expense by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       400:
 *         description: Invalid expense ID
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteExpense);

/**
 * @swagger
 * /api/v1/expenses/total:
 *   get:
 *     tags: [Expenses]
 *     summary: Get total expenses
 *     description: Get the sum of all expenses
 *     parameters:
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Total expenses amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 5000
 *       404:
 *         description: No expenses found
 *       500:
 *         description: Internal server error
 */
router.get("/total", getTotalExpenses);

/**
 * @swagger
 * /api/v1/expenses/total-by-date-range:
 *   get:
 *     tags: [Expenses]
 *     summary: Get total expenses by date range
 *     description: Get total expenses between start and end dates
 *     parameters:
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *       - name: start
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-01-01"
 *       - name: end
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-12-31"
 *     responses:
 *       200:
 *         description: Total expenses for the date range
 *       400:
 *         description: Start and end dates are required
 *       500:
 *         description: Internal server error
 */
router.get("/total-by-date-range", getTotalExpensesByDateRange);

/**
 * @swagger
 * /api/v1/expenses/total-by-category:
 *   get:
 *     tags: [Expenses]
 *     summary: Get total expenses by category
 *     description: Get total expenses grouped by category within a date range
 *     parameters:
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *       - name: start
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - name: end
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Total expenses by category
 *       400:
 *         description: Start and end dates are required
 *       500:
 *         description: Internal server error
 */
router.get("/total-by-category", getTotalByCategory);

/**
 * @swagger
 * /api/v1/expenses/total-by-date-range/{start}/{end}:
 *   get:
 *     tags: [Expenses]
 *     summary: Get total expenses by date range (path params)
 *     description: Get total expenses between start and end dates via path parameters
 *     parameters:
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *       - name: start
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-01-01"
 *       - name: end
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-12-31"
 *     responses:
 *       200:
 *         description: Total expenses for the date range
 *       400:
 *         description: Start and end dates are required
 *       500:
 *         description: Internal server error
 */
router.get("/total-by-date-range/:start/:end", getTotalByDateRange);

export default router;
