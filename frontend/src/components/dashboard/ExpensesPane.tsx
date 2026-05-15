import { useState } from "react";
import { useFormik } from "formik";
import { useToast } from "../../toast/useToast";
import { expensesService } from "../../services/expenses.service";
import { isResponseSuccess, getResponseMessage } from "../../auth/authStorage";

type ExpenseEntry = {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  notes: string;
};

interface ExpensesPaneProps {
  expenses: ExpenseEntry[];
  loadExpenses: () => Promise<void>;
}

export function ExpensesPane({ expenses, loadExpenses }: ExpensesPaneProps) {
  const { toast } = useToast();
  const [editingExpense, setEditingExpense] = useState<ExpenseEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const addForm = useFormik({
    initialValues: {
      title: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      notes: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.title) errors.title = "Required";
      if (!values.amount) errors.amount = "Required";
      if (!values.date) errors.date = "Required";
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const response = await expensesService.addExpense(
        values.title.trim(),
        Number(values.amount) || 0,
        values.date,
        values.category.trim() || "General",
        values.notes.trim()
      );

      if (!response || !isResponseSuccess(response)) {
        toast({
          title: "Expense creation failed",
          description: getResponseMessage(response),
          kind: "error",
        });
      } else {
        toast({
          title: "Expense added",
          description: "The expense was saved successfully.",
          kind: "success",
        });
        await loadExpenses();
        resetForm();
      }
      setSubmitting(false);
    },
  });

  const openEditExpense = (expense: ExpenseEntry) => {
    setEditingExpense(expense);
    editForm.setValues({
      title: expense.title,
      amount: String(expense.amount),
      date: new Date(expense.date).toISOString().split("T")[0],
      category: expense.category || "",
      notes: expense.notes || "",
    });
  };

  const closeEditExpense = () => {
    setEditingExpense(null);
  };

  const editForm = useFormik({
    initialValues: {
      title: "",
      amount: "",
      date: "",
      category: "",
      notes: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.title) errors.title = "Required";
      if (!values.amount) errors.amount = "Required";
      if (!values.date) errors.date = "Required";
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!editingExpense) return;
      const id = Number(editingExpense.id);

      const response = await expensesService.updateExpense(
        String(id),
        values.title.trim(),
        Number(values.amount) || 0,
        values.date,
        values.category.trim() || "General",
        values.notes.trim()
      );

      if (!response || !isResponseSuccess(response)) {
        toast({
          title: "Expense update failed",
          description: getResponseMessage(response),
          kind: "error",
        });
      } else {
        toast({
          title: "Expense updated",
          description: "The expense was updated successfully.",
          kind: "success",
        });
        await loadExpenses();
        closeEditExpense();
      }
      setSubmitting(false);
    },
  });

  const handleDeleteExpense = async (expense: ExpenseEntry) => {
    const id = Number(expense.id);
    setIsDeleting(true);
    const response = await expensesService.deleteExpense(String(id));
    setIsDeleting(false);

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
    closeEditExpense();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">Expenses pane</p>
          <h2 className="mt-3 font-display text-3xl text-white">Track and manage gym expenses.</h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-[1.5rem] border border-white/10 bg-[#09111d] p-5 space-y-4 h-fit">
          <h3 className="font-display text-xl text-white">Add Expense</h3>
          <form onSubmit={addForm.handleSubmit} className="space-y-3">
            <input
              name="title"
              value={addForm.values.title}
              onChange={addForm.handleChange}
              placeholder="Title"
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
            />
            {addForm.errors.title && addForm.touched.title && <p className="text-xs text-red-400 mt-1">{String(addForm.errors.title)}</p>}
            
            <input
              type="number"
              name="amount"
              value={addForm.values.amount}
              onChange={addForm.handleChange}
              placeholder="Amount"
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
            />
            {addForm.errors.amount && addForm.touched.amount && <p className="text-xs text-red-400 mt-1">{String(addForm.errors.amount)}</p>}
            
            <input
              type="date"
              name="date"
              value={addForm.values.date}
              onChange={addForm.handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
            />
            {addForm.errors.date && addForm.touched.date && <p className="text-xs text-red-400 mt-1">{String(addForm.errors.date)}</p>}
            
            <input
              name="category"
              value={addForm.values.category}
              onChange={addForm.handleChange}
              placeholder="Category"
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
            />
            
            <textarea
              name="notes"
              value={addForm.values.notes}
              onChange={addForm.handleChange}
              placeholder="Notes"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
            />
            
            <button
              type="submit"
              disabled={addForm.isSubmitting}
              className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] disabled:opacity-50"
            >
              {addForm.isSubmitting ? "Creating..." : "Add Expense"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#09111d] p-5">
            <h3 className="mb-4 font-display text-xl text-white">Expense History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-[var(--sand)] border-b border-white/10">
                  <tr>
                    {["Title", "Amount", "Date", "Category", "Notes"].map((col) => (
                      <th key={col} className="px-4 py-3 font-medium whitespace-nowrap">
                        {col}
                      </th>
                    ))}
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
                        <td className="px-4 py-3 text-white whitespace-nowrap">{expense.title}</td>
                        <td className="px-4 py-3 whitespace-nowrap">${expense.amount}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{expense.category || "-"}</td>
                        <td className="px-4 py-3 max-w-[200px] truncate">{expense.notes || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[var(--muted)]">
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
              <h3 className="font-display text-xl text-white">Edit Expense</h3>
              <button type="button" onClick={closeEditExpense} className="rounded-full p-2 text-[var(--muted)] hover:text-white transition">
                ✕
              </button>
            </div>

            <form onSubmit={editForm.handleSubmit} className="space-y-4">
              <input
                name="title"
                value={editForm.values.title}
                onChange={editForm.handleChange}
                placeholder="Title"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
              />

              <div className="grid gap-3 lg:grid-cols-2">
                <input
                  type="number"
                  name="amount"
                  value={editForm.values.amount}
                  onChange={editForm.handleChange}
                  placeholder="Amount"
                  className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                />
                <input
                  type="date"
                  name="date"
                  value={editForm.values.date}
                  onChange={editForm.handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                />
              </div>

              <input
                name="category"
                value={editForm.values.category}
                onChange={editForm.handleChange}
                placeholder="Category"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
              />

              <textarea
                name="notes"
                value={editForm.values.notes}
                onChange={editForm.handleChange}
                placeholder="Notes"
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={editForm.isSubmitting}
                  className="flex-1 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] disabled:opacity-50"
                >
                  {editForm.isSubmitting ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteExpense(editingExpense)}
                  disabled={isDeleting}
                  className="flex-1 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-rose-300 hover:bg-rose-500/20 transition disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
