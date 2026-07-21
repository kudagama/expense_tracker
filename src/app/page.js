'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salaryInput, setSalaryInput] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/month?month=${currentMonth}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setSalaryInput(json.salary || '');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSalary = async (e) => {
    e.preventDefault();
    if (!salaryInput) return;
    try {
      const res = await fetch('/api/month', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: currentMonth, salary: Number(salaryInput) })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating salary:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseAmount || !expenseDesc) return;
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: currentMonth,
          amount: expenseAmount,
          description: expenseDesc
        })
      });
      if (res.ok) {
        setExpenseAmount('');
        setExpenseDesc('');
        fetchData();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>Loading your expenses...</div>
      </main>
    );
  }

  const salary = data?.salary || 0;
  const totalExpenses = data?.expenses?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const remainingSalary = salary - totalExpenses;

  // Calculate days remaining
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay = today.getDate();
  const remainingDays = daysInMonth - currentDay + 1; // including today

  const dailyLimit = remainingDays > 0 ? (remainingSalary / remainingDays) : remainingSalary;

  return (
    <main className={`${styles.container} animate-fade-in`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Expense Tracker</h1>
        <p className={styles.subtitle}>{monthName} Overview</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Monthly Salary</div>
          <div className={`${styles.cardValue} ${styles.primary}`}>Rs. {salary.toLocaleString()}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Total Expenses</div>
          <div className={`${styles.cardValue} ${styles.danger}`}>Rs. {totalExpenses.toLocaleString()}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Remaining Balance</div>
          <div className={`${styles.cardValue} ${styles.success}`}>Rs. {remainingSalary.toLocaleString()}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Daily Spend Limit ({remainingDays} Days)</div>
          <div className={`${styles.cardValue} ${styles.warning}`}>Rs. {dailyLimit.toFixed(2)}</div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section className={styles.formSection}>
            <h2>Update Salary</h2>
            <form onSubmit={handleUpdateSalary}>
              <div className={styles.formGroup}>
                <label>Salary Amount (Rs.)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  placeholder="Enter your monthly salary"
                  required
                />
              </div>
              <button type="submit" className={styles.button}>Save Salary</button>
            </form>
          </section>

          <section className={styles.formSection}>
            <h2>Add New Expense</h2>
            <form onSubmit={handleAddExpense}>
              <div className={styles.formGroup}>
                <label>Description</label>
                <input
                  type="text"
                  className={styles.input}
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  placeholder="What did you spend on?"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Amount (Rs.)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <button type="submit" className={styles.button}>Add Expense</button>
            </form>
          </section>
        </div>

        <section className={styles.expensesSection}>
          <h2>Recent Expenses</h2>
          <div className={styles.expenseList}>
            {data?.expenses?.length > 0 ? (
              data.expenses.slice().reverse().map((expense, i) => (
                <div key={i} className={styles.expenseItem}>
                  <div className={styles.expenseInfo}>
                    <span className={styles.expenseDesc}>{expense.description}</span>
                    <span className={styles.expenseDate}>
                      {new Date(expense.date).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className={styles.expenseAmount}>
                    -Rs. {expense.amount.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No expenses recorded for this month yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
