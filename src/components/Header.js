import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header({ selectedMonth, setSelectedMonth }) {
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;

  const monthName = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const startDate = new Date(year, month, 23);
  const endDate = new Date(year, month + 1, 22);

  const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dateRangeStr = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  return (
    <header className={styles.header}>
      <div className={styles.headerActions}>
        <Link href="/profile" className={styles.profileLink}>
          My Profile
        </Link>
      </div>
      <h1 className={styles.title}>Expense Tracker</h1>
      <div className={styles.monthInputContainer}>
        <div className={styles.titleGroup}>
          <p className={styles.subtitle}>{monthName} Overview</p>
          <span className={styles.dateRange}>({dateRangeStr})</span>
        </div>
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
