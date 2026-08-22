import React, { useState } from 'react';
import styles from './SavingsForm.module.css';

export default function SavingsForm({ addSavings }) {
  const [savingsAmount, setSavingsAmount] = useState('');
  const [savingsDesc, setSavingsDesc] = useState('');
  const [savingsDate, setSavingsDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddSavings = async (e) => {
    e.preventDefault();
    if (!savingsAmount || !savingsDesc || !savingsDate) return;
    
    const success = await addSavings(savingsAmount, savingsDesc, savingsDate);
    if (success) {
      setSavingsAmount('');
      setSavingsDesc('');
      setSavingsDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <section className={styles.formSection}>
      <h2>Add New Savings</h2>
      <form onSubmit={handleAddSavings}>
        <div className={styles.formGroup}>
          <label>Date</label>
          <input
            type="date"
            className={styles.input}
            value={savingsDate}
            onChange={(e) => setSavingsDate(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Goal/Description</label>
          <input
            type="text"
            className={styles.input}
            value={savingsDesc}
            onChange={(e) => setSavingsDesc(e.target.value)}
            placeholder="E.g., Emergency Fund, Vacation"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Amount (Rs.)</label>
          <input
            type="number"
            className={styles.input}
            value={savingsAmount}
            onChange={(e) => setSavingsAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <button type="submit" className={styles.button}>Add Savings</button>
      </form>
    </section>
  );
}
