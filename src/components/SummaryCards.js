import React, { useState, useEffect } from 'react';
import styles from './SummaryCards.module.css';

export default function SummaryCards({ data, updateSalary }) {
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState('');
  const [salaryDateInput, setSalaryDateInput] = useState('');

  useEffect(() => {
    if (data) {
      setSalaryInput(data.salary || '');
      setSalaryDateInput(data.salaryDate || '');
    }
  }, [data]);

  const handleUpdateSalary = async (e) => {
    e.preventDefault();
    if (!salaryInput) return;
    const success = await updateSalary(salaryInput, salaryDateInput);
    if (success) {
      setIsEditingSalary(false);
    }
  };

  const salary = data?.salary || 0;
  const totalExpenses = data?.expenses?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const remainingSalary = salary - totalExpenses;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dailyLimit = remainingSalary / daysInMonth;

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <span>Monthly Salary</span>
          {!isEditingSalary && (
            <button onClick={() => setIsEditingSalary(true)} className={styles.editBtn}>✏️</button>
          )}
        </div>
        {isEditingSalary ? (
          <form onSubmit={handleUpdateSalary} className={styles.form}>
            <input
              type="number"
              className={styles.input}
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              placeholder="Amount"
              autoFocus
              required
            />

            <div className={styles.actions}>
              <button type="submit" className={styles.saveBtn}>Save</button>
              <button type="button" onClick={() => setIsEditingSalary(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <div className={`${styles.cardValue} ${styles.primary}`}>Rs. {salary.toLocaleString()}</div>

          </div>
        )}
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
  );
}
