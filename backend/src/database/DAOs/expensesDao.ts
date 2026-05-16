export interface Expense {
  id?: number;
  gym_id: number;
  title: string;
  amount: number;
  date: string;
  category?: string;
  notes?: string;
  created_at?: string;
}

export interface ExpensesDao {
  createExpense(expense: Expense): Promise<number | null>;
  getAllExpenses(gym_id: number): Promise<Expense[]>;
  getExpenseById(id: number, gym_id: number): Promise<Expense | null>;
  updateExpense(expense: Expense): Promise<boolean>;
  deleteExpense(id: number): Promise<boolean>;
  getTotalExpenses(gym_id: number): Promise<number>;
  getExpensesByDateRange(gym_id: number, start: string, end: string): Promise<Expense[]>;
  getTotalByDateRange(gym_id: number, start: string, end: string): Promise<number>;
  getTotalByCategory(gym_id: number): Promise<{ category: string; total: number }[]>;
}
