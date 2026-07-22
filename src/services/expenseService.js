export const expenseService = {
  getExpenses: async (month) => {
    const res = await fetch(`/api/month?month=${month}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  },

  updateSalary: async ({ month, salary, salaryDate }) => {
    const res = await fetch('/api/month', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, salary, salaryDate }),
    });
    if (!res.ok) throw new Error('Failed to update salary');
    return res.json();
  },

  addExpense: async ({ month, amount, description }) => {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, amount, description }),
    });
    if (!res.ok) throw new Error('Failed to add expense');
    return res.json();
  },

  deleteExpense: async ({ month, expenseId }) => {
    const res = await fetch('/api/expenses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, expenseId }),
    });
    if (!res.ok) throw new Error('Failed to delete expense');
    return res.json();
  },

  updateExpense: async ({ month, expenseId, description, amount }) => {
    const res = await fetch('/api/expenses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, expenseId, description, amount }),
    });
    if (!res.ok) throw new Error('Failed to update expense');
    return res.json();
  }
};
