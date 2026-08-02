import React, { useState } from 'react';
import styles from './IncomeForm.module.css';

export default function IncomeForm({ addIncome }) {
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDesc, setIncomeDesc] = useState('');
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!incomeAmount || !incomeDesc || !incomeDate) return;
    
    const success = await addIncome(incomeAmount, incomeDesc, incomeDate);
    if (success) {
      setIncomeAmount('');
      setIncomeDesc('');
      setIncomeDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <section className={styles.formSection}>
      <h2>Add New Income</h2>
      <form onSubmit={handleAddIncome}>
        <div className={styles.formGroup}>
          <label>Date</label>
          <input
            type="date"
            className={styles.input}
            value={incomeDate}
            onChange={(e) => setIncomeDate(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Source/Description</label>
          <input
            type="text"
            className={styles.input}
            value={incomeDesc}
            onChange={(e) => setIncomeDesc(e.target.value)}
            placeholder="E.g., Freelance, Bonus, Gift"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Amount (Rs.)</label>
          <input
            type="number"
            className={styles.input}
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <button type="submit" className={styles.button}>Add Income</button>
      </form>
    </section>
  );
}
