import React from 'react';
import styles from './Header.module.css';

export default function Header({ selectedMonth, setSelectedMonth }) {
  const [yearStr, monthStr] = selectedMonth.split('-');
  const monthName = new Date(yearStr, monthStr - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Expense Tracker</h1>
      <div className={styles.monthInputContainer}>
        <p className={styles.subtitle}>{monthName} Overview</p>
        <input 
          type="month" 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)} 
          className={styles.input} 
        />
      </div>
    </header>
  );
}
