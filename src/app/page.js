'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import styles from './page.module.css';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salaryInput, setSalaryInput] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editDesc, setEditDesc] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/month?month=${currentMonth}`, { cache: 'no-store' });
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
        toast.success('Salary updated successfully!');
        fetchData();
      } else {
        toast.error('Failed to update salary');
      }
    } catch (error) {
      toast.error('An error occurred');
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
        toast.success('Expense added!');
        setExpenseAmount('');
        setExpenseDesc('');
        fetchData();
      } else {
        toast.error('Failed to add expense');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b',
      color: '#f8fafc'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch('/api/expenses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: currentMonth, expenseId })
      });
      if (res.ok) {
        toast.success('Expense deleted!');
        fetchData();
      } else {
        toast.error('Failed to delete expense');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEditClick = (expense) => {
    setEditingId(expense._id);
    setEditDesc(expense.description);
    setEditAmount(expense.amount);
  };

  const handleEditSubmit = async (expenseId) => {
    if (!editDesc || !editAmount) return;
    try {
      const res = await fetch('/api/expenses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: currentMonth,
          expenseId,
          description: editDesc,
          amount: editAmount
        })
      });
      if (res.ok) {
        toast.success('Expense updated!');
        setEditingId(null);
        fetchData();
      } else {
        toast.error('Failed to update expense');
      }
    } catch (error) {
      toast.error('An error occurred');
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

  const dailyLimit = remainingSalary / daysInMonth;

  return (
    <main className={`${styles.container} animate-fade-in`}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
      }} />
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
          <div className={styles.cardTitle}>Daily Budget ({daysInMonth} Days)</div>
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
              data.expenses.slice().reverse().map((expense) => (
                <div key={expense._id} className={styles.expenseItem}>
                  {editingId === expense._id ? (
                    <div className={styles.editForm}>
                      <input 
                        className={styles.input} 
                        value={editDesc} 
                        onChange={(e) => setEditDesc(e.target.value)} 
                        placeholder="Description"
                      />
                      <input 
                        className={styles.input} 
                        type="number"
                        value={editAmount} 
                        onChange={(e) => setEditAmount(e.target.value)} 
                        placeholder="Amount"
                      />
                      <div className={styles.editActions}>
                        <button className={styles.saveBtn} onClick={() => handleEditSubmit(expense._id)}>Save</button>
                        <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.expenseInfo}>
                        <span className={styles.expenseDesc}>{expense.description}</span>
                        <span className={styles.expenseDate}>
                          {new Date(expense.date).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className={styles.expenseRightContent}>
                        <div className={styles.expenseAmount}>
                          -Rs. {expense.amount.toLocaleString()}
                        </div>
                        <div className={styles.actionButtons}>
                          <button className={styles.iconBtn} onClick={() => handleEditClick(expense)}>✏️</button>
                          <button className={styles.iconBtn} onClick={() => handleDeleteExpense(expense._id)}>🗑️</button>
                        </div>
                      </div>
                    </>
                  )}
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
