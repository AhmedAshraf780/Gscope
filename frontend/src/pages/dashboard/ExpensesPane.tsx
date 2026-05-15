import { useState } from "react";
import type { ExpenseEntry } from "./types";
import { expensesService } from "../../services/expenses.service";
import { isResponseSuccess, getResponseMessage } from "../../auth/authStorage";
import { useToast } from "../../toast/useToast";

interface ExpensesPaneProps {
  expenses: ExpenseEntry[];
  loadExpenses: () => Promise<void>;
}

export function ExpensesPane({ expenses, loadExpenses }: ExpensesPaneProps) {
  const { toast } = useToast();
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    category: "",
    notes: "",
  });
  const [editingExpense, setEditingExpense] = useState<ExpenseEntry | null>(
    null,
  );
  const [editExpenseForm, setEditExpenseForm] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    notes: "",
  });
  const [isExpenseCreating, setIsExpenseCreating] = useState(false);
  const [isExpenseUpdating, setIsExpenseUpdating] = useState(false);

  const handleAddExpense = async () => {
    if (!expenseForm.title || !expenseForm.amount) {
      toast({
        title: "Expense creation failed",
        description: "Title and amount are required.",
        kind: "error",
      });
      return;
    }

    setIsExpenseCreating(true);
    const response = await expensesService.addExpense(
      expenseForm.title.trim(),
      Number(expenseForm.amount),
      expenseForm.date,
      expenseForm.category.trim(),
      expenseForm.notes.trim(),
    );
    setIsExpenseCreating(false);

    if (!response || !isResponseSuccess(response)) {
      toast({
        title: "Expense creation failed",
        description: getResponseMessage(response),
        kind: "error",
      });
      return;
    }

    toast({
      title: "Expense created",
      description: "The expense was saved successfully.",
      kind: "success",
    });
    setExpenseForm({
      title: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      category: "",
      notes: "",
    });
    await loadExpenses();
  };

  const openEditExpense = (expense: ExpenseEntry) => {
    setEditingExpense(expense);
    setEditExpenseForm({
      title: expense.title,
      amount: String(expense.amount),
      date: expense.date,
      category: expense.category,
      notes: expense.notes,
    });
  };

  const closeEditExpense = () => {
    setEditingExpense(null);
  };

  const handleUpdateExpense = async () => {
    if (!editingExpense || !editExpenseForm.title || !editExpenseForm.amount) {
      toast({
        title: "Update failed",
        description: "Title and amount are required.",
        kind: "error",
      });
      return;
    }

    setIsExpenseUpdating(true);
    const response = await expensesService.updateExpense(
      editingExpense.id,
      editExpenseForm.title.trim(),
      Number(editExpenseForm.amount),
      editExpenseForm.date,
      editExpenseForm.category.trim(),
      editExpenseForm.notes.trim(),
    );
    setIsExpenseUpdating(false);

    if (!response || !isResponseSuccess(response)) {
      toast({
        title: "Update failed",
        description: getResponseMessage(response),
        kind: "error",
      });
      return;
    }

    toast({
      title: "Expense updated",
      description: "The expense was updated successfully.",
      kind: "success",
    });
    await loadExpenses();
    setEditingExpense(null);
  };

  const handleDeleteExpense = async (expense: ExpenseEntry) => {
    const response = await expensesService.deleteExpense(expense.id);
    if (!response || !isResponseSuccess(response)) {
      toast({
        title: "Delete failed",
        description: getResponseMessage(response),
        kind: "error",
      });
      return;
    }

    toast({
      title: "Expense deleted",
      description: "The expense was removed successfully.",
      kind: "success",
    });
    await loadExpenses();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">
            Expenses pane
          </p>
          <h2 className="mt-3 font-display text-3xl text-white">
            Track and manage gym expenses.
          </h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-[1.5rem] border border-white/10 bg-[#09111d] p-5 space-y-4 h-fit">
          <h3 className="font-display text-xl text-white">Add Expense</h3>
          <div className="space-y-3">
            <input
              value={expenseForm.title}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  title: e.target.value,
                })
              }
              placeholder="Title"
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
            />
            <input
              type="number"
              value={expenseForm.amount}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  amount: e.target.value,
                })
              }
              placeholder="Amount"
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
            />
            <input
              type="date"
              value={expenseForm.date}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  date: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
            />
            <input
              value={expenseForm.category}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  category: e.target.value,
                })
              }
              placeholder="Category"
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
            />
            <textarea
              value={expenseForm.notes}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  notes: e.target.value,
                })
              }
              placeholder="Notes"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
            />
            <button
              type="button"
              onClick={handleAddExpense}
              disabled={isExpenseCreating}
              className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
            >
              {isExpenseCreating ? "Creating..." : "Add Expense"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#09111d] p-5">
            <h3 className="mb-4 font-display text-xl text-white">
              Expense History
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-[var(--sand)] border-b border-white/10">
                  <tr>
                    {["Title", "Amount", "Date", "Category", "Notes"].map(
                      (col) => (
                        <th
                          key={col}
                          className="px-4 py-3 font-medium whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {expenses.length > 0 ? (
                    expenses.map((expense) => (
                      <tr
                        key={expense.id}
                        onClick={() => openEditExpense(expense)}
                        className="border-b border-white/5 text-[var(--muted)] cursor-pointer hover:bg-white/4 transition"
                      >
                        <td className="px-4 py-3 text-white whitespace-nowrap">
                          {expense.title}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          ${expense.amount}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {expense.category || "-"}
                        </td>
                        <td className="px-4 py-3 max-w-[200px] truncate">
                          {expense.notes || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-[var(--muted)]"
                      >
                        No expenses recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[1.5rem] border border-white/10 bg-[#0d1929] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-white">
                Edit Expense
              </h3>
              <button
                type="button"
                onClick={closeEditExpense}
                className="rounded-full p-2 text-[var(--muted)] hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <input
              value={editExpenseForm.title}
              onChange={(e) =>
                setEditExpenseForm((c) => ({
                  ...c,
                  title: e.target.value,
                }))
              }
              placeholder="Title"
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
            />

            <div className="grid gap-3 lg:grid-cols-2">
              <input
                type="number"
                value={editExpenseForm.amount}
                onChange={(e) =>
                  setEditExpenseForm((c) => ({
                    ...c,
                    amount: e.target.value,
                  }))
                }
                placeholder="Amount"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
              />
              <input
                type="date"
                value={editExpenseForm.date}
                onChange={(e) =>
                  setEditExpenseForm((c) => ({
                    ...c,
                    date: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
              />
            </div>

            <input
              value={editExpenseForm.category}
              onChange={(e) =>
                setEditExpenseForm((c) => ({
                  ...c,
                  category: e.target.value,
                }))
              }
              placeholder="Category"
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
            />

            <textarea
              value={editExpenseForm.notes}
              onChange={(e) =>
                setEditExpenseForm((c) => ({
                  ...c,
                  notes: e.target.value,
                }))
              }
              placeholder="Notes"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleUpdateExpense}
                disabled={isExpenseUpdating}
                className="flex-1 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
              >
                {isExpenseUpdating ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteExpense(editingExpense)}
                className="flex-1 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-rose-300 hover:bg-rose-500/20 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
