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

  addExpense: async ({ month, amount, description, date }) => {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, amount, description, date }),
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

  updateExpense: async ({ month, expenseId, description, amount, date }) => {
    const res = await fetch('/api/expenses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, expenseId, description, amount, date }),
    });
    if (!res.ok) throw new Error('Failed to update expense');
    return res.json();
  },

  addIncome: async ({ month, amount, description, date }) => {
    const res = await fetch('/api/incomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, amount, description, date }),
    });
    if (!res.ok) throw new Error('Failed to add income');
    return res.json();
  },

  deleteIncome: async ({ month, incomeId }) => {
    const res = await fetch('/api/incomes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, incomeId }),
    });
    if (!res.ok) throw new Error('Failed to delete income');
    return res.json();
  },

  updateIncome: async ({ month, incomeId, description, amount, date }) => {
    const res = await fetch('/api/incomes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, incomeId, description, amount, date }),
    });
    if (!res.ok) throw new Error('Failed to update income');
    return res.json();
  }
};
