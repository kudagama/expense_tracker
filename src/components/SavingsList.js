import React, { useState } from 'react';
import styles from './SavingsList.module.css';
import SavingsItem from './SavingsItem';

const ITEMS_PER_PAGE = 10;

export default function SavingsList({ savings, deleteSavings, updateSavings }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!savings || savings.length === 0) {
    return (
      <section className={styles.savingsSection}>
        <h2>Recent Savings</h2>
        <div className={styles.savingsList}>
          <p className={styles.emptyState}>No savings recorded for this month yet.</p>
        </div>
      </section>
    );
  }

  // Sort by date descending (latest first)
  const sortedSavings = [...savings].sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(sortedSavings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSavings = sortedSavings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className={styles.savingsSection}>
      <h2>Recent Savings</h2>
      <div className={styles.savingsList}>
        {currentSavings.map((saving) => (
          <SavingsItem
            key={saving._id}
            saving={saving}
            deleteSavings={deleteSavings}
            updateSavings={updateSavings}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageBtn} 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className={styles.pageBtn} 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
