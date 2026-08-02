import React, { useState } from 'react';
import styles from './IncomeList.module.css';
import IncomeItem from './IncomeItem';

const ITEMS_PER_PAGE = 10;

export default function IncomeList({ incomes, deleteIncome, updateIncome }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!incomes || incomes.length === 0) {
    return (
      <section className={styles.incomesSection}>
        <h2>Recent Incomes</h2>
        <div className={styles.incomeList}>
          <p className={styles.emptyState}>No incomes recorded for this month yet.</p>
        </div>
      </section>
    );
  }

  // Sort by date descending (latest first)
  const sortedIncomes = [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(sortedIncomes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentIncomes = sortedIncomes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className={styles.incomesSection}>
      <h2>Recent Incomes</h2>
      <div className={styles.incomeList}>
        {currentIncomes.map((income) => (
          <IncomeItem
            key={income._id}
            income={income}
            deleteIncome={deleteIncome}
            updateIncome={updateIncome}
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
