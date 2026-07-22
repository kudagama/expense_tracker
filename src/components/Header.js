import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header({ selectedMonth, setSelectedMonth }) {
  const [yearStr, monthStr] = selectedMonth.split('-');
  const monthName = new Date(yearStr, monthStr - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <header className={styles.header}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <Link href="/profile" style={{ 
          background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', 
          borderRadius: '20px', fontSize: '0.9rem', color: 'var(--text-muted)',
          border: '1px solid var(--border-color)', transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = 'white'}
        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          My Profile
        </Link>
      </div>
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
