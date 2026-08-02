import React, { useState } from 'react';
import styles from './ExpenseForm.module.css';

export default function ExpenseForm({ addExpense }) {
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseAmount || !expenseDesc || !expenseDate) return;
    
    const success = await addExpense(expenseAmount, expenseDesc, expenseDate);
    if (success) {
      setExpenseAmount('');
      setExpenseDesc('');
      setExpenseDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <section className={styles.formSection}>
      <h2>Add New Expense</h2>
      <form onSubmit={handleAddExpense}>
        <div className={styles.formGroup}>
          <label>Date</label>
          <input
            type="date"
            className={styles.input}
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
          />
        </div>
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
  );
}
