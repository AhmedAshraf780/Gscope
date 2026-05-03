export interface Expense {
    id?: number;
    title: string;
    amount: number;
    date: string;
    category: string;
    notes: string;
    created_at?: string;
}

export interface ExpensesDao {
    createExpense(expense: Expense): Promise<number | null>;
    getAllExpenses(): Promise<Expense[]>;
    getExpenseById(id: number): Promise<Expense | null>;
    updateExpense(expense: Expense): Promise<boolean>;
    deleteExpense(id: number): Promise<boolean>;
    getTotalExpenses(): Promise<number>;
    getExpensesByDateRange(start: string, end: string): Promise<Expense[]>;
    getTotalByDateRange(start: string, end: string): Promise<number>;
    getTotalByCategory(): Promise<{ category: string; total: number }[]>;
}